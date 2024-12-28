import { Controller, Post, UseGuards, UseInterceptors, UploadedFiles, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { MediaService } from '@services/media.service';
import { CreateMediaDto } from '@dto/create-media.dto';
import { JwtAuthGuard } from '@modules/jwt/jwt.guard';

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @ApiTags('media')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileFieldsInterceptor([{ name: 'media', maxCount: 10 }]))
  @Post('upload')
  async uploadMedia(
    @UploadedFiles() files: { media?: Express.Multer.File[] },
    @Body() body: CreateMediaDto,
  ) {
    return this.mediaService.uploadFiles(files.media, body);
  }
}
