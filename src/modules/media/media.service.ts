import { 
    Injectable, 
    NotFoundException
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Media } from '@schemas/media.schema';
import { CreateMediaDto } from '@dto/create-media.dto';
import { UserServiceV1 } from '@modules/v1/user/user.service';
import { UpdateMediaDto } from './dto/update-media.dto';

@Injectable()
export class MediaService {
     constructor(
       @InjectModel(Media.name)
       private mediaModel: Model<Media>,
       private userServiceV1: UserServiceV1,
     ) {}

    /**
   * Create a new media entry.
   * @param createMediaDto - Data transfer object containing media details.
   * @returns The created media document.
   */
  async create(CreateMediaDto: CreateMediaDto): Promise<Media> {
      
    // check if the user is valid
    const user = await this.userServiceV1.findOne({
        id: CreateMediaDto.uploadedBy,
      });
  
      if (!user) {
        throw new NotFoundException('User not found');
      }
  
      const createMedia = new this.mediaModel(CreateMediaDto);
    return createMedia.save();}

    /**
   * Find all media entries.
   * @returns An array of media documents.
   */
  async findAll(): Promise<Media[]> {
    const media = await this.mediaModel.find().exec();

    if (!media) {
      throw new NotFoundException('Media not found');
    }
    
    return this.mediaModel.find().exec();
  }
  
   /**
   * Find a media entry by ID.
   * @param id - The ID of the media entry.
   * @returns The media document.
   */
  async findOne(id: string): Promise<Media> {
    const media = await this.mediaModel.findById(id).exec();

    if (!media) {
      throw new NotFoundException('Media not found');
    }

    return this.mediaModel.findById(id).exec();
  }

    /**
   * Update a media entry by ID.
   * @param id - The ID of the media entry.
   * @param updateMediaDto - Data transfer object containing updated media details.
   * @returns The updated media document.
   */
  async update(id: string, updateMediaDto: UpdateMediaDto): Promise<Media> {
    const media = await this.mediaModel.findById(id).exec();

    if (!media) {
      throw new NotFoundException('Media not found');
    }

    return this.mediaModel.findByIdAndUpdate(id, updateMediaDto, { new: true }).exec();
  }

   /**
   * Delete a media entry by ID.
   * @param id - The ID of the media entry.
   * @returns The deleted media document.
   */
  async remove(id: string): Promise<Media> {
    const media = await this.mediaModel.findById(id).exec();

    if (!media) {
      throw new NotFoundException('Media not found');
    }

    return this.mediaModel.findByIdAndDelete(id).exec();
  }
}
