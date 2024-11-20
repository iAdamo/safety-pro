import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
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

  @Prop({
    required: true,
    unique: true,
    match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
  })
  email: string;

  @Prop({ required: true, minlength: 6 })
  password: string;

  @Prop({ unique: true, default: uuidv4 })
  phoneNumber: string;

  @Prop({ default: 'https://example.com/default-profile-pic.png' })
  profilePic: string;

  @Prop({ type: AddressSchema })
  address: Address;

  @Prop({ type: GeoLocationSchema })
  location: GeoLocation;

  @Prop({ default: 300 })
  proximityRange: number;

  @Prop({ enum: ['basic', 'premium', 'admin'], default: 'basic' })
  role: string;

  @Prop()
  code: string;

  @Prop()
  codeAt: Date;

  @Prop({ default: false })
  verified: boolean;

  @Prop({ default: false })
  forgetPassword: boolean;

  comparePassword: (password: string) => Promise<boolean>;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Hash the password before saving
UserSchema.pre<UserDocument>('save', async function (next) {
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Add a method to compare passwords
UserSchema.methods.comparePassword = async function (
  userPassword: string,
): Promise<boolean> {
  return await bcrypt.compare(userPassword, this.password);
};

// Remove sensitive fields before sending to the client
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
