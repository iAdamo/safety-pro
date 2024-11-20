import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type GeoLocationDocument = HydratedDocument<GeoLocation>;

@Schema()
export class GeoLocation {
  // GeoJSON Type: "Point" is the only valid type here
  @Prop({ type: String, enum: ['Point'], required: true, default: 'Point' })
  readonly type: string;

  // Coordinates must be an array with two numbers: [longitude, latitude]
  @Prop({
    type: [Number],
    required: true,
    validate: {
      validator: (value: number[]) =>
        Array.isArray(value) &&
        value.length === 2 &&
        value.every((coord) => typeof coord === 'number'),
      message:
        'Coordinates must be an array of two numbers: [longitude, latitude].',
    },
    default: [0, 0],
  })
  readonly coordinates: number[];
}

export const GeoLocationSchema = SchemaFactory.createForClass(GeoLocation);

// Geospatial Index for MongoDB
GeoLocationSchema.index({ coordinates: '2dsphere' });
