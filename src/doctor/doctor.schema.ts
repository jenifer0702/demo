import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type DoctorDocument = Doctor & Document;

@Schema()
export class Doctor {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, min: 25 }) // ✅ Enforce min age
  age: number;

  @Prop({ required: true })
  specialist: string;

  @Prop({ required: true, default: 'doctor' }) // ✅ Add role field
  role: string;
}

export const DoctorSchema = SchemaFactory.createForClass(Doctor);
