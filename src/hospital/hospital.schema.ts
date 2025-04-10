import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type HospitalDocument = Hospital & Document;

@Schema({ timestamps: true })
export class Hospital {
  @Prop({ required: true, unique: true })
  hospitalId: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, enum: ['en', 'ar'], default: 'en' })
  defaultLanguage: string;


  createdAt?: Date;
  updatedAt?: Date;
}

export const HospitalSchema = SchemaFactory.createForClass(Hospital);
