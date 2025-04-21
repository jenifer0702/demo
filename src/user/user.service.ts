import {
    Injectable,
    NotFoundException,
    BadRequestException,
    UnauthorizedException,
  } from '@nestjs/common';
  import { InjectModel } from '@nestjs/mongoose';
  import { Model, Types } from 'mongoose';
  import * as bcrypt from 'bcrypt';
  
  import { User, UserDocument } from './user.schema';
  import { CreateDoctorDto } from './doctor.dto';
  import { CreatePatientDto } from './patient.dto';
  import { Role } from './role.enum';
  
  @Injectable()
  export class UserService {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}
  
    private async hashPassword(password: string): Promise<string> {
      const salt = await bcrypt.genSalt(10);
      return bcrypt.hash(password, salt);
    }
  
    private validateObjectId(id: string, fieldName: string): Types.ObjectId {
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException(`Invalid ${fieldName}`);
      }
      return new Types.ObjectId(id);
    }
  
    async createDoctor(dto: CreateDoctorDto): Promise<UserDocument> {
      const existing = await this.userModel.findOne({ email: dto.email });
      if (existing) {
        throw new BadRequestException('Doctor already exists with this email.');
      }
  
      if (dto.age < 25) {
        throw new BadRequestException('Doctor must be at least 25 years old.');
      }
  
      const hashedPassword = await this.hashPassword(dto.password);
  
      const doctor = new this.userModel({
        ...dto,
        password: hashedPassword,
        role: Role.Doctor,
      });
  
      return doctor.save();
    }
  
    async createPatient(dto: CreatePatientDto): Promise<UserDocument> {
      const existing = await this.userModel.findOne({ email: dto.email });
      if (existing) {
        throw new BadRequestException('Patient already exists with this email.');
      }
  
      if (dto.age < 18) {
        throw new BadRequestException('Patient must be at least 18 years old.');
      }
  
      const hashedPassword = await this.hashPassword(dto.password);
  
      const patient = new this.userModel({
        ...dto,
        password: hashedPassword,
        role: Role.Patient,
      });
  
      return patient.save();
    }
  
    async findByEmail(email: string): Promise<UserDocument> {
      const user = await this.userModel.findOne({ email }).select('+password').exec();
      if (!user) {
        throw new UnauthorizedException('User not found');
      }
      return user;
    }
  
    async findById(userId: string): Promise<UserDocument> {
      const id = this.validateObjectId(userId, 'userId');
      const user = await this.userModel.findById(id);
      if (!user) throw new NotFoundException('User not found');
      return user;
    }
  
    async getPatientsByDoctorId(doctorId: string): Promise<UserDocument[]> {
      const id = this.validateObjectId(doctorId, 'doctorId');
      return this.userModel.find({ role: Role.Patient, doctorId: id }).exec();
    }
  
    async getPatientsByHospital(hospitalId: string): Promise<UserDocument[]> {
      const id = this.validateObjectId(hospitalId, 'hospitalId');
      return this.userModel.find({ role: Role.Patient, hospitalId: id }).exec();
    }
  
    async likeDoctor(patientId: string, doctorId: string): Promise<UserDocument> {
      const patientObjectId = this.validateObjectId(patientId, 'patientId');
      const doctorObjectId = this.validateObjectId(doctorId, 'doctorId');
  
      const patient = await this.userModel.findById(patientObjectId);
      if (!patient) throw new NotFoundException('Patient not found');
  
      if (!Array.isArray(patient.favoriteDoctors)) {
        patient.favoriteDoctors = [];
      }
  
      const alreadyLiked = patient.favoriteDoctors.some((id) =>
        id.toString() === doctorObjectId.toString()

      );
  
      if (!alreadyLiked) {
        
 patient.favoriteDoctors.push(doctorObjectId as any);
// Works fine if favoriteDoctors is ObjectId[]

        await patient.save();
      }
  
      return patient;
    }
  
    async unlikeDoctor(patientId: string, doctorId: string): Promise<UserDocument> {
      const patientObjectId = this.validateObjectId(patientId, 'patientId');
      const doctorObjectId = this.validateObjectId(doctorId, 'doctorId');
  
      const patient = await this.userModel.findById(patientObjectId);
      if (!patient) throw new NotFoundException('Patient not found');
  
      patient.favoriteDoctors = (patient.favoriteDoctors || []).filter(
        (id) => id.toString() !== doctorObjectId.toString(),

      );
  
      await patient.save();
      return patient;
    }
  
    async getFavoriteDoctors(patientId: string): Promise<UserDocument[]> {
      const patientObjectId = this.validateObjectId(patientId, 'patientId');
  
      const patient = await this.userModel
        .findById(patientObjectId)
        .populate({
          path: 'favoriteDoctors',
          model: this.userModel,
        })
        .exec();
  
      if (!patient) throw new NotFoundException('Patient not found');
  
      return (patient.favoriteDoctors || []) as unknown as UserDocument[];
    }
  
    async getAllDoctors(): Promise<UserDocument[]> {
      return this.userModel.find({ role: Role.Doctor }).exec();
    }
  }
  