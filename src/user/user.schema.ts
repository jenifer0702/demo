import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
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

  @Prop({ type: Types.ObjectId, ref: 'Hospital' })
  hospitalId: Types.ObjectId;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }] }) // 🛠 FIX
  favoriteDoctors?: Types.ObjectId[];
}

export type UserDocument = User & Document;

export const UserSchema = SchemaFactory.createForClass(User);
