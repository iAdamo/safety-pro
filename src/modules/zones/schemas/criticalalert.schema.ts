import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { GeoLocation, GeoLocationSchema } from '@schemas/location.schema';
import { User } from '@modules/schemas/users.schema';

export type CriticalAlertDocument = HydratedDocument<CriticalAlert>;

@Schema({ timestamps: true })
export class CriticalAlert {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  markedBy: User;

  @Prop()
  title: string;

  @Prop({ type: GeoLocationSchema, required: true })
  location: GeoLocation;

  @Prop({ default: 100 })
  radius: number;

  @Prop({ required: true, default: true })
  iscritical: boolean;

  @Prop()
  description: string;

  @Prop({ default: false })
  deleted: boolean;

  @Prop({ default: false })
  resolved: boolean;

  @Prop({ default: true })
  active: boolean;
}

export const CriticalAlertSchema = SchemaFactory.createForClass(CriticalAlert);

CriticalAlertSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.__v;
    return ret;
  },
})