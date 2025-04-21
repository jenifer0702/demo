import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MedicationRequest, MedicationRequestSchema } from './medication-request.schema';
import { MedicationRequestService } from './medication-request.service';
import { PatientMedicationController } from './patient-medication.controller';
import { AdminMedicationController } from './admin-medication.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: MedicationRequest.name, schema: MedicationRequestSchema }]),
  ],
  providers: [MedicationRequestService],
  controllers: [PatientMedicationController, AdminMedicationController],
})
export class MedicationRequestModule {}
