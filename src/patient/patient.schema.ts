import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PatientDocument = Patient & Document;

@Schema()
export class Patient {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, select: false }) // Ensure password is not selected by default
  password: string;

  @Prop({ required: true })
  age: number;

  @Prop({ required: true })
  gender: string;

  @Prop({ required: true })
  diagnosis: string;

  @Prop({ required: true, default: 'patient' }) // ✅ Ensure role is always set
  role: string;
}

export const PatientSchema = SchemaFactory.createForClass(Patient);
