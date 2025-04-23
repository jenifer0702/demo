import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PatientService } from '../service/patient.service';
import { PatientController } from './patient.controller';
import { AuthModule } from '../auth/auth.module';
import { DoctorModule } from '../doctor/doctor.module';
import { HospitalModule } from '../hospital/hospital.module';
import { TranslationModule } from '../translation/translation.module';
import { User, UserSchema } from '../user/user.schema'; 
import {Slot,SlotSchema } from '../slot/slot.schema';// ✅ unified user model
import { SlotModule } from 'src/slot/slot.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]), // ✅ use unified user schema
    forwardRef(() => AuthModule),
    forwardRef(() => DoctorModule),
    HospitalModule,
    TranslationModule,
    SlotModule,
  ],
  controllers: [PatientController],
  providers: [PatientService],
  exports: [PatientService],
})
export class PatientModule {}
