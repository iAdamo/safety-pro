import { Module } from '@nestjs/common';
import { DbStorageService } from '@services/dbstorage.service';
import { CloudstorageService } from '@services/cloudstorage.service';
import { MediaService } from '@services/media.service';
import { MediaController } from '@controllers/media.controller';
import { Media, MediaSchema } from '@schemas/media.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { ZoneModule } from '@modules/zone.module';
import { UsersModule } from '@modules/users.module';

@Module({
  imports: [
    UsersModule,
    ZoneModule,
    MongooseModule.forFeature([
      { name: Media.name, schema: MediaSchema },
    ]),
  ],
  providers: [DbStorageService, CloudstorageService, MediaService],
  controllers: [MediaController],
  exports: [MongooseModule],
})
export class MediaModule {}
