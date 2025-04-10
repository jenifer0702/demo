import { Controller, Get, Post, Body, Param, NotFoundException, UseGuards } from '@nestjs/common';
import { HospitalService } from './hospital.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../guards/roles.decorator';
import { TranslationService } from '../translation/translation.service';

@Controller('hospitals')
export class HospitalController {
  constructor(
    private readonly hospitalService: HospitalService,
    private readonly translationService: TranslationService
  ) {}

  @Post('register')
  async registerHospital(@Body() hospitalDto) {
    return this.hospitalService.createHospital(hospitalDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('doctor', 'patient')
  @Get(':hospitalId')
  async getHospital(@Param('hospitalId') hospitalId: string) {
    const hospital = await this.hospitalService.findById(hospitalId);
    const lang = hospital?.defaultLanguage || 'en';

    const translatedHospital = {
      [await this.translationService.get('hospital_name', lang)]: hospital.name,
      ['ID']: hospital.hospitalId,
    };

    return {
      message: await this.translationService.get('hospital_name', lang),
      data: translatedHospital,
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('doctor', 'patient')
  @Get(':hospitalId/doctors')
  async getDoctorsByHospital(@Param('hospitalId') hospitalId: string) {
    const hospital = await this.hospitalService.findById(hospitalId);
    const lang = hospital?.defaultLanguage || 'en';

    const doctors = await this.hospitalService.getDoctorsByHospital(hospitalId);
    if (!doctors.length) throw new NotFoundException('No doctors found in this hospital.');

    const translatedDoctors = await this.translationService.translateList(doctors, lang);
    const message = await this.translationService.get('doctor_list', lang);

    return {
      message,
      data: translatedDoctors
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('doctor', 'patient')
  @Get(':hospitalId/patients')
  async getPatientsByHospital(@Param('hospitalId') hospitalId: string) {
    const hospital = await this.hospitalService.findById(hospitalId);
    const lang = hospital?.defaultLanguage || 'en';

    const patients = await this.hospitalService.getPatientsByHospital(hospitalId);
    if (!patients.length) throw new NotFoundException('No patients found in this hospital.');

    const translatedPatients = await this.translationService.translateList(patients, lang);
    const message = await this.translationService.get('patient_list', lang);

    return {
      message,
      data: translatedPatients
    };
  }
}
