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
    description: 'Name of the unsafe zone',
    example: 'High crime area',
  })
  @IsNotEmpty()
  @IsString()
  title: string;

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
    example: 'High',
    enum: ['Low', 'Medium', 'High'],
  })
  @IsNotEmpty()
  @IsEnum(['Low', 'Medium', 'High'])
  severityLevel: 'Low' | 'Medium' | 'High';

  @ApiProperty({
    description: 'Description of the unsafe zone',
    example: 'High crime area',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Media related to the unsafe zone',
    example: ['60c72b2f9b1e8b001c8e4d3a'],
  })
  @IsOptional()
  @IsString({ each: true })
  media?: string[];

  @ApiProperty({
    description: 'Whether the unsafe zone has been deleted',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  deleted?: boolean;

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
