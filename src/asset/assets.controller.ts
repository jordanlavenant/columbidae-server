import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
} from '@nestjs/common'
import { AssetsService } from './asset.service'
import { Asset as AssetModel } from 'generated/prisma/browser'
import { CreateAssetDto } from './dto/create-asset.dto'

@Controller('api/assets')
export class AssetsController {
  constructor(
    private readonly appService: AssetsService,
  ) {}

  @Get()
  async getAll(): Promise<AssetModel[]> {
    return this.appService.assets({})
  }

  @Post()
  async create(@Body() createAssetDto: CreateAssetDto): Promise<AssetModel> {
    return this.appService.createAsset(createAssetDto)
  }

  @Get(':id')
  async getById(@Param('id') id: string): Promise<AssetModel | null> {
    return this.appService.asset({ id })
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<AssetModel> {
    return this.appService.deleteAsset({ id })
  }
}
