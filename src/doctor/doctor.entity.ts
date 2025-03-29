import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Doctor extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required : true})
  specialization:string;

  @Prop({ required: true })
  age: number;

  @Prop({ default: 'doctor' })
  role: string;
}

export const DoctorSchema = SchemaFactory.createForClass(Doctor);
