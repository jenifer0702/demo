import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { MongooseModule} from '@nestjs/mongoose';
import { PatientModule } from './patient/patient.module';
import { UserModule } from './user/user.module';
import { DoctorModule } from './doctor/doctor.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/nest-crud'),
    PatientModule,
    AuthModule,
    UserModule,
    DoctorModule,
  ],
})
export class AppModule {}
