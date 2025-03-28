import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { Doctor, DoctorDocument } from '../doctor/doctor.schema';
import { Patient, PatientDocument } from '../patient/patient.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Doctor.name) private doctorModel: Model<DoctorDocument>,
    @InjectModel(Patient.name) private patientModel: Model<PatientDocument>,
    private jwtService: JwtService
  ) {}

  /**
   * Register a new doctor
   */
  async registerDoctor(doctorDto: any): Promise<any> {
    const { name, email, password, age, specialist } = doctorDto;

    if (age < 25) {
      throw new UnauthorizedException('Doctor must be at least 25 years old');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const doctor = new this.doctorModel({
      name,
      email,
      password: hashedPassword,
      age,
      specialist,
      role: 'doctor', // ✅ Ensure role exists
    });

    await doctor.save();
    return { message: 'Doctor registered successfully' };
  }

  /**
   * Register a new patient
   */
  async registerPatient(patientDto: any): Promise<any> {
    const { name, email, password, age, gender, diagnosis, doctorId } = patientDto;

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
      doctorId,
      role: 'patient', // ✅ Ensure role exists
    });

    await patient.save();
    return { message: 'Patient registered successfully' };
  }

  /**
   * Login a user (either doctor or patient)
   */
  async login(email: string, password: string) {
    const user =
      (await this.doctorModel.findOne({ email }).select('+password +role')) ||
      (await this.patientModel.findOne({ email }).select('+password +role'));

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // ✅ Ensure role is included in payload
    const payload = { sub: user._id, email: user.email, role: user.role };
    return { access_token: this.jwtService.sign(payload) };
  }

  /**
   * Get a list of all doctors
   */
  async findDoctors() {
    return this.doctorModel.find().select('-password'); // ✅ Exclude password
  }

  /**
   * Get a list of all patients (only for doctors)
   */
  async findPatients() {
    return this.patientModel.find().select('-password'); // ✅ Exclude password
  }
}
