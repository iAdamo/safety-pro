import { Controller, Param } from "@nestjs/common";
import {
    Body,
    Post,
    Patch,
    Get,
    Query,
    UseGuards,
} from '@nestjs/common';
import { ApiTags } from "@nestjs/swagger";
import { CriticalAlertService } from "./criticalalert.service";
import { CreateCriticalAlertDto } from "@modules/dto/createcriticalalert.dto";
import { CriticalAlert } from "@modules/schemas/criticalalert.schema";
import { JwtAuthGuard } from "@modules/jwt/jwt.guard";
import { UpdateCriticalAlertDto } from "@modules/dto/updatecriticalalert.dto";
import { User } from "@modules/schemas/users.schema";

@Controller('critical-alert')
export class CriticalAlertController {
    constructor(
        private readonly criticalalertService: CriticalAlertService
    ) {}

    /** Endpoint to create a critical alert
    */
    @ApiTags('critical-alert')
    @UseGuards(JwtAuthGuard)
    @Post('create')
    async create(
        @Body() createCriticalAlertDto: CreateCriticalAlertDto,
    ): Promise<CriticalAlert> {
        return this.criticalalertService.create(createCriticalAlertDto);
    }

    /** Endpoint to update a critical alert
    */
    @ApiTags('critical-alert')
    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    async update(
        @Param('id') id: string,
        @Body() updateCriticalAlertDto: UpdateCriticalAlertDto,
    ): Promise<CriticalAlert> {
        return this.criticalalertService.update(id, updateCriticalAlertDto);
    }

    /** Endpoint to find critical alerts 
     */
    @ApiTags('critical-alert')
    @UseGuards(JwtAuthGuard)
    @Get('user/:userId')
    async findAllByUser(
        @Param('userId') userId: string
    ): Promise<CriticalAlert[]> {
        return this.criticalalertService.findAllByUser(userId);
    }

    @ApiTags('critical-alert')
    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async findCriticalAlertWithProximity(
        @Param('id') id: string,
        @Query('userLat') userLat: number,
        @Query('userLong') userLong: number,
        @Query('proximity') proximity: number,
    ){
        return this.criticalalertService.findCriticalAlert(id, userLat, userLong, proximity)
    }
}
