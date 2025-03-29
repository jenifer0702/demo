import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Patient extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required:true})
  diagnosis:string;

  @Prop({ required:true})
  age:string;

  @Prop({ required:true})
  gender:string;

  @Prop({ default: 'patient' })
  role: string;
}

export const PatientSchema = SchemaFactory.createForClass(Patient);
