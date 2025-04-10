import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TranslationDocument = Translation & Document;

@Schema()
export class Translation {
  @Prop({ required: true, unique: true })
  key: string; 

  @Prop({ required: true })
  en: string;

  @Prop({ required: true })
  ar: string;
}

export const TranslationSchema = SchemaFactory.createForClass(Translation);
