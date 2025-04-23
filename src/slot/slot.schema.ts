import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import * as mongoose from 'mongoose';

@Schema({ _id: false })
export class PrescriptionItem {
  @Prop({ required: true })
  medicine: string;

  @Prop({ required: true })
  dose: string;
}

export const PrescriptionItemSchema = SchemaFactory.createForClass(PrescriptionItem);

@Schema()
export class Slot extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  doctorId: Types.ObjectId;

  @Prop({ required: true })
  specialist: string;

  @Prop({ required: true })
  from: Date;

  @Prop({ required: true })
  to: Date;

  @Prop({ required: true })
  date: Date;

  @Prop({ default: false })
  isBooked: boolean;

  @Prop({ type: [PrescriptionItemSchema], default: [] })
  prescription: PrescriptionItem[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null })
  patientId: mongoose.Types.ObjectId | null;
}

export const SlotSchema = SchemaFactory.createForClass(Slot);

// ✅ THIS IS THE CRUCIAL LINE
export type SlotDocument = Slot & Document;
