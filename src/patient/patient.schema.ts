import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PatientDocument = Patient & Document;

@Schema()
export class Patient {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, min: 18 }) // ✅ Enforce min age
  age: number;

  @Prop({ required: true })
  gender: string;

  @Prop({ required: true })
  diagnosis: string;

  @Prop({ required: true, type: String }) // ✅ Add doctorId (references Doctor)
  doctorId: string;
}

export const PatientSchema = SchemaFactory.createForClass(Patient);
