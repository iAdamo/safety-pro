import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { GeoLocation, GeoLocationSchema } from '@schemas/location.schema';
import { User, UserSchema } from '@schemas/users.schema';

export type UnsafeZoneDocument = HydratedDocument<UnsafeZone>;

@Schema({ timestamps: true })
export class UnsafeZone {
  @Prop({type: UserSchema, required: true })
  user: User;

  @Prop({type: GeoLocationSchema, required: true })
  location: GeoLocation;

  @Prop({ required: true })
  radius: number;

  @Prop({ required: true, enum: ['low', 'medium', 'high'] })
  severityLevel: 'low' | 'medium' | 'high';

  @Prop()
  description: string;

  @Prop()
  audio: string;

  @Prop()
  video: string;

  @Prop({ default: false })
  resolved: boolean;

  @Prop({ default: false })
  active: boolean;
}

export const UnsafeZoneSchema = SchemaFactory.createForClass(UnsafeZone);
