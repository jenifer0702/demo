import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Hospital } from './hospital.schema';
import { User, UserDocument } from '../user/user.schema';
import { Role } from '../user/role.enum';

@Injectable()
export class HospitalService {
  constructor(
    @InjectModel(Hospital.name) private hospitalModel: Model<Hospital>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async createHospital(hospitalDto): Promise<Hospital> {
    return new this.hospitalModel(hospitalDto).save();
  }

  async findById(hospitalId: string): Promise<Hospital> {
    const hospital = await this.hospitalModel.findById(hospitalId).lean();
    if (!hospital) {
      throw new NotFoundException('Hospital not found');
    }
    return hospital;
  }

  async getDoctorsByHospital(hospitalId: string): Promise<UserDocument[]> {
    return this.userModel.find({ hospitalId: new Types.ObjectId(hospitalId), role: Role.Doctor }).lean();
  }

  async getPatientsByHospital(hospitalId: string): Promise<UserDocument[]> {
    return this.userModel.find({ hospitalId: new Types.ObjectId(hospitalId), role: Role.Patient }).lean();
  }
}
