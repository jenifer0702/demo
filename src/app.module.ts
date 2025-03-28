import { Module } from '@nestjs/common';
import { MongooseModule} from '@nestjs/mongoose';
import { PatientModule } from './patient/patient.module';
import { UserModule } from './user/user.module';
import { DoctorModule } from './doctor/doctor.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/nest-crud'),
    PatientModule,
    UserModule,
    DoctorModule,
  ],
})
export class AppModule {}
