import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { HospitalController } from './hospital.controller';
import { HospitalService } from './hospital.service';
import { Hospital, HospitalSchema } from './hospital.schema';

import { TranslationModule } from '../translation/translation.module';
import { UserModule } from '../user/user.module'; // ✅ Import the UserModule

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Hospital.name, schema: HospitalSchema },
    ]),
    TranslationModule,
    UserModule, // ✅ Import UserModule to access UserModel
  ],
  controllers: [HospitalController],
  providers: [HospitalService],
  exports: [HospitalService],
})
export class HospitalModule {}
