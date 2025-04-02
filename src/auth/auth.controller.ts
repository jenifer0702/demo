import { Controller, Post, Body, Get, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt.guard';
import { Roles } from '../guards/roles.decorator';
import { RolesGuard } from '../guards/roles.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register/doctor')
  async registerDoctor(@Body() doctorDto: any) {
    return this.authService.registerDoctor(doctorDto);
  }

  @Post('register/patient')
  async registerPatient(@Body() patientDto: any) {
    return this.authService.registerPatient(patientDto);
  }

  @Post('login')
  async login(@Body() credentials: any) {
    return this.authService.login(credentials.email, credentials.password);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('doctor')
  @Get('doctors')
  async getDoctors() {
    return this.authService.findDoctors();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('doctor')
  @Get('patients')
  async getPatients() {
    return this.authService.findPatients();
  }
}
