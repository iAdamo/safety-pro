import { Module } from '@nestjs/common';
import { UserServiceV1 } from '@modules/v1/user/user.service';
import { UnsafeZoneService } from './v1/unsafezone/unsafezone.service';
import { UsersModule } from '@modules/users.module';
import { UnsafeZoneController } from './v1/unsafezone/unsafezone.controller';
import { UnsafeZone, UnsafeZoneSchema } from 'src/modules/zones/schemas/unsafezone.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    UsersModule,
    MongooseModule.forFeature([
      { name: UnsafeZone.name, schema: UnsafeZoneSchema },
    ]),
  ],
  providers: [UnsafeZoneService, UserServiceV1],
  controllers: [UnsafeZoneController],
  exports: [MongooseModule, UnsafeZoneService],
})
export class ZoneModule {}
