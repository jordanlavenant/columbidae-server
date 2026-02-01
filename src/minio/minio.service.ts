import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as Minio from 'minio'
import { Readable } from 'stream'
import sharp from 'sharp'
import ffmpeg from 'fluent-ffmpeg'
import ffmpegPath from '@ffmpeg-installer/ffmpeg'
import { promisify } from 'util'
import { writeFile, unlink } from 'fs/promises'
import { join } from 'path'
import { tmpdir } from 'os'

ffmpeg.setFfmpegPath(ffmpegPath.path)

export interface IUploadFile {
  buffer: Buffer
  originalname: string
  mimetype: string
  size: number
}

@Injectable()
export class MinioService {
  private minioClient: Minio.Client
  private bucketName = process.env.MINIO_BUCKET || 'assets-columbidae'

  constructor(private configService: ConfigService) {
    this.minioClient = new Minio.Client({
      endPoint: this.configService.get('MINIO_ENDPOINT') || 'localhost',
      port: parseInt(this.configService.get('MINIO_PORT') || '9000'),
      useSSL: this.configService.get('MINIO_USE_SSL') === 'true',
      accessKey: this.configService.get('MINIO_ROOT_USER') || 'root',
      secretKey: this.configService.get('MINIO_ROOT_PASSWORD') || 'password',
    })
    this.ensureBucketExists()
  }

  async applyBucketPolicy(): Promise<void> {
    const bucketPolicy = JSON.stringify({
      Version: '2012-10-17',
      Statement: [
        {
          Effect: 'Allow',
          Principal: {
            AWS: ['*'],
          },
          Action: [
            's3:GetBucketLocation',
            's3:ListBucket',
            's3:ListBucketMultipartUploads',
          ],
          Resource: [`arn:aws:s3:::${this.bucketName}`],
        },
        {
          Effect: 'Allow',
          Principal: {
            AWS: ['*'],
          },
          Action: ['s3:GetObject', 's3:ListMultipartUploadParts'],
          Resource: [`arn:aws:s3:::${this.bucketName}/*`],
        },
      ],
    })
    await this.minioClient.setBucketPolicy(this.bucketName, bucketPolicy)
  }

  async ensureBucketExists(): Promise<void> {
    const bucketExists = await this.minioClient.bucketExists(this.bucketName)

    if (!bucketExists) {
      Logger.log(`✅  Creating bucket ${this.bucketName}`)
      await this.minioClient.makeBucket(this.bucketName)
      await this.applyBucketPolicy()
    } else {
      Logger.log(`❇️  Bucket ${this.bucketName} already exists`)
    }
  }

  // Normalize asset name by replacing unsafe characters
  async normalizeAssetName(name: string): Promise<string> {
    return name.replace(/[^a-zA-Z0-9-_./]/g, '_')
  }

  // Upload file with compression for images and videos
  async uploadFile(
    file: IUploadFile,
    folder: string,
  ): Promise<{ key: string; url: string; mimeType: string; size: number }> {
    const timestamp = Date.now()
    let processedBuffer = file.buffer
    let processedSize = file.size
    let processedMimetype = file.mimetype
    let fileExtension = file.originalname.split('.').pop() || 'file'

    // === COMPRESSION IMAGE ===
    if (file.mimetype.startsWith('image/')) {
      const result = await this.compressImage(file.buffer)
      processedBuffer = result.buffer
      processedSize = result.size
      processedMimetype = 'image/jpeg'
      fileExtension = 'jpg'
    }

    // === COMPRESSION VIDEO ===
    if (file.mimetype.startsWith('video/')) {
      const result = await this.compressVideo(file.buffer, file.originalname)
      processedBuffer = result.buffer
      processedSize = result.size
      processedMimetype = 'video/mp4'
      fileExtension = 'mp4'
    }

    const originalName = file.originalname.replace(
      /\.[^.]+$/,
      `.${fileExtension}`,
    )
    const normalizedKey = `${folder}/${timestamp}-${await this.normalizeAssetName(
      originalName,
    )}`

    const stream = Readable.from(processedBuffer)
    await this.minioClient.putObject(
      this.bucketName,
      normalizedKey,
      stream,
      processedSize,
      {
        'Content-Type': processedMimetype,
      },
    )

    const url = `${this.getMinioUrl()}/${this.bucketName}/${normalizedKey}`
    return {
      key: normalizedKey,
      url,
      mimeType: processedMimetype,
      size: processedSize,
    }
  }

