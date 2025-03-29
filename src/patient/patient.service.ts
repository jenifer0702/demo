import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Patient } from './patient.entity';
import { PatientDto } from './patient.dto';

@Injectable()
export class PatientService {
  constructor(@InjectModel(Patient.name) private patientModel: Model<Patient>) {}

  async create(patientDto: PatientDto) {
    const patient = new this.patientModel(patientDto);
    return patient.save();
  }

  async findAll() {
    return this.patientModel.find().exec();
  }

  async findOne(id: string) {
    const patient = await this.patientModel.findById(id).exec();
    if (!patient) {
      throw new NotFoundException('Patient not found');
    }
    return patient;
  }

  async update(id: string, patientDto: PatientDto) {
    return this.patientModel.findByIdAndUpdate(id, patientDto, { new: true });
  }

  async delete(id: string) {
    return this.patientModel.findByIdAndDelete(id).exec();
  }
}
