import { BadRequestException, Injectable } from '@nestjs/common'
import { PrismaService } from '@/prisma.service'
import { CreateAssetDto } from './dto/create-asset.dto'
import { Asset, Prisma } from 'generated/prisma/browser'
import { MinioService, IUploadFile } from '@/minio/minio.service'

@Injectable()
export class AssetsService {
  constructor(
    private prisma: PrismaService,
    private minioService: MinioService,
  ) {}

  async asset(
    assetWhereUniqueInput: Prisma.AssetWhereUniqueInput,
  ): Promise<Asset | null> {
    return this.prisma.asset.findUnique({
      where: assetWhereUniqueInput,
    })
  }

  async assets(params: {
    skip?: number
    take?: number
    cursor?: Prisma.AssetWhereUniqueInput
    where?: Prisma.AssetWhereInput
    orderBy?: Prisma.AssetOrderByWithRelationInput
  }): Promise<Asset[]> {
    const { skip, take, cursor, where, orderBy } = params
    return this.prisma.asset.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    })
  }

  async createAsset(data: CreateAssetDto): Promise<Asset> {
    return this.prisma.asset.create({
      data,
    })
  }

  async updateAsset(params: {
    where: Prisma.AssetWhereUniqueInput
    data: Prisma.AssetUpdateInput
  }): Promise<Asset> {
    const { data, where } = params
    return this.prisma.asset.update({
      data,
      where,
    })
  }

  async deleteAsset(where: Prisma.AssetWhereUniqueInput): Promise<Asset> {
    return this.prisma.asset.delete({
      where,
    })
  }

  async uploadFile(
    file: IUploadFile,
    folder: string = 'assets',
  ): Promise<Asset> {
    // Valider le type de fichier
    const allowedMimeTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/gif',
      'video/mp4',
      'video/webm',
      'video/quicktime',
    ]

    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        `Type de fichier non autorisé: ${file.mimetype}`,
      )
    }

    // Uploader vers MinIO
    const { key, url } = await this.minioService.uploadFile(file, folder)

    const data: CreateAssetDto = {
      url,
      key,
      mimeType: file.mimetype,
      size: file.size,
      fileName: file.originalname,
    }

    // Sauvegarder dans la BD
    return this.prisma.asset.create({
      data,
    })
  }
}