  // ==================== COMPRESSION IMAGE ====================
  private async compressImage(
    buffer: Buffer,
  ): Promise<{ buffer: Buffer; size: number }> {
    const targetMinSize = 150 * 1024 // 150kb
    const targetMaxSize = 400 * 1024 // 400kb

    let compressedBuffer: Buffer

    // Quality 80
    compressedBuffer = await sharp(buffer)
      .jpeg({ quality: 80, progressive: true })
      .toBuffer()

    // Quality 60
    if (compressedBuffer.length > targetMaxSize) {
      compressedBuffer = await sharp(buffer)
        .jpeg({ quality: 60, progressive: true })
        .toBuffer()
    }

    // Resize if still too large
    if (compressedBuffer.length > targetMaxSize) {
      const metadata = await sharp(buffer).metadata()
      const scaleFactor = Math.sqrt(targetMaxSize / compressedBuffer.length)
      const newWidth = Math.floor((metadata.width || 1920) * scaleFactor)

      compressedBuffer = await sharp(buffer)
        .resize(newWidth, null, { withoutEnlargement: true })
        .jpeg({ quality: 70, progressive: true })
        .toBuffer()
    }

    // If too small, increase quality
    if (compressedBuffer.length < targetMinSize) {
      compressedBuffer = await sharp(buffer)
        .jpeg({ quality: 90, progressive: true })
        .toBuffer()
    }

    return {
      buffer: compressedBuffer,
      size: compressedBuffer.length,
    }
  }

  // ==================== COMPRESSION VIDEO ====================
  private async compressVideo(
    buffer: Buffer,
    originalName: string,
  ): Promise<{ buffer: Buffer; size: number }> {
    const tempInputPath = join(tmpdir(), `input-${Date.now()}-${originalName}`)
    const tempOutputPath = join(tmpdir(), `output-${Date.now()}.mp4`)

    try {
      // Écrire le buffer dans un fichier temporaire
      await writeFile(tempInputPath, buffer)

      // Compresser la vidéo avec ffmpeg
      await new Promise<void>((resolve, reject) => {
        ffmpeg(tempInputPath)
          .size('1280x?') // Limite à 1280px de largeur, hauteur auto
          .outputOptions([
            '-c:v libx264',
            '-profile:v baseline',
            '-level 3.0',
            '-pix_fmt yuv420p',
            '-crf 32',
            '-preset slower',
            '-c:a aac',
            '-b:a 96k',
            '-movflags +faststart',
          ])
          .on('end', () => resolve())
          .on('error', (err) => reject(err))
          .save(tempOutputPath)
      })

      // Lire le fichier compressé
      const compressedBuffer =
        await require('fs/promises').readFile(tempOutputPath)

      return {
        buffer: compressedBuffer,
        size: compressedBuffer.length,
      }
    } finally {
      // Nettoyer les fichiers temporaires
      try {
        await unlink(tempInputPath)
      } catch {}
      try {
        await unlink(tempOutputPath)
      } catch {}
    }
  }

  async deleteFile(key: string): Promise<void> {
    await this.minioClient.removeObject(this.bucketName, key)
  }

  private getMinioUrl(): string {
    const useSSL = this.configService.get('MINIO_USE_SSL') === 'true'
    const protocol = useSSL ? 'https' : 'http'
    const endpoint = this.configService.get('MINIO_ENDPOINT') || 'localhost'
    const port = this.configService.get('MINIO_PORT') || '9000'
    return `${protocol}://${endpoint}:${port}`
  }
}
