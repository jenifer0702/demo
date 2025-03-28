import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Doctor, DoctorDocument } from './doctor.schema';

@Injectable()
export class DoctorService {
  constructor(
    @InjectModel(Doctor.name) private doctorModel: Model<DoctorDocument>,
  ) {}

  // ✅ Create Doctor
  async create(doctor: Doctor): Promise<DoctorDocument> {
    const newDoctor = new this.doctorModel(doctor);
    return await newDoctor.save();
  }

  // ✅ Get All Doctors
  async findAll(): Promise<DoctorDocument[]> {
    return await this.doctorModel.find().exec();
  }

  // ✅ Get Doctor by ID
  async findOne(id: string): Promise<DoctorDocument> {
    const doctor = await this.doctorModel.findById(id).exec();
    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }
    return doctor;
  }

  // ✅ Update Doctor
  async update(id: string, doctor: Partial<Doctor>): Promise<DoctorDocument> {
    const updatedDoctor = await this.doctorModel.findByIdAndUpdate(
      id,
      doctor,
      { new: true },
    ).exec();

    if (!updatedDoctor) {
      throw new NotFoundException('Doctor not found');
    }
    return updatedDoctor;
  }

  // ✅ Delete Doctor
  async delete(id: string): Promise<DoctorDocument> {
    const deletedDoctor = await this.doctorModel.findByIdAndDelete(id).exec();
    if (!deletedDoctor) {
      throw new NotFoundException('Doctor not found');
    }
    return deletedDoctor;
  }
}
