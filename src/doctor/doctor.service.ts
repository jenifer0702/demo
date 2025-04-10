import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from '../user/user.schema';
import { Role } from '../user/role.enum';
import { CreateDoctorDto } from '../user/doctor.dto'; // Ensure to create a DTO for doctor creation

@Injectable()
export class DoctorService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>, // ✅ Unified model
  ) {}

  // ✅ Create a new doctor with hashed password
  async createDoctor(doctorDto: CreateDoctorDto): Promise<UserDocument> {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(doctorDto.password, salt);
    doctorDto.password = hashedPassword;
    doctorDto.role = Role.Doctor; // Ensure the role is explicitly set

    const doctor = new this.userModel(doctorDto);
    await doctor.save();
    return doctor; // returning UserDocument
  }

  // ✅ Find doctor by email and include password (important for login)
  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel
      .findOne({ email, role: Role.Doctor })
      .select('+password') // Ensure password is included for login
      .exec();
  }

  // ✅ Get all doctors
  async getDoctors(): Promise<UserDocument[]> {
    return this.userModel.find({ role: Role.Doctor }).lean(); // returning UserDocument[] with lean()
  }

  // ✅ Get patients assigned to a specific doctor
  async getPatientsByDoctorId(doctorId: string): Promise<UserDocument[]> {
    // Cast doctorId to ObjectId for querying
    const doctorObjectId = new Types.ObjectId(doctorId);
    return this.userModel
      .find({ role: Role.Patient, doctorId: doctorObjectId })
      .lean(); // returning UserDocument[] with lean()
  }

  // ✅ Get all doctors for a specific hospital
  async getDoctorsByHospital(hospitalId: string): Promise<UserDocument[]> {
    // Cast hospitalId to ObjectId for querying
    const hospitalObjectId = new Types.ObjectId(hospitalId);
    return this.userModel
      .find({ role: Role.Doctor, hospitalId: hospitalObjectId })
      .lean(); // returning UserDocument[] with lean()
  }

  // ✅ Compare password for login authentication
  async validatePassword(enteredPassword: string, storedPassword: string): Promise<boolean> {
    return bcrypt.compare(enteredPassword, storedPassword); // Compare hashed password
  }
}
