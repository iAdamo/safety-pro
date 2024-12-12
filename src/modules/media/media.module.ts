import { Module } from '@nestjs/common';
import { DbstorageService } from '@services/dbstorage.service';
import { CloudstorageService } from '@services/cloudstorage.service';
import { MediaService } from '@services/media.service';
import { MediaController } from '@controllers/media.controller';

@Module({
  providers: [DbstorageService, CloudstorageService, MediaService],
  controllers: [MediaController]
})
export class MediaModule {}
