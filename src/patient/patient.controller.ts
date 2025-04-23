import {
  Controller,
  Post,
  UseGuards,
  Body,
  Get,
  Param,
  Request,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { PatientService } from '../service/patient.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { HospitalService } from '../service/hospital.service';
import { TranslationService } from '../service/translation.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Slot, SlotDocument } from '../slot/slot.schema';
import { User, UserDocument } from '../user/user.schema';
import { BookSlotDto } from '../dto/slot.dto';
import * as moment from 'moment';
import { Role } from '../user/role.enum'; // adjust the path if needed


@Controller('patients')
export class PatientController {
  constructor(
    private readonly patientService: PatientService,
    private readonly hospitalService: HospitalService,
    private readonly translationService: TranslationService,
    @InjectModel(Slot.name) private readonly slotModel: Model<SlotDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  @Post('register')
  async registerPatient(@Body() patientDto) {
    return this.patientService.registerPatient(patientDto);
  }

  @Get('doctor/:doctorId')
  @UseGuards(JwtAuthGuard)
  async getPatientsByDoctor(@Param('doctorId') doctorId: string) {
    return this.patientService.getPatientsByDoctorId(doctorId);
  }

  @Get('hospital/:hospitalId')
  @UseGuards(JwtAuthGuard)
  async getPatientsByHospital(@Param('hospitalId') hospitalId: string) {
    const hospital = await this.hospitalService.findById(hospitalId);
    if (!hospital) throw new NotFoundException('Hospital not found');

    const lang = hospital.defaultLanguage || 'en';
    const patients = await this.patientService.getPatientsByHospital(hospitalId);
    const translatedPatients = await this.translationService.translateList(patients, lang);
    const message = await this.translationService.get('patient_list', lang);

    return {
      message,
      data: translatedPatients,
    };
  }

  @Post('book-slot')
  @UseGuards(JwtAuthGuard)
  async bookSlot(@Request() req, @Body() body: BookSlotDto) {
    if (req.user.role !== 'patient') {
      throw new ForbiddenException('Only patients can book slots.');
    }

    const { specialist, date } = body;
    const formattedDate = moment(date, 'YYYY-MM-DD').format('YYYY-MM-DD');

    const doctor = await this.userModel.findOne({ specialist, role: 'doctor' });

    if (!doctor) {
      return { message: 'No doctor available for this specialist.' };
    }

    const slot = await this.slotModel.findOneAndUpdate(
      {
        doctor: doctor._id,
        date: formattedDate,
        isBooked: false,
        bookedBy: null,
      },
      {
        isBooked: true,
        bookedBy: req.user.userId,
      },
      { sort: { from: 1 }, new: true },
    );

    if (!slot) {
      throw new NotFoundException('No available slots for this specialist on the selected date.');
    }

    return {
      message: 'Slot booked successfully.',
      data: slot,
    };
  }

  @Get('slots')
  @UseGuards(JwtAuthGuard)
  async getSlotsForDoctor(@Request() req) {
    if (req.user.role !== 'doctor') {
      throw new ForbiddenException('Only doctors can view their slots.');
    }

    const doctorId = req.user.userId;
    const slots = await this.slotModel.find({ doctor: doctorId }).sort({ date: 1, from: 1 });

    if (!slots || slots.length === 0) {
      throw new NotFoundException('No slots found for this doctor.');
    }

    return {
      message: 'Doctor slots retrieved successfully.',
      data: slots,
    };
  }

  @Post('add-to-favourite')
  @UseGuards(JwtAuthGuard)
  async addToFavourite(@Request() req, @Body('doctorId') doctorId: string) {
    if (req.user.role !== 'patient') {
      throw new ForbiddenException('Only patients can add to favourites.');
    }

    const patient = await this.userModel.findById(req.user.userId).exec();
    if (!patient || patient.role !== Role.Patient) {
      throw new ForbiddenException('Invalid patient.');
    }

    const updatedPatient = await this.patientService.likeDoctor(
      req.user.userId,
      doctorId,
    );

    return {
      message: 'Doctor added to favourites.',
      favourites: updatedPatient.favoriteDoctors,
    };
  }

  @Post('remove-from-favourite')
  @UseGuards(JwtAuthGuard)
  async removeFromFavourite(@Request() req, @Body('doctorId') doctorId: string) {
    if (req.user.role !== 'patient') {
      throw new ForbiddenException('Only patients can remove from favourites.');
    }

    const patient = await this.userModel.findById(req.user.userId).exec();
    if (!patient || patient.role !== Role.Patient) {
      throw new ForbiddenException('Invalid patient.');
    }

    const updatedPatient = await this.patientService.unlikeDoctor(
      req.user.userId,
      doctorId,
    );

    return {
      message: 'Doctor removed from favourites.',
      favourites: updatedPatient.favoriteDoctors,
    };
  }

  @Get('favourite-list')
  @UseGuards(JwtAuthGuard)
  async getFavouriteList(@Request() req) {
    if (req.user.role !== 'patient') {
      throw new ForbiddenException('Only patients can view favourite list.');
    }

    const patient = await this.userModel.findById(req.user.userId).exec();
    if (!patient || patient.role !== Role.Patient) {
      throw new ForbiddenException('Invalid patient.');
    }

    const favourites = await this.patientService.getFavoriteDoctors(req.user.userId);
    return {
      message: 'Favourite doctor list fetched successfully.',
      data: favourites,
    };
  }
}
