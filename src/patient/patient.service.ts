import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Patient, PatientDocument } from './patient.schema';

@Injectable()
export class PatientService {
  constructor(
    @InjectModel(Patient.name) private patientModel: Model<PatientDocument>,
  ) {}

  // ✅ Create Patient
  async create(patient: Patient): Promise<PatientDocument> {
    const newPatient = new this.patientModel(patient);
    return await newPatient.save();
  }

  // ✅ Get All Patients
  async findAll(): Promise<PatientDocument[]> {
    return await this.patientModel.find().exec();
  }

  // ✅ Get Patient by ID
  async findOne(id: string): Promise<PatientDocument> {
    const patient = await this.patientModel.findById(id).exec();
    if (!patient) {
      throw new NotFoundException('Patient not found');
    }
    return patient;
  }

  // ✅ Update Patient
  async update(id: string, patient: Partial<Patient>): Promise<PatientDocument> {
    const updatedPatient = await this.patientModel.findByIdAndUpdate(
      id,
      patient,
      { new: true },
    ).exec();

    if (!updatedPatient) {
      throw new NotFoundException('Patient not found');
    }
    return updatedPatient;
  }
  async delete(id: string): Promise<PatientDocument | null> {
    const deletedPatient = await this.patientModel.findByIdAndDelete(id).exec();

    if (!deletedPatient) {
      throw new NotFoundException(`Patient with ID ${id} not found`);
    }

    return deletedPatient;
  }
}

