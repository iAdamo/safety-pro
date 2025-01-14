import { Module } from '@nestjs/common';
import { UserServiceV1 } from '@modules/v1/user/user.service';
import { UnsafeZoneService } from './v1/unsafezone/unsafezone.service';
import { CriticalAlertService } from './v1/criticalalert/criticalalert.service';
import { UsersModule } from '@modules/users.module';
import { UnsafeZoneController } from './v1/unsafezone/unsafezone.controller';
import { CriticalAlertController } from './v1/criticalalert/criticalalert.controler';
import { UnsafeZone, UnsafeZoneSchema } from 'src/modules/zones/schemas/unsafezone.schema';
import { CriticalAlert, CriticalAlertSchema } from './schemas/criticalalert.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    UsersModule,
    MongooseModule.forFeature([
      { name: UnsafeZone.name, schema: UnsafeZoneSchema },
      { name: CriticalAlert.name, schema: CriticalAlertSchema},
    ]),
  ],
  providers: [UnsafeZoneService, CriticalAlertService, UserServiceV1],
  controllers: [UnsafeZoneController, CriticalAlertController],
  exports: [MongooseModule, UnsafeZoneService, CriticalAlertService],
})
export class ZoneModule {}
