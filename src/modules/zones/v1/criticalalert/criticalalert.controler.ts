import { Controller } from "@nestjs/common";
import {
    Body,
    Post,
    Query,
    UseGuards,
} from '@nestjs/common';
import { ApiTags } from "@nestjs/swagger";
import { CriticalAlertService } from "./criticalalert.service";
import { CreateCriticalAlertDto } from "@modules/dto/createcriticalalert.dto";
import { CriticalAlert } from "@modules/schemas/criticalalert.schema";
import { JwtAuthGuard } from "@modules/jwt/jwt.guard";

@Controller('critical-alert')
export class CriticalAlertController {
    constructor(
        private readonly criticalalertService: CriticalAlertService
    ) {}

    @ApiTags('critical-alert')
    @UseGuards(JwtAuthGuard)
    @Post('create')
    async create(
        @Body() createCriticalAlertDto: CreateCriticalAlertDto,
    ): Promise<CriticalAlert> {
        return this.criticalalertService.create(createCriticalAlertDto);
    }
}
