import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from '@schemas/users.schema';
import { UnsafeZone } from '@modules/schemas/unsafezone.schema';

export type MediaDocument = HydratedDocument<Media>;

@Schema({ timestamps: true })
export class Media {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  uploadedBy: User;

  @Prop({ type: Types.ObjectId, ref: 'UnsafeZone', required: true })
  unsafeZoneId: UnsafeZone;

  @Prop([
    {
      url: { type: String, required: true },
      medianame: { type: String, required: true },
      mimetype: { type: String, required: true },
      size: { type: Number, required: true },
      storageType: { type: String, enum: ['db', 'cloud'], required: true },
    },
  ])
  media: {
    url: string;
    medianame: string;
    mimetype: string;
    size: number;
    storageType: string;
  }[];
}

export const MediaSchema = SchemaFactory.createForClass(Media);

MediaSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.__v;
    return ret;
  },
});
