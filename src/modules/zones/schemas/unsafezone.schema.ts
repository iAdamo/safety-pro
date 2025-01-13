import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { GeoLocation, GeoLocationSchema } from '@schemas/location.schema';
import { User } from '@schemas/users.schema';

export type UnsafeZoneDocument = HydratedDocument<UnsafeZone>;

@Schema({ timestamps: true })
export class UnsafeZone {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  markedBy: User;

  @Prop({ required: true })
  title: string;

  @Prop({ type: GeoLocationSchema, required: true })
  location: GeoLocation;

  @Prop({ default: 10 })
  radius: number;

  @Prop({ required: true, enum: ['low', 'medium', 'high'] })
  severityLevel: 'low' | 'medium' | 'high';

  @Prop()
  description: string;

  @Prop({ default: false })
  deleted: boolean;

  @Prop({ default: false })
  resolved: boolean;

  @Prop({ default: true })
  active: boolean;
}

export const UnsafeZoneSchema = SchemaFactory.createForClass(UnsafeZone);

UnsafeZoneSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.__v;
    return ret;
  },
});
