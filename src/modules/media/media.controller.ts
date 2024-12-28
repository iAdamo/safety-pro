import {
  Controller,
  UploadedFile,
  UseInterceptors,
  Body,
  Post,
  Patch,
  Get,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { MediaService } from '@services/media.service';
import { CreateMediaDto } from '@dto/create-media.dto';
import { JwtAuthGuard } from '@modules/jwt/jwt.guard';

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @ApiTags('media')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  @Post('upload')
  async uploadMedia(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: CreateMediaDto,
  ) {
    return this.mediaService.uploadFile(file, body);
  }

  @ApiTags('media')
  @UseGuards(JwtAuthGuard)
  @Get(':unsafeZoneId')
  async getMedia(@Param('unsafeZoneId') unsafeZoneId: string) {
    return this.mediaService.getMediaByZoneId(unsafeZoneId);
  }

}
