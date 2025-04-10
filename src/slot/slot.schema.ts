import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../user/user.schema'; // ✅ Use the unified User schema

@Schema()
export class Slot {
  @Prop({ required: true })
  specialist: string;

  @Prop({ type: Types.ObjectId, ref: User.name, required: true }) // doctor = user with role: doctor
  doctor: Types.ObjectId;

  @Prop({ required: true })
  date: string;

  @Prop({ required: true })
  from: string;

  @Prop({ required: true })
  to: string;

  @Prop({ default: false })
  isBooked: boolean;

  @Prop({ type: Types.ObjectId, ref: User.name, default: null }) // bookedBy = user with role: patient
  bookedBy: Types.ObjectId | null;
}

export type SlotDocument = Slot & Document;

export const SlotSchema = SchemaFactory.createForClass(Slot);
