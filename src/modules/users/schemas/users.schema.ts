import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument} from 'mongoose';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { Address, AddressSchema } from '@schemas/address.schema';
import { GeoLocation, GeoLocationSchema } from '@schemas/location.schema';


export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop()
  otherName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ unique: true, default: uuidv4 })
  phoneNumber: string;

  @Prop()
  profilePic: string;

  @Prop({ type: AddressSchema })
  address: Address;

  @Prop({ type: GeoLocationSchema })
  location: GeoLocation;

  @Prop({ default: 300 }) // Default proximity range in meters
  proximityRange: number;

  @Prop({ enum: ['basic', 'premium'], default: 'basic' })
  role: string;

  @Prop()
  code: string;

  @Prop()
  codeAt: Date;

  @Prop({ default: false })
  verified: boolean;

  @Prop({ default: false })
  forgetPassword: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);


UserSchema.pre<UserDocument>('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  // Hash the password
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
})

// remove password from the user object before sending it to the client
UserSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.password;
    delete ret.__v;
    delete ret.createdAt;
    delete ret.updatedAt;
    delete ret.code;
    delete ret.codeAt;
    delete ret.verified;
    delete ret.forgetPassword;
    return ret;
  },
});
