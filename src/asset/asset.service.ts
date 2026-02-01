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

  // Normalize asset name by replacing unsafe characters
  async normalizeAssetName(name: string): Promise<string> {
    return name.replace(/[^a-zA-Z0-9-_./]/g, '_')
  }

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

  async deleteAsset(where: Prisma.AssetWhereUniqueInput): Promise<Asset> {
    return this.prisma.asset
      .delete({
        where,
      })
      .then(async (asset) => {
        // Supprimer le fichier de MinIO
        await this.minioService.deleteFile(asset.key)
        return asset
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
    const { key, url, mimeType, size } = await this.minioService.uploadFile(
      file,
      folder,
    )

    const data: CreateAssetDto = {
      url,
      key,
      mimeType,
      size,
      fileName: await this.normalizeAssetName(file.originalname),
    }

    // Sauvegarder dans la BD
    return this.prisma.asset.create({
      data,
    })
  }
}
