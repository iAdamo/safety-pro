import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { MongooseModule } from '@nestjs/mongoose';
import databaseConfig from '@config/database.config';
import { UsersModule } from '@modules/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
    }),
    MongooseModule.forRoot(process.env.MONGO_URI),
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
