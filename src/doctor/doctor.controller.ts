import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { DoctorService } from './doctor.service';
import { Doctor } from './doctor.schema';

@Controller('doctors')
export class DoctorController {
  constructor(private readonly doctorService: DoctorService) {}

  @Post()
  async create(@Body() doctor: Doctor) {
    return this.doctorService.create(doctor);
  }

  @Get()
  async findAll() {
    return this.doctorService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.doctorService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() doctor: Doctor) {
    return this.doctorService.update(id, doctor);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.doctorService.delete(id);
  }
}
