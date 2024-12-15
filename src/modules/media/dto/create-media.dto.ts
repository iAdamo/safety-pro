import { ApiProperty } from '@nestjs/swagger';
import { 
    IsString,
    IsUrl,
    IsEnum
} from 'class-validator';

export class CreateMediaDto {
    @ApiProperty({ example: 'https://example.com/image.jpg', description: 'The URL of the media' })
    @IsUrl()
    url: string; 

    @IsEnum(['image', 'video', 'audio'])
    type: 'image' | 'video' | 'audio';

    @IsString()
    unsafeZoneId: string;
}
