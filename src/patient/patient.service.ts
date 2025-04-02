import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { Patient, PatientDocument } from './patient.schema';
import { CreatePatientDto } from './patient.dto';

@Injectable()
export class PatientService {
  constructor(@InjectModel(Patient.name) private patientModel: Model<PatientDocument>) {}

  async registerPatient(patientDto: CreatePatientDto): Promise<any> {
    const { name, email, password, age, gender, diagnosis } = patientDto;

    if (age < 18) {
      throw new UnauthorizedException('Patient must be at least 18 years old');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const patient = new this.patientModel({
      name,
      email,
      password: hashedPassword,
      age,
      gender,
      diagnosis,
    });

    await patient.save();
    return { message: 'Patient registered successfully' };
  }

  async getPatients() {
    return this.patientModel.find().select('-password'); // Exclude password from response
  }
}
