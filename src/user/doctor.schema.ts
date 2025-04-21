// doctor.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class DoctorExtension {
  @Prop({ required: true })
  specialist: string;

  @Prop({ type: [String], default: [] })
  slots: string[];
}

export const DoctorSchema = SchemaFactory.createForClass(DoctorExtension);
