import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as Minio from 'minio'
import { Readable } from 'stream'
import sharp from 'sharp'

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

  async uploadFile(
    file: IUploadFile,
    folder: string,
  ): Promise<{ key: string; url: string; mimeType: string; size: number }> {
    const timestamp = Date.now()
    // Changer l'extension en .jpg pour toutes les images
    const originalName = file.originalname.replace(/\.[^.]+$/, '.jpg')
    const key = `${folder}/${timestamp}-${originalName}`

    let processedBuffer = file.buffer
    let processedSize = file.size
    let processedMimetype = file.mimetype

    // Compresser si c'est une image
    if (file.mimetype.startsWith('image/')) {
      const result = await this.compressImage(file.buffer)
      processedBuffer = result.buffer
      processedSize = result.size
      processedMimetype = 'image/jpeg'
    }

    const stream = Readable.from(processedBuffer)
    await this.minioClient.putObject(
      this.bucketName,
      key,
      stream,
      processedSize,
      {
        'Content-Type': processedMimetype,
      },
    )

    const url = `${this.getMinioUrl()}/${this.bucketName}/${key}`
    return { key, url, mimeType: processedMimetype, size: processedSize }
  }

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
