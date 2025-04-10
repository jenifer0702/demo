import {
  Controller,
  Post,
  UseGuards,
  Body,
  Get,
  Request,
  ForbiddenException,
  Param,
} from '@nestjs/common';
import { DoctorService } from './doctor.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { HospitalService } from '../hospital/hospital.service';
import { TranslationService } from '../translation/translation.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Slot, SlotDocument } from '../slot/slot.schema';
import * as moment from 'moment';
import { SetAvailabilityDto } from '../slot/seat-avaliability.dto';

@Controller('doctors')
export class DoctorController {
  constructor(
    private readonly doctorService: DoctorService,
    private readonly hospitalService: HospitalService,
    private readonly translationService: TranslationService,
    @InjectModel(Slot.name) private slotModel: Model<SlotDocument>,
  ) {}

  @Post('register')
  async registerDoctor(@Body() doctorDto) {
    return this.doctorService.createDoctor(doctorDto);
  }

  @Get()
  async getDoctors() {
    return this.doctorService.getDoctors();
  }

  @Get('hospital/:hospitalId')
  async getDoctorsByHospital(@Param('hospitalId') hospitalId: string) {
    const hospital = await this.hospitalService.findById(hospitalId);
    const lang = hospital?.defaultLanguage || 'en';

    const doctors = await this.doctorService.getDoctorsByHospital(hospitalId);
    const translatedDoctors = await this.translationService.translateList(doctors, lang);

    const message = await this.translationService.get('doctor_list', lang);

    return {
      message,
      data: translatedDoctors,
    };
  }

  @Get('patients')
  @UseGuards(JwtAuthGuard)
  async getPatientsByDoctor(@Request() req) {
    if (req.user.role !== 'doctor') {
      throw new ForbiddenException('Only doctors can view their patients.');
    }

    return this.doctorService.getPatientsByDoctorId(req.user.userId);
  }

  @Post('availability')
  @UseGuards(JwtAuthGuard)
  async setAvailability(@Request() req, @Body() body: SetAvailabilityDto) {
    if (req.user.role !== 'doctor') {
      throw new ForbiddenException('Only doctors can set availability.');
    }

    const { from, to, date } = body;
    const slots: SlotDocument[] = [];

    const start = moment(`${date} ${from}`, 'YYYY-MM-DD HH:mm');
    const end = moment(`${date} ${to}`, 'YYYY-MM-DD HH:mm');

    const existingSlots = await this.slotModel.find({
      doctor: req.user.userId,
      date,
    });

    const totalDuration = moment.duration(end.diff(start)).asMinutes();
    const breakStart = start.clone().add(totalDuration / 2, 'minutes');
    const breakEnd = breakStart.clone().add(60, 'minutes');

    let current = start.clone();

    while (current.isBefore(end)) {
      const slotEnd = current.clone().add(15, 'minutes');
      if (slotEnd.isAfter(end)) break;

      const isOverlap = existingSlots.some(slot =>
        current.isBetween(moment(slot.from, 'HH:mm'), moment(slot.to, 'HH:mm'), null, '[)'),
      );

      if (!isOverlap) {
        if (current.isBefore(breakStart) || current.isSameOrAfter(breakEnd)) {
          const slot = new this.slotModel({
            doctor: req.user.userId,
            date,
            from: current.format('HH:mm'),
            to: slotEnd.format('HH:mm'),
            isBooked: false,
          });

          await slot.save();
          slots.push(slot);
        }
      }

      current.add(15, 'minutes');
    }

    return {
      message: 'Availability set successfully.',
      slots,
    };
  }

  @Get('slots')
  @UseGuards(JwtAuthGuard)
  async getLoggedInDoctorSlots(@Request() req) {
    if (req.user.role !== 'doctor') {
      throw new ForbiddenException('Only doctors can view their slots.');
    }

    const slots = await this.slotModel.find({
      doctor: req.user.userId,
      isBooked: false,
    });

    return {
      message: 'Available slots fetched successfully.',
      data: slots,
    };
  }

  @Get('slots/booked')
  @UseGuards(JwtAuthGuard)
  async getDoctorBookedSlots(@Request() req) {
    if (req.user.role !== 'doctor') {
      throw new ForbiddenException('Only doctors can view their booked slots.');
    }

    const doctorId = new Types.ObjectId(req.user.userId); // Ensure it's a proper ObjectId

    const slots = await this.slotModel
      .find({
        doctor: doctorId,
        isBooked: true,
        bookedBy: { $ne: null },
      })
      .populate('bookedBy', 'name email');

    if (slots.length === 0) {
      return {
        message: 'No booked slots found for this doctor.',
        data: [],
      };
    }

    return {
      message: 'Booked slots fetched successfully.',
      data: slots,
    };
  }
}
