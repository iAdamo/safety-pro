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
import { MediaService } from '@services/media.service';
import { CreateMediaDto } from '@dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';
import { Media } from '@schemas/media.schema';

@Controller('media')
export class MediaController {
    constructor(private readonly mediaService: MediaService) {}

    @ApiTags('media')
    // @UseGuards(JwtAuthGuard)
    @Post('create')
    create(
        @Body() createMediaDto: CreateMediaDto,
    ): Promise<Media> {
        return this.mediaService.create(createMediaDto);
    }

    @ApiTags('media')
    // @UseGuards(JwtAuthGuard)
    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body () UpdateMediaDto: UpdateMediaDto,
    ): Promise<Media> {
        return this.mediaService.update(id, UpdateMediaDto);
    }

    @ApiTags('media')
    // @UseGuards(JwtAuthGuard)
    @Get(':id')
    async findOne(
        @Param('id') id: string
    ) {
        return this.mediaService.findOne(id);
    }
}
