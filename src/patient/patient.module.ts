import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PatientController } from './patient.controller';
import { PatientService } from './patient.service';
import { Patient, PatientSchema } from './patient.schema';
import { AuthModule } from '../auth/auth.module'; // ✅ Import AuthModule to access AuthService

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Patient.name, schema: PatientSchema }]),
    AuthModule, // ✅ AuthService is now accessible
  ],
  controllers: [PatientController],
  providers: [PatientService], // ❌ Remove JwtAuthGuard from providers (it's used in guards, not here)
  exports: [PatientService],
})
export class PatientModule {}
