import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DoctorService } from '../service/doctor.service';
import { DoctorController } from './doctor.controller';
import { Slot, SlotSchema } from '../slot/slot.schema';
import { User, UserSchema } from '../user/user.schema'; // Unified user model
import { HospitalModule } from '../hospital/hospital.module';
import { TranslationModule } from '../translation/translation.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },  // Use unified User model
      { name: Slot.name, schema: SlotSchema },  // Slot model
    ]),
    HospitalModule,  // Ensure that hospital-related functionality is integrated
    TranslationModule,  // To handle translations for different languages
  ],
  controllers: [DoctorController],
  providers: [DoctorService],
  exports: [DoctorService],  // Allow other modules to use the DoctorService
})
export class DoctorModule {}
