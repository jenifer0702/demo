import { Controller, Post, Body, Get, Param, Delete, UseGuards, Patch, Query } from '@nestjs/common';
import { DoctorService } from './doctor.service';
import { DoctorDto } from './doctor.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { isValidObjectId } from 'mongoose';

@Controller('doctor')
export class DoctorController {
  constructor(private readonly doctorService: DoctorService) {}

  // Separate the create route properly
  @Post('create')
  async create(@Body() doctorDto: DoctorDto) {
    return this.doctorService.create(doctorDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('all')
  async findAll() {
    return this.doctorService.findAll();
  }

  // Validate ID format before querying MongoDB
  @Get(':id')
  async findOne(@Param('id') id: string) {
    if (!isValidObjectId(id)) {
      return { error: 'Invalid ID format' };
    }
    return this.doctorService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() doctorDto: DoctorDto) {
    if (!isValidObjectId(id)) {
      return { error: 'Invalid ID format' };
    }
    return this.doctorService.update(id, doctorDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    if (!isValidObjectId(id)) {
      return { error: 'Invalid ID format' };
    }
    return this.doctorService.delete(id);
  }
}
