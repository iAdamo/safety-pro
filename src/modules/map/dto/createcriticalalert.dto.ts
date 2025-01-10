import { ApiProperty } from '@nestjs/swagger';
import {
IsString,
IsNumber,
IsOptional,
IsBoolean,
IsNotEmpty,
} from 'class-validator';

export class CreateCriticalAlertDto {
@ApiProperty({
    description: 'ID of the user who reported the critical alert',
    example: '60c72b2f9b1e8b001c8e4d3a',
})
@IsNotEmpty()
@IsString()
reportedBy: string;

@ApiProperty({
    description: 'Title of the critical alert',
    example: 'Fire hazard',
})
@IsOptional()
@IsString()
title?: string;

@ApiProperty({
    description: 'Location of the critical alert',
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
    description: 'Radius of the critical alert',
    example: 10,
  })
@IsOptional()
@IsNumber()
radius?: number;

@ApiProperty({
    description: 'Is this a critical alert>',
    example: true,
  })
@IsOptional()
@IsBoolean()
iscritical?: boolean;

@ApiProperty({
    description: 'Description of the critical alert',
    example: 'There is a fire hazard in the area',
})
@IsOptional()
@IsString()
description?: string;

@ApiProperty({
    description: 'Media related to the critical alert',
    example: ['60c72b2f9b1e8b001c8e4d3a'],
})
@IsOptional()
@IsString({ each: true })
media?: string[];

@ApiProperty({
    description: 'Whether the critical alert has been resolved',
    example: false,
})
@IsOptional()
@IsBoolean()
resolved?: boolean;

@ApiProperty({
    description: 'Whether the critical alert is currently active',
    example: true,
})
@IsOptional()
@IsBoolean()
active?: boolean;
}