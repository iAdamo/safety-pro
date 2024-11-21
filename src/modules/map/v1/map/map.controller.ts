import { Controller } from '@nestjs/common';
import { Body, Post, Param ,UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MapService } from '@services/map.service';
import { CreateUnsafeZoneDto } from '@dto/createunsafe.dto';
import { UpdateUnsafeZoneDto } from '@dto/updateunsafe.dto';
import { UnsafeZone } from '@schemas/unsafezone.schema';
import { JwtAuthGuard } from '@auth/jwt/jwt.guard';


@Controller('map')
export class MapController {
  constructor(private readonly mapService: MapService) {}

  @ApiTags('map')
  // @UseGuards(JwtAuthGuard)
  @Post('unsafezone')
  create(@Body() createUnsafeZoneDto: CreateUnsafeZoneDto): Promise<UnsafeZone> {
    return this.mapService.create(createUnsafeZoneDto);
  }

  @ApiTags('map')
  // @UseGuards(JwtAuthGuard)
  @Post('unsafezone/:id')
  update(@Param('id') id: string, @Body() updateUnsafeZoneDto: UpdateUnsafeZoneDto): Promise<UnsafeZone> {
    return this.mapService.update(id, updateUnsafeZoneDto);
  }

}
