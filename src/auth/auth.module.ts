import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule} from '@nestjs/mongoose';
import {Doctor,DoctorSchema } from '../doctor/doctor.schema';
import {Patient,PatientSchema } from '../patient/patient.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name:Doctor.name,schema:DoctorSchema },
            { name :Patient.name, schema: PatientSchema },

        ]),
        JwtModule.register({
            secret: 'SECRET_KEY',
            signOptions: {expiresIn:'1h'},
        
        }),
    ],
    controllers: [AuthController],
    providers:[AuthService],
})
export class AuthModule{}

