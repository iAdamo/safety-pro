import { Injectable } from '@nestjs/common';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

@Injectable()
export class DbStorageService {
  private readonly baseStoragePath = join(__dirname, '..', '..', 'media');

  async saveFile(media: Express.Multer.File, mediaType: 'image' | 'video' | 'audio', unsafeZoneId: string) {
    const storagePath = this.getStoragePath(mediaType, unsafeZoneId);
    await mkdir(storagePath, { recursive: true });
    const filePath = join(storagePath, media.originalname);
    await writeFile(filePath, media.buffer);
    return filePath;
  }

  private getStoragePath(mediaType: 'image' | 'video' | 'audio', unsafeZoneId: string): string {
    switch (mediaType) {
      case 'image':
        return join(this.baseStoragePath, 'images', unsafeZoneId);
      case 'video':
        return join(this.baseStoragePath, 'videos', unsafeZoneId);
      case 'audio':
        return join(this.baseStoragePath, 'audios', unsafeZoneId);
      default:
        throw new Error('Invalid media type');
    }
  }
}
