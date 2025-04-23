import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { CreateDoctorDto } from '../dto/doctor.dto';
import { CreatePatientDto } from '../dto/patient.dto';
import { LoginDto } from '../dto/login.dto';
import { Role } from 'src/user/role.enum';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register-doctor')
  async registerDoctor(@Body() doctorDto: CreateDoctorDto) {
    
    return this.authService.registerDoctor(doctorDto);
  }

  @Post('register-patient')
  async registerPatient(@Body() patientDto: CreatePatientDto) {
    
    return this.authService.registerPatient(patientDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {

    const { email, password, role } = loginDto;
    
    
    return this.authService.login(email, password, role as Role);
  }
}
