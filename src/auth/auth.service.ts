import {Injectable, UnauthorizedException} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import * as bcrypt from 'bcrypt';
import {Doctor} from '../doctor/doctor.schema';
import { Patient } from 'src/patient/patient.schema';

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        @InjectModel(Doctor.name) private doctorModel: Model<Doctor>,
        @InjectModel(Patient.name) private patientModel: Model<Patient>,

    ){}
    async validatorUser(email: string,password:string){
        const doctor = await this.doctorModel.findOne({ email});
        const patient = await this.patientModel.findOne({email});

         if(doctor && await bcrypt.compare(password, doctor.password)) {
            return { userId: doctor._id, role: 'doctor',email: doctor.email };

         }
         if(patient && await bcrypt.compare( password, patient.password)){
            return { UserId : patient.id, role: 'patient', email: patient.email};
         }
         throw new UnauthorizedException('Invalid credentials');
    }
    async login(user:any){
        const playload = { userId :user.userId, role: user.role, email: user.email};
        return {
            access_token:this.jwtService.sign(playload),
        };
    }
}