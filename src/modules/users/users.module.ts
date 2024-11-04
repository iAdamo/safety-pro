import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { User, UserSchema } from '@schemas/users.schema';
import { UserControllerV1 } from '@controllers/user.controller';
import { UserServiceV1 } from '@services/user.service';


@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
  controllers: [UserControllerV1],
  providers: [UserServiceV1],
})

export class UsersModule {}
