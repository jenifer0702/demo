// src/slot/schemas/booking-slot.schema.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class BookingSlot extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Doctor', required: true })
  doctorId: Types.ObjectId;

  @Prop({ required: true })
  specialist: string;

  @Prop({ required: true })
  date: string;

  @Prop({ required: true })
  from: string;

  @Prop({ required: true })
  to: string;

  @Prop({ type: Types.ObjectId, ref: 'Patient', default: null })
  bookedBy: Types.ObjectId | null;

  @Prop({ default: false })
  isBooked: boolean;
}

export const BookingSlotSchema = SchemaFactory.createForClass(BookingSlot);
