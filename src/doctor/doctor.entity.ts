import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Doctor extends Document {
    @Prop ({ required:true })
    name:string;

    @Prop ({required: true})
    specialization:string;

    @Prop ({required:true})
    experience: number;

    @Prop({ required:true})
    contact: string;

    @Prop({required:true})
    email: string;

    @Prop({required:true})
    password:string;

}
export const DoctorSchema = SchemaFactory.createForClass(Doctor);
