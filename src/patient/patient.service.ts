import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { Patient, PatientDocument } from './patient.schema';
import { CreatePatientDto } from './patient.dto';

@Injectable()
export class PatientService {
  constructor(@InjectModel(Patient.name) private patientModel: Model<PatientDocument>) {}

  async registerPatient(patientDto: CreatePatientDto): Promise<any> {
    const { name, email, password, age, gender, diagnosis, doctorId } = patientDto; // ✅ Include doctorId

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
      doctorId, // ✅ Ensure doctorId is saved
    });

    await patient.save();
    return { message: 'Patient registered successfully' };
  }

  async getPatients() {
    return this.patientModel.find().select('-password'); // Exclude password for security
  }

  // ✅ Fetch Patient by ID
  async getPatientById(id: string) {
    const patient = await this.patientModel.findById(id).select('-password'); // Hide password
    if (!patient) {
      throw new NotFoundException('Patient not found');
    }
    return patient;
  }
}
