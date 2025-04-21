import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import mongoose from 'mongoose';

export type SlotDocument = Slot & Document; // ✅ THIS is what was missing

@Schema({ timestamps: true })
export class Slot {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  doctorId: mongoose.Types.ObjectId;

  @Prop({ required: true })
  specialist: string;

  @Prop({ required: true })
  date: string;

  @Prop({ required: true })
  from: string;

  @Prop({ required: true })
  to: string;

  @Prop({ default: false })
  isBooked: boolean;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  patientId?: mongoose.Types.ObjectId;
}

export const SlotSchema = SchemaFactory.createForClass(Slot);
