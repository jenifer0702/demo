import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PatientDocument = Patient & Document;

@Schema({ timestamps: true })
export class Patient {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  age: number;

  @Prop({ required: true })
  gender: string;

  @Prop({ required: true })
  contactNumber: string;

  @Prop({ required: true })
  address: string;

  @Prop({ required: true })
  diagnosis: string;

  @Prop({ required: true })
  doctorId: string;  

  @Prop({ required: true , unique:true})
  email: string;

  @Prop({ required: true })
  password:string;
}

export const PatientSchema = SchemaFactory.createForClass(Patient);
