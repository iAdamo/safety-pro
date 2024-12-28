import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { MongooseModule } from '@nestjs/mongoose';
import databaseConfig from '@config/database.config';
import { UsersModule } from '@modules/users.module';
import { AuthModule } from '@modules/auth.module';
import { MapModule } from './modules/map/map.module';
import { MediaModule } from './modules/media/media.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
    }),
    MongooseModule.forRoot(process.env.MONGO_URI),
    UsersModule,
    AuthModule,
    MapModule,
    MediaModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
