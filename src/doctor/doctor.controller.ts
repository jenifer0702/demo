import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { DoctorService } from './doctor.service';
import { CreateDoctorDto } from './doctor.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { Roles } from '../guards/roles.decorator';
import { RolesGuard } from '../guards/roles.guard';

@Controller('doctors')
export class DoctorController {
  constructor(private readonly doctorService: DoctorService) {}

  @Post('register')
  async register(@Body() doctorDto: CreateDoctorDto) {
    return this.doctorService.registerDoctor(doctorDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('doctor')
  @Get('list')
  async getDoctors() {
    return this.doctorService.getDoctors();
  }
}
