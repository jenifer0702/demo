import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type DoctorDocument = Doctor & Document;

@Schema()
export class Doctor {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, select: false }) // Ensure password is not selected by default
  password: string;

  @Prop({ required: true })
  age: number;

  @Prop({ required: true })
  specialist: string;

  @Prop({ required: true, default: 'doctor' }) // ✅ Ensure role is always set
  role: string;
}

export const DoctorSchema = SchemaFactory.createForClass(Doctor);
