import { Module } from '@nestjs/common';
import { UserControllerV1 } from './v1/user/user.controller';
import { UserServiceV1 } from './v1/user/user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/users.schema';


@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
  controllers: [UserControllerV1],
  providers: [UserServiceV1],
})
export class UsersModule {}
