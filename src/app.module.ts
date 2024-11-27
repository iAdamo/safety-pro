import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { MongooseModule } from '@nestjs/mongoose';
import databaseConfig from '@config/database.config';
import { UsersModule } from '@modules/users.module';
import { AuthModule } from '@modules/auth.module';
import { MapModule } from './modules/map/map.module';
import { NotificationModule } from './modules/notification/notification.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
    }),
    MongooseModule.forRoot(process.env.MONGO_URI),
    UsersModule,
    AuthModule,
    MapModule,
    NotificationModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
