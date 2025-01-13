import { Injectable } from '@nestjs/common';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { UserServiceV1 } from '@services/user.service';
import { UnsafeZoneService } from '@modules/v1/unsafezone/unsafezone.service';

@Injectable()
export class DbStorageService {
  private readonly baseStoragePath = join(__dirname, '..', '..', '..', '..', 'uploads');
  private readonly baseUrl = `${process.env.BASE_URL}/uploads`;

  constructor(
    private readonly userService: UserServiceV1, // Service to fetch user details
    private readonly unsafeZoneService: UnsafeZoneService // Service to fetch unsafe zone details
  ) {}

  async saveFile(
    media: Express.Multer.File,
    mediaType: 'image' | 'video' | 'audio',
    uploadedBy: string,
    unsafeZoneId: string
  ) {
    const { email, title } = await this.getEmailAndTitle(uploadedBy, unsafeZoneId);
    const storagePath = this.getStoragePath(mediaType, email, title);
    await mkdir(storagePath, { recursive: true });
    const filePath = join(storagePath, media.originalname);
    await writeFile(filePath, media.buffer);
    const fileUrl = `${this.baseUrl}/${mediaType}s/${email}/${title}/${media.originalname}`;
    return fileUrl;
  }

  private async getEmailAndTitle(uploadedBy: string, unsafeZoneId: string): Promise<{ email: string, title: string }> {
    const user = await this.userService.findOne({ id: uploadedBy });
    const unsafeZone = await this.unsafeZoneService.findOne(unsafeZoneId);
    return { email: user.email, title: unsafeZone.title };
  }

  private getStoragePath(mediaType: 'image' | 'video' | 'audio', email: string, title: string): string {
    switch (mediaType) {
      case 'image':
        return join(this.baseStoragePath, 'images', email, title);
      case 'video':
        return join(this.baseStoragePath, 'videos', email, title);
      case 'audio':
        return join(this.baseStoragePath, 'audios', email, title);
      default:
        throw new Error('Invalid media type');
    }
  }
}