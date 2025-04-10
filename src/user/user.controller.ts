import {
    Body,
    Controller,
    Post,
    Get,
    Param,
    UseGuards,
    Req,
  } from '@nestjs/common';
  import { UserService } from './user.service';
  import { CreateDoctorDto } from './doctor.dto';
  import { CreatePatientDto } from './patient.dto';
  import { JwtAuthGuard } from '../auth/jwt.guard';
  
  @Controller('users')
  export class UserController {
    constructor(private readonly userService: UserService) {}
  
    @Post('register/doctor')
    createDoctor(@Body() dto: CreateDoctorDto) {
      return this.userService.createDoctor(dto);
    }
  
    @Post('register/patient')
    createPatient(@Body() dto: CreatePatientDto) {
      return this.userService.createPatient(dto);
    }
  
    @Post('like/:doctorId')
    @UseGuards(JwtAuthGuard)
    likeDoctor(@Req() req, @Param('doctorId') doctorId: string) {
      return this.userService.likeDoctor(req.user._id, doctorId);
    }
  
    @Post('unlike/:doctorId')
    @UseGuards(JwtAuthGuard)
    unlikeDoctor(@Req() req, @Param('doctorId') doctorId: string) {
      return this.userService.unlikeDoctor(req.user._id, doctorId);
    }
  
    @Get('favorites')
    @UseGuards(JwtAuthGuard)
    getFavorites(@Req() req) {
      return this.userService.getFavoriteDoctors(req.user._id);
    }
  
    @Get('doctors')
    getAllDoctors() {
      return this.userService.getAllDoctors();
    }
  }
  