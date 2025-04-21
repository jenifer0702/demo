import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UserService } from '../user/user.service';
import { CreateDoctorDto } from '../user/doctor.dto';
import { CreatePatientDto } from '../user/patient.dto';
import { Types } from 'mongoose';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  // Utility method to normalize email
  private normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
  }

  // Register Doctor
  async registerDoctor(doctorDto: CreateDoctorDto) {
    return this.userService.createDoctor(doctorDto);
  }

  // Register Patient
  async registerPatient(patientDto: CreatePatientDto) {
    return this.userService.createPatient(patientDto);
  }

  // Login
  async login(email: string, password: string, role: string) {
    const normalizedEmail = this.normalizeEmail(email);
    console.log('Login attempt with normalized email:', normalizedEmail);

    // Find user by email
    const user = await this.userService.findByEmail(normalizedEmail);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Optional: Validate user role
    if (user.role !== role) {
      throw new UnauthorizedException('Invalid role');
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Create JWT payload
    const payload = {
      userId: (user._id as Types.ObjectId).toString(),
      email: user.email,
      role: user.role,
      hospitalId: user.hospitalId,
    };

    // Return JWT and user info
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        hospitalId: user.hospitalId,
      },
    };
  }
}
