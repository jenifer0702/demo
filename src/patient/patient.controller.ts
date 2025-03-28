import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { PatientService } from './patient.service';
import { Patient } from './patient.schema';

@Controller('patients')
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  @Post()
  async create(@Body() patient: Patient) {
    return this.patientService.create(patient);
  }

  @Get()
  async findAll() {
    return this.patientService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.patientService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() patient: Patient) {
    return this.patientService.update(id, patient);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.patientService.delete(id);
  }
}
