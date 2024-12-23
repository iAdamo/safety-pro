import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Document } from 'mongoose';

export type MediaDocument = HydratedDocument<Media>;

@Schema({ timestamps: true })
export class Media {
    @Prop({ required: true })
    markedBy: string;
  
    @Prop({ required: true })
    url: string;

    @Prop({ required: true })
    type: 'image' | 'video' | 'audio';

    @Prop({ required: true })
    unsafeZoneId: string;
}

export const MediaSchema = SchemaFactory.createForClass(Media);

MediaSchema.set('toJSON', {
    transform: (doc, ret) => {
        delete ret.__v;
        return ret;
    },
});