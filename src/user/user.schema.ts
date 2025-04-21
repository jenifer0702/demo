import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Role } from './role.enum';

@Schema({ discriminatorKey: 'role', timestamps: true })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, select: false })
  password: string;

  @Prop({ required: true })
  age: number;

  @Prop({ required: true, enum: Role })
  role: Role;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Hospital' })
  hospitalId: MongooseSchema.Types.ObjectId;

  @Prop({ type: [MongooseSchema.Types.ObjectId], ref: 'User', default: [] })
  favoriteDoctors: MongooseSchema.Types.ObjectId[];
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);

@Schema()
class DoctorExtension {
  @Prop({ required: true })
  specialist: string;

  @Prop({ type: [String], default: [] })
  slots: string[];
}

@Schema()
class PatientExtension {
  @Prop({ required: true })
  gender: string;

  @Prop({ required: true })
  diagnosis: string;
}

UserSchema.discriminator('doctor', SchemaFactory.createForClass(DoctorExtension));
UserSchema.discriminator('patient', SchemaFactory.createForClass(PatientExtension));
