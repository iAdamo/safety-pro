import { Controller, Param } from "@nestjs/common";
import {
    Body,
    Post,
    Patch,
    Query,
    UseGuards,
} from '@nestjs/common';
import { ApiTags } from "@nestjs/swagger";
import { CriticalAlertService } from "./criticalalert.service";
import { CreateCriticalAlertDto } from "@modules/dto/createcriticalalert.dto";
import { CriticalAlert } from "@modules/schemas/criticalalert.schema";
import { JwtAuthGuard } from "@modules/jwt/jwt.guard";
import { UpdateCriticalAlertDto } from "@modules/dto/updatecriticalalert.dto";

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
    
}
