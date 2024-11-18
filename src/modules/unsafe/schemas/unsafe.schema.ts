import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from '@modules/schemas/users.schema';

export type UnsafePointDocument = HydratedDocument<UnsafePoint>;

@Schema({ timestamps: true })
export class UnsafePoint{
    @Prop({ required: true })
    latitude: number;

    @Prop({  required: true})
    longitude: number;
    
    @Prop({ required: true})
    description: string;

    @Prop({ enum: ['low', 'medium', 'high'], default: 'low' })
    criticalLevel: string;

    @Prop({ type: Types.ObjectId, ref: User.name, required: true})
    markedBy: Types.ObjectId;
}

export const UnsafePointSchema = SchemaFactory.createForClass(UnsafePoint);