import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { PatientService } from './patient.service';
import { CreatePatientDto } from './patient.dto'; // ✅ Fixed import path
import { JwtAuthGuard } from '../auth/jwt.guard'; // ✅ Fixed import path
import { Roles } from '../guards/roles.decorator'; // ✅ Fixed import path
import { RolesGuard } from '../guards/roles.guard'; // ✅ Fixed import path

@Controller('patients')
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  @Post('register')
  async register(@Body() patientDto: CreatePatientDto) {
    return this.patientService.registerPatient(patientDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('doctor')
  @Get('list')
  async getPatients() {
    return this.patientService.getPatients();
  }
}

// ❌ Removed duplicate `export class PatientService {}` at the bottom.
