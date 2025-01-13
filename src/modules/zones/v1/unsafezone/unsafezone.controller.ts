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
import { UnsafeZoneService } from 'src/modules/zones/v1/unsafezone/unsafezone.service';
import { CreateUnsafeZoneDto } from 'src/modules/zones/dto/createunsafe.dto';
import { UpdateUnsafeZoneDto } from 'src/modules/zones/dto/updateunsafe.dto';
import { UnsafeZone } from 'src/modules/zones/schemas/unsafezone.schema';
import { JwtAuthGuard } from '@modules/jwt/jwt.guard';

@Controller('unsafezone')
export class UnsafeZoneController {
  constructor(private readonly unsafezoneService: UnsafeZoneService) {}

  @ApiTags('unsafezone')
  @UseGuards(JwtAuthGuard)
  @Post('create')
  async create(
    @Body() createUnsafeZoneDto: CreateUnsafeZoneDto,
  ): Promise<UnsafeZone> {
    return this.unsafezoneService.create(createUnsafeZoneDto);
  }

  @ApiTags('unsafezone')
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUnsafeZoneDto: UpdateUnsafeZoneDto,
  ): Promise<UnsafeZone> {
    return this.unsafezoneService.update(id, updateUnsafeZoneDto);
  }

  @ApiTags('unsafezone')
  @UseGuards(JwtAuthGuard)
  @Get('user/:userId')
  async findAllByUser(@Param('userId') userId: string): Promise<UnsafeZone[]> {
    return this.unsafezoneService.findAllByUser(userId);
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
    return this.unsafezoneService.findUnsafeZones(id, userLat, userLong, proximity);
  }
}
