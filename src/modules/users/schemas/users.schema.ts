import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';


export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop()
  otherName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  phoneNumber: string;

  @Prop()
  profilePic: string;

  @Prop({ default: 300 }) // Default proximity range in meters
  proximityRange: number;

  @Prop({ enum: ['basic', 'premium'], default: 'basic' })
  role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
