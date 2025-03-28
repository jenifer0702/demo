import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type DoctorDocument = Doctor & Document;

@Schema({ timestamps: true })
export class Doctor {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  specialization: string;

  @Prop({ required: true })
  contactNumber: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  experience: number; 
  
  @Prop({ required: true })
  password: string;

  @Prop({ default:'doctor' })
  role:string;
}

export const DoctorSchema = SchemaFactory.createForClass(Doctor);
