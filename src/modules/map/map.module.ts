import { Module } from '@nestjs/common';
import { MapService } from '@services/map.service';
import { UserServiceV1 } from '@modules/v1/user/user.service';
import { UsersModule } from '@modules/users.module';
import { MapController } from '@controllers/map.controller';
import { UnsafeZone, UnsafeZoneSchema } from '@schemas/unsafezone.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    UsersModule,
    MongooseModule.forFeature([
      { name: UnsafeZone.name, schema: UnsafeZoneSchema },
    ]),
  ],
  providers: [MapService, UserServiceV1],
  controllers: [MapController],
  exports: [MongooseModule, MapService],
})
export class MapModule {}
