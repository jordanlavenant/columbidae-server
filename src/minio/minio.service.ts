import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as Minio from 'minio'
import { Readable } from 'stream'

export interface IUploadFile {
  buffer: Buffer
  originalname: string
  mimetype: string
  size: number
}

@Injectable()
export class MinioService {
  private minioClient: Minio.Client
  private bucketName = 'media'

  constructor(private configService: ConfigService) {
    this.minioClient = new Minio.Client({
      endPoint: this.configService.get('MINIO_ENDPOINT') || 'localhost',
      port: parseInt(this.configService.get('MINIO_PORT') || '9000'),
      useSSL: this.configService.get('MINIO_USE_SSL') === 'true',
      accessKey: this.configService.get('MINIO_ROOT_USER') || 'root',
      secretKey: this.configService.get('MINIO_ROOT_PASSWORD') || 'password',
    })
  }

  async uploadFile(
    file: IUploadFile,
    folder: string,
  ): Promise<{ key: string; url: string }> {
    const timestamp = Date.now()
    const key = `${folder}/${timestamp}-${file.originalname}`

    const stream = Readable.from(file.buffer)
    await this.minioClient.putObject(this.bucketName, key, stream, file.size, {
      'Content-Type': file.mimetype,
    })

    const url = `${this.getMinioUrl()}/${this.bucketName}/${key}`
    return { key, url }
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
