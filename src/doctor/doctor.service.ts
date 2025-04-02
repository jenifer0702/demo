import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { Doctor, DoctorDocument } from './doctor.schema';
import { CreateDoctorDto } from './doctor.dto'
@Injectable()
export class DoctorService {
  constructor(@InjectModel(Doctor.name) private doctorModel: Model<DoctorDocument>) {}

  async registerDoctor(doctorDto: CreateDoctorDto): Promise<any> {
    const { name, email, password, age, specialist } = doctorDto;

    if (age <= 25) {
      throw new UnauthorizedException('Doctor must be above 25');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const doctor = new this.doctorModel({
      name,
      email,
      password: hashedPassword,
      age,
      specialist,
    });

    await doctor.save();
    return { message: 'Doctor registered successfully' };
  }

  async getDoctors() {
    return this.doctorModel.find().select('-password');
  }
}
