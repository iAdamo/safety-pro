import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsString, IsNumber, IsEnum, IsOptional, IsBoolean, IsNotEmpty } from 'class-validator';
import { CreateUnsafeDto } from '../dto/createunsafe.dto';

export class UpdateUnsafeDto extends PartialType(CreateUnsafeDto) {
  @ApiProperty({
    description: 'Location of the unsafe zone',
    example: {
      type: 'Point',
      coordinates: [-122.4194, 37.7749],
    },
  })
  @IsOptional()
  location?: {
    type: string;
    coordinates: [number, number];
  };

  @ApiProperty({
    description: 'Radius of the unsafe zone in meters',
    example: 100,
  })
  @IsOptional()
  @IsNumber()
  radius?: number;

  @ApiProperty({
    description: 'Severity level of the unsafe zone',
    example: 'high',
    enum: ['low', 'medium', 'high'],
  })
  @IsOptional()
  @IsEnum(['low', 'medium', 'high'])
  severityLevel?: 'low' | 'medium' | 'high';

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