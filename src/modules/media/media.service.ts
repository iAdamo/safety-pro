import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Media, MediaDocument } from '@schemas/media.schema';
import { CreateMediaDto } from '@dto/create-media.dto';
import { DbStorageService } from '@services/dbstorage.service';

@Injectable()
export class MediaService {
  constructor(
    @InjectModel(Media.name) private readonly mediaModel: Model<MediaDocument>,
    private readonly dbStorageService: DbStorageService,
  ) {}

  async uploadFiles(
    files: Express.Multer.File[],
    body: CreateMediaDto,
  ): Promise<Media> {
    try {
      const mediaEntries = await Promise.all(files.map(async (file) => {
        const url = await this.dbStorageService.saveFile(
          file,
          file.mimetype.split('/')[0] as 'image' | 'video' | 'audio',
          body.uploadedBy,
          body.unsafeZoneId,
        );
        return {
          url: url,
          mediaName: file.originalname,
          mediaType: file.mimetype,
          size: file.size,
          storageType: process.env.STORAGE_TYPE,
        };
      }));

      const media = new this.mediaModel({
        uploadedBy: body.uploadedBy,
        unsafeZoneId: body.unsafeZoneId,
        media: mediaEntries,
      });
      return media.save();
    } catch (error) {
      console.log('error', error);
      throw new BadRequestException('Error uploading files');
    }
  }

  async getMediaByZoneId(zoneId: string) {
    if (!zoneId) throw new BadRequestException('Zone Id is missing');

    const media = await this.mediaModel.find({ unsafeZoneId: zoneId });
    if (!media) throw new NotFoundException('No media found for this zone');

    return media;
  }
}
