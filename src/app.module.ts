import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { DoctorModule } from './doctor/doctor.module';
import { PatientModule } from './patient/patient.module';
import { HospitalModule } from './hospital/hospital.module';
import { ContentModule } from './content/content.module';
import { TranslationModule } from './translation/translation.module';
import { SlotModule } from './slot/slot.module'; // Ensure this is imported

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // This makes the config module global for your app
      envFilePath: '.env', // Ensure the .env file is loaded correctly
    }),
    MongooseModule.forRoot(process.env.MONGO_URI || 'mongodb://localhost:27017/nest-crud'),
    AuthModule,
    DoctorModule,
    PatientModule,
    HospitalModule,
    ContentModule,
    TranslationModule,
    SlotModule, // Ensure this is included here as well
  ],
})
export class AppModule {}
