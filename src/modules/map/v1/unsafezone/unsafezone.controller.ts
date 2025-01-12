import { Controller } from '@nestjs/common';
import {
  Body,
  Post,
  Patch,
  Get,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MapService } from '@modules/v1/unsafezone/unsafezone.service';
import { CreateUnsafeZoneDto } from '@dto/createunsafe.dto';
import { UpdateUnsafeZoneDto } from '@dto/updateunsafe.dto';
import { UnsafeZone } from '@schemas/unsafezone.schema';
import { JwtAuthGuard } from '@modules/jwt/jwt.guard';

@Controller('unsafezone')
export class MapController {
  constructor(private readonly mapService: MapService) {}

  @ApiTags('unsafezone')
  @UseGuards(JwtAuthGuard)
  @Post('create')
  async create(
    @Body() createUnsafeZoneDto: CreateUnsafeZoneDto,
  ): Promise<UnsafeZone> {
    return this.mapService.create(createUnsafeZoneDto);
  }

  @ApiTags('unsafezone')
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUnsafeZoneDto: UpdateUnsafeZoneDto,
  ): Promise<UnsafeZone> {
    return this.mapService.update(id, updateUnsafeZoneDto);
  }

  @ApiTags('unsafezone')
  @UseGuards(JwtAuthGuard)
  @Get('user/:userId')
  async findAllByUser(@Param('userId') userId: string): Promise<UnsafeZone[]> {
    return this.mapService.findAllByUser(userId);
  }

  @ApiTags('unsafezone')
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findUnsafeZonesWithProximity(
    @Param('id') id: string,
    @Query('userLat') userLat: number,
    @Query('userLong') userLong: number,
    @Query('proximity') proximity: number,
  ) {
    return this.mapService.findUnsafeZones(id, userLat, userLong, proximity);
  }
}
