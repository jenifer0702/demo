import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UserService } from '../user/user.service';
import { CreateDoctorDto } from '../user/doctor.dto';
import { CreatePatientDto } from '../user/patient.dto';
import { Role } from '../user/role.enum';
import { Types } from 'mongoose';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  // Register a new doctor
  async registerDoctor(doctorDto: CreateDoctorDto) {
    doctorDto.email = doctorDto.email.trim().toLowerCase();
    return this.userService.createDoctor(doctorDto);
  }

  // Register a new patient
  async registerPatient(patientDto: CreatePatientDto) {
    patientDto.email = patientDto.email.trim().toLowerCase();
    return this.userService.createPatient(patientDto);
  }

  // Login with role validation
  async login(email: string, password: string, role: Role) {
    const normalizedEmail = email.trim().toLowerCase();
    console.log('Login attempt with normalized email:', normalizedEmail);

    const user = await this.userService.findByEmail(normalizedEmail);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.role !== role) {
      throw new UnauthorizedException(
        `Unauthorized role access. Expected ${role}, found ${user.role}`,
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      userId: (user._id as Types.ObjectId).toString(),
      email: user.email,
      role: user.role,
      hospitalId: user.hospitalId?.toString() || null,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
