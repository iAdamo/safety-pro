import { Module } from '@nestjs/common';
import { ServicesService } from './v1/services/services.service';

@Module({
  providers: [ServicesService]
})
export class MapModule {}
