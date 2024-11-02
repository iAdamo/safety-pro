import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type GeoLocationDocument = HydratedDocument<GeoLocation>;

@Schema()
export class GeoLocation {
  @Prop({ type: String, enum: ['Point'], default: 'Point' })
  type: string;

  @Prop({ type: [Number], default: [0, 0] })
  coordinates: number[];
}

export const GeoLocationSchema = SchemaFactory.createForClass(GeoLocation);
