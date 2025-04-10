import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { User, UserSchema } from './user.schema';
import { Doctor, DoctorSchema } from './doctor.schema';
import { Patient, PatientSchema } from './patient.schema';
import { UserService } from './user.service';
import { UserController } from './user.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
      {
        name: Doctor.name,
        schema: DoctorSchema,
      },
      {
        name: Patient.name,
        schema: PatientSchema,
      },
    ]),
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService, MongooseModule],
})
export class UserModule {}
