import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { User } from './user.schema';

@Schema()
export class Patient extends User {
  @Prop() gender: string;
  @Prop() diagnosis: string;
}

export const PatientSchema = SchemaFactory.createForClass(Patient);
