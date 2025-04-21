// user.schema.ts or patient.schema.ts depending on your setup
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from './user.schema';
import mongoose, { Types } from 'mongoose';

@Schema()
export class Patient extends User {
  @Prop({ required: true })
  diagnosis: string;

  @Prop({ required: true })
  gender: string;

  @Prop({ required: true })
  address: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  doctorId: Types.ObjectId;
}

export const PatientSchema = SchemaFactory.createForClass(Patient);
