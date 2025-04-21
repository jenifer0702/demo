import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';  // Add this import
import { Document } from 'mongoose';

export type MedicationRequestDocument = MedicationRequest & Document;

@Schema({ timestamps: true })
export class MedicationRequest {
  @Prop({ 
    required: true, 
    type: mongoose.Schema.Types.ObjectId,  // Use the imported mongoose object
    ref: 'User',  // Referencing the User model (which should be the model where patients are stored)
  })
  patientId: mongoose.Schema.Types.ObjectId; // Use ObjectId type for patientId

  @Prop({ required: true })
  medication: string; // e.g., "dolo", etc.

  @Prop({ default: 'pending', enum: ['pending', 'approved', 'rejected'] })
  status: string; // medication request status
}

export const MedicationRequestSchema = SchemaFactory.createForClass(MedicationRequest);
