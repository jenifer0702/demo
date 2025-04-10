import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ContentService } from './content.service';
import { HospitalInfoController } from './content.controller';
import { Doctor, DoctorSchema } from '../user/doctor.schema';
import { Hospital, HospitalSchema } from '../hospital/hospital.schema';
import { TranslationModule } from '../translation/translation.module'; 

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Doctor.name, schema: DoctorSchema },
      { name: Hospital.name, schema: HospitalSchema },
    ]),
    TranslationModule, 
  ],
  controllers: [HospitalInfoController],
  providers: [ContentService],
})
export class ContentModule {}
