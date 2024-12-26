import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray, IsNotEmpty, ValidateNested, IsEnum, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

class MediaItemDto {
  @ApiProperty({ description: 'URL of the media' })
  @IsNotEmpty()
  @IsString()
  url: string;

  @ApiProperty({ description: 'Name of the media' })
  @IsNotEmpty()
  @IsString()
  medianame: string;

  @ApiProperty({ description: 'MIME type of the media' })
  @IsNotEmpty()
  @IsString()
  mimetype: string;

  @ApiProperty({ description: 'Size of the media in bytes' })
  @IsNotEmpty()
  @IsNumber()
  size: number;

  @ApiProperty({ description: 'Storage type of the media', enum: ['db', 'cloud'] })
  @IsNotEmpty()
  @IsEnum(['db', 'cloud'])
  storageType: 'db' | 'cloud';
}

export class CreateMediaDto {
  @ApiProperty({ description: 'ID of the user who uploaded the media' })
  @IsNotEmpty()
  @IsString()
  uploadedBy: string;

  @ApiProperty({ description: 'ID of the associated unsafe zone' })
  @IsNotEmpty()
  @IsString()
  unsafeZoneId: string;

  @ApiProperty({ description: 'Array of media items' })
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MediaItemDto)
  media: MediaItemDto[];
}
