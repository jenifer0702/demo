import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from '../user/user.schema'; // Use UserDocument
import * as bcrypt from 'bcrypt';

@Injectable()
export class PatientService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>, // Using the User model
  ) {}

  // Register a new patient
  async registerPatient(patientDto): Promise<UserDocument> { 
    const existingPatient = await this.userModel.findOne({
      email: patientDto.email,
      role: 'patient',
    });

    if (existingPatient) {
      throw new ConflictException('A patient with this email already exists.');
    }

    const hashedPassword = await bcrypt.hash(patientDto.password, 10);

    const patient = new this.userModel({
      ...patientDto,
      password: hashedPassword,
      role: 'patient',
    });

    return patient.save();
  }

  // Find patient by email
  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).select('+password').exec();
  }

  // Get patients by doctor's ID
  async getPatientsByDoctorId(doctorId: string): Promise<UserDocument[]> {
    const doctorObjectId = new Types.ObjectId(doctorId);
    return this.userModel
      .find({ doctorId: doctorObjectId, role: 'patient' })
      .lean()
      .exec();
  }

  // Get patients by hospital ID
  async getPatientsByHospital(hospitalId: string): Promise<UserDocument[]> {
    const hospitalObjectId = new Types.ObjectId(hospitalId);
    return this.userModel
      .find({ hospitalId: hospitalObjectId, role: 'patient' })
      .lean()
      .exec();
  }

  // Like a doctor (add to favorite)
  async likeDoctor(patientId: string, doctorId: string): Promise<UserDocument> {
    const doctorObjectId = new Types.ObjectId(doctorId);
    const updatedPatient = await this.userModel
      .findOneAndUpdate(
        { _id: patientId, role: 'patient' },
        { $addToSet: { favoriteDoctors: doctorObjectId } },
        { new: true },
      )
      .populate('favoriteDoctors', '-password') // Populate with only the Doctor details
      .exec();

    if (!updatedPatient) {
      throw new NotFoundException('Patient not found.');
    }

    return updatedPatient;
  }

  // Unlike a doctor (remove from favorite)
  async unlikeDoctor(patientId: string, doctorId: string): Promise<UserDocument> {
    const doctorObjectId = new Types.ObjectId(doctorId);
    const updatedPatient = await this.userModel
      .findOneAndUpdate(
        { _id: patientId, role: 'patient' },
        { $pull: { favoriteDoctors: doctorObjectId } },
        { new: true },
      )
      .populate('favoriteDoctors', '-password') // Populate with only the Doctor details
      .exec();

    if (!updatedPatient) {
      throw new NotFoundException('Patient not found.');
    }

    return updatedPatient;
  }

  // Get favorite doctors for a patient
  async getFavoriteDoctors(patientId: string): Promise<UserDocument[]> {
    const patient = await this.userModel
      .findOne({ _id: patientId, role: 'patient' })
      .populate({
        path: 'favoriteDoctors',
        match: { role: 'doctor' }, // Ensure only doctors are populated
        select: '-password', // Exclude password from populated users
      })
      .exec();

    if (!patient) {
      throw new NotFoundException('Patient not found.');
    }

    return (patient as any).favoriteDoctors || []; // Return an array of User
  }
}
