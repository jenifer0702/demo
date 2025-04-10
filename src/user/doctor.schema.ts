import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Doctor {
  @Prop({ required: true })
  specialist: string;

  @Prop({ default: [] })
  slots: string;
}

export const DoctorSchema = SchemaFactory.createForClass(Doctor);
