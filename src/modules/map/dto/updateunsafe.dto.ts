import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsString, IsNumber, IsEnum, IsOptional, IsBoolean, IsNotEmpty } from 'class-validator';
import { CreateUnsafeZoneDto } from '../dto/createunsafe.dto';

export class UpdateUnsafeZoneDto extends PartialType(CreateUnsafeZoneDto) {
  @ApiProperty({
    description: 'Location of the unsafe zone',
    example: {
      type: 'Point',
      coordinates: [-122.4194, 37.7749],
    },
  })
  @ApiProperty({
    description: 'Severity level of the unsafe zone',
    example: 'High',
    enum: ['Low', 'Medium', 'High'],
  })
  @IsOptional()
  @IsEnum(['Low', 'Medium', 'High'])
  severityLevel?: 'Low' | 'Medium' | 'High';

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
