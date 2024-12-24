import { ApiProperty } from '@nestjs/swagger';
import { 
    IsString,
    IsUrl,
    IsNotEmpty,
    IsEnum
} from 'class-validator';

export class CreateMediaDto {
    @ApiProperty({
        description: 'ID of the user who reported the unsafe zone',
        example: '60c72b2f9b1e8b001c8e4d3a',
      })
    @IsNotEmpty()
    @IsString()
    uploadedBy: string;

    @ApiProperty({ example: 'https://example.com/image.jpg', description: 'The URL of the media' })
    @IsUrl()
    url: string; 

    @IsEnum(['image', 'video', 'audio'])
    type: 'image' | 'video' | 'audio';

    @IsString()
    unsafeZoneId: string;
}
