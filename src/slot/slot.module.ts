import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SlotService } from './slot.service';
import { SlotController } from './slot.controller';
import { Slot, SlotSchema } from './slot.schema';
import { DoctorModule } from '../doctor/doctor.module';
import { PatientModule } from '../patient/patient.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Slot.name, schema: SlotSchema }]),
    forwardRef(() => DoctorModule),
    forwardRef(() => PatientModule),
    forwardRef(() => UserModule),
  ],
  controllers: [SlotController],
  providers: [SlotService],
  exports: [SlotService, MongooseModule], // Ensure MongooseModule is exported
})
export class SlotModule {}
