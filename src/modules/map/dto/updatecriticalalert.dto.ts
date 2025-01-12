import { ApiProperty, PartialType } from "@nestjs/swagger";
import { IsString, IsBoolean, IsOptional } from "class-validator";
import { CreateCriticalAlertDto } from "./createcriticalalert.dto";

export class UpdateCriticalAlertDto extends PartialType(CreateCriticalAlertDto) {
    @ApiProperty({
        description: 'Location of the critical alert reported',
        example: {
        type: 'Point',
        coordinates: [-122.4194, 37.7749],
    },
    })

    @ApiProperty({
        description: 'Title the critical alert reported',
        example: 'Guns men'
    })
    @IsOptional()
    @IsString()
    title?: string;

    @ApiProperty({
        description: 'Description of the critical alert reported',
        example: 'gums men are shooting on the way and i fall in to their hands, i dont know where they are taking me to '
    })
    @IsOptional()
    @IsString()
    discription?: string;

    @ApiProperty({
        description: 'Media related to the critical alert',
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