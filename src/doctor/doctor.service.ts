import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Doctor } from './doctor.entity';
import { DoctorDto } from './doctor.dto';

@Injectable()
export class DoctorService {
  constructor(@InjectModel(Doctor.name) private doctorModel: Model<Doctor>) {}

  async create(doctorDto: DoctorDto) {
    const doctor = new this.doctorModel(doctorDto);
    return doctor.save();
  }

  async findAll() {
    return this.doctorModel.find().exec();
  }

  async findOne(id: string) {
    const doctor = await this.doctorModel.findById(id).exec();
    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }
    return doctor;
  }

  async update(id: string, doctorDto: DoctorDto) {
    return this.doctorModel.findByIdAndUpdate(id, doctorDto, { new: true });
  }

  async delete(id: string) {
    return this.doctorModel.findByIdAndDelete(id).exec();
  }
}
