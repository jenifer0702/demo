import { Controller, Post, Body, Get, UseGuards, Request, Param, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PatientService } from './patient.service';
import { CreatePatientDto } from './patient.dto'; 
import { JwtAuthGuard } from '../auth/jwt.guard';
import { Roles } from '../guards/roles.decorator';
import { RolesGuard } from '../guards/roles.guard';

@Controller('patients')
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  @Post('register')
  async register(@Body() patientDto: CreatePatientDto) {
    return this.patientService.registerPatient(patientDto);
  }

  // ✅ Only Doctors Can View the List of Patients
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('doctor')
  @Get('list')
  async getPatients() {
    return this.patientService.getPatients();
  }

  // ✅ Only Assigned Doctor or Patient Themselves Can View Diagnosis
  @UseGuards(JwtAuthGuard)
  @Get('diagnosis/:id')
  async getDiagnosis(@Request() req, @Param('id') patientId: string) {
    const patient = await this.patientService.getPatientById(patientId);

    if (!patient) {
      throw new NotFoundException('Patient not found');
    }

    // ✅ Allow access if the logged-in user is the assigned doctor
    if (req.user.role === 'doctor' && req.user.userId === patient.doctorId.toString()) {
      return patient;
    }

    // ✅ Allow access if the logged-in user is the patient themselves
    if (req.user.role === 'patient' && req.user.userId === patientId) {
      return patient;
    }

    throw new ForbiddenException('Access denied');
  }
}
