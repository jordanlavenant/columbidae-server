import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/prisma.service'
import { CreateAssetDto } from './dto/create-asset.dto'
import { Asset, Prisma } from 'generated/prisma/browser'

@Injectable()
export class AssetsService {
  constructor(
    private prisma: PrismaService,
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
}
