import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { AssetsService } from './asset.service'
import { Asset as AssetModel } from 'generated/prisma/browser'
import { CreateAssetDto } from './dto/create-asset.dto'
import { UploadAssetDto } from './dto/upload-asset.dto'
import { IUploadFile } from '@/minio/minio.service'

@Controller('api/assets')
export class AssetsController {
  constructor(private readonly appService: AssetsService) {}

  @Get()
  async getAll(): Promise<AssetModel[]> {
    return this.appService.assets({})
  }

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 100 * 1024 * 1024 }, // 100MB max
    }),
  )
  async uploadFile(
    @UploadedFile() file: IUploadFile,
    @Body() body: UploadAssetDto,
  ): Promise<AssetModel> {
    if (!file) {
      throw new BadRequestException('Aucun fichier fourni')
    }
    return this.appService.uploadFile(file, body.folder || 'assets')
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
