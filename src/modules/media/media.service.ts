import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Media, MediaDocument } from '@schemas/media.schema';
import { CreateMediaDto } from '@dto/create-media.dto';
import { DbStorageService } from '@services/dbstorage.service';

@Injectable()
export class MediaService {
  constructor(
    @InjectModel(Media.name) private readonly mediaModel: Model<MediaDocument>,
    private readonly dbStorageService: DbStorageService) {}

  async uploadFile(file: Express.Multer.File, body: CreateMediaDto): Promise<Media> {
    let url: string;
    const useCloud = process.env.STORAGE_TYPE === 'cloud';
    if (useCloud) {
      // return this.cloudStorageService.uploadFile(file);
    } else {
      url = await this.dbStorageService.saveFile(
        file,
        body.media[0].mediaType as 'image' | 'video' | 'audio',
        body.unsafeZoneId,
      );
    }
    const media = new this.mediaModel({
      uploadedBy: body.uploadedBy,
      unsafeZoneId: body.unsafeZoneId,
      media: [{
        url: url,
        mediaName: file.originalname,
        mediaType: file.mimetype,
        size: file.size,
        storageType: process.env.STORAGE_TYPE,
      }],
    });
    return media.save();
  }

  async getMediaByZoneId(zoneId: string) {
    if (!zoneId) throw new BadRequestException("Zone Id is missing");

    const media = await this.mediaModel.find({ unsafeZoneId: zoneId });
    if (!media) throw new NotFoundException("No media found for this zone");

    return media;
  }
}
