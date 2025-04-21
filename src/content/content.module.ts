import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ContentService } from './content.service';
import { HospitalInfoController } from './content.controller';
import { Hospital, HospitalSchema } from '../hospital/hospital.schema';
import { TranslationModule } from '../translation/translation.module';
import { UserModule } from '../user/user.module'; // ✅ Import this to access Doctor

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Hospital.name, schema: HospitalSchema },
    ]),
    TranslationModule,
    UserModule, // ✅ This gives access to Doctor discriminator
  ],
  controllers: [HospitalInfoController],
  providers: [ContentService],
})
export class ContentModule {}
