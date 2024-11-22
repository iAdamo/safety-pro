import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsEnum,
  IsOptional,
  IsBoolean,
  IsNotEmpty,
} from 'class-validator';

export class CreateUnsafeZoneDto {
  @ApiProperty({
    description: 'ID of the user who reported the unsafe zone',
    example: '60c72b2f9b1e8b001c8e4d3a',
  })
  @IsNotEmpty()
  @IsString()
  markedBy: string;

  @ApiProperty({
    description: 'Location of the unsafe zone',
    example: {
      type: 'Point',
      coordinates: [-122.4194, 37.7749],
    },
  })
  @IsNotEmpty()
  location: {
    type: string;
    coordinates: [number, number];
  };

  @ApiProperty({
    description: 'Radius of the unsafe zone',
    example: 10,
  })
  @IsOptional()
  @IsNumber()
  radius?: number;

  @ApiProperty({
    description: 'Severity level of the unsafe zone',
    example: 'high',
    enum: ['low', 'medium', 'high'],
  })
  @IsNotEmpty()
  @IsEnum(['low', 'medium', 'high'])
  severityLevel: 'low' | 'medium' | 'high';

  @ApiProperty({
    description: 'Description of the unsafe zone',
    example: 'High crime area',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Audio evidence of the unsafe zone',
    example: 'https://example.com/audio.mp3',
  })
  @IsOptional()
  @IsString()
  audio?: string;

  @ApiProperty({
    description: 'Video evidence of the unsafe zone',
    example: 'https://example.com/video.mp4',
  })
  @IsOptional()
  @IsString()
  video?: string;

  @ApiProperty({
    description: 'Whether the unsafe zone has been resolved',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  resolved?: boolean;

  @ApiProperty({
    description: 'Whether the unsafe zone is currently active',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
