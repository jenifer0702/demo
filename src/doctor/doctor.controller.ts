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
    console.log('Registering doctor:', doctorDto);
    return this.doctorService.createDoctor(doctorDto);
  }

  @Get()
  async getDoctors() {
    console.log('Fetching all doctors');
    return this.doctorService.getDoctors();
  }

  @Get('hospital/:hospitalId')
  async getDoctorsByHospital(@Param('hospitalId') hospitalId: string) {
    console.log(`Fetching doctors for hospital with ID: ${hospitalId}`);

    const hospital = await this.hospitalService.findById(hospitalId);
    const lang = hospital?.defaultLanguage || 'en';

    console.log(`Hospital language: ${lang}`);

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
      console.log('Forbidden: Only doctors can view their patients.');
      throw new ForbiddenException('Only doctors can view their patients.');
    }

    console.log('Fetching patients for doctor:', req.user.userId);
    return this.doctorService.getPatientsByDoctorId(req.user.userId);
  }

  @Post('availability')
  @UseGuards(JwtAuthGuard)
  async setAvailability(@Request() req, @Body() body: SetAvailabilityDto) {
    if (req.user.role !== 'doctor') {
      console.log('Forbidden: Only doctors can set availability.');
      throw new ForbiddenException('Only doctors can set availability.');
    }

    const { from, to, date } = body;
    const slots: SlotDocument[] = [];

    console.log(`Doctor ${req.user.userId} is setting availability from ${from} to ${to} on ${date}`);

    const start = moment(`${date} ${from}`, 'YYYY-MM-DD HH:mm');
    const end = moment(`${date} ${to}`, 'YYYY-MM-DD HH:mm');
    
    console.log(`Start time: ${start.format()}`);
    console.log(`End time: ${end.format()}`);

    const existingSlots = await this.slotModel.find({
      doctor: req.user.userId,
      date,
    });

    console.log('Existing slots:', existingSlots);

    const totalDuration = moment.duration(end.diff(start)).asMinutes();
    const breakStart = start.clone().add(totalDuration / 2, 'minutes');
    const breakEnd = breakStart.clone().add(60, 'minutes');

    console.log(`Total duration: ${totalDuration} minutes`);
    console.log(`Break Start: ${breakStart.format()}`);
    console.log(`Break End: ${breakEnd.format()}`);

    let current = start.clone();

    console.log(`Generating slots for doctor with ID ${req.user.userId}...`);

    while (current.isBefore(end)) {
      const slotEnd = current.clone().add(15, 'minutes');
      if (slotEnd.isAfter(end)) break;

      const isOverlap = existingSlots.some(slot =>
        current.isBetween(moment(slot.from, 'HH:mm'), moment(slot.to, 'HH:mm'), null, '[)'),
      );

      console.log(`Checking overlap: ${current.format('HH:mm')} - ${slotEnd.format('HH:mm')}`);
      console.log(`Is overlap: ${isOverlap}`);

      if (!isOverlap) {
        if (current.isBefore(breakStart) || current.isSameOrAfter(breakEnd)) {
          const slot = new this.slotModel({
            doctor: req.user.userId,
            date,
            from: current.format('HH:mm'),
            to: slotEnd.format('HH:mm'),
            isBooked: false,
          });

          console.log(`Creating new slot from ${current.format('HH:mm')} to ${slotEnd.format('HH:mm')}`);

          await slot.save();
          slots.push(slot);
        }
      }

      current.add(15, 'minutes');
    }

    console.log(`Total slots created: ${slots.length}`);

    return {
      message: 'Availability set successfully.',
      slots,
    };
  }


  @Get('slots')
  @UseGuards(JwtAuthGuard)
  async getLoggedInDoctorSlots(@Request() req) {
    if (req.user.role !== 'doctor') {
      console.log('Forbidden: Only doctors can view their slots.');
      throw new ForbiddenException('Only doctors can view their slots.');
    }

    console.log('Fetching available slots for doctor:', req.user.userId);

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
      console.log('Forbidden: Only doctors can view their booked slots.');
      throw new ForbiddenException('Only doctors can view their booked slots.');
    }

    const doctorId = new Types.ObjectId(req.user.userId); // Ensure it's a proper ObjectId

    console.log('Fetching booked slots for doctor:', req.user.userId);

    const slots = await this.slotModel
      .find({
        doctor: doctorId,
        isBooked: true,
        bookedBy: { $ne: null },
      })
      .populate('bookedBy', 'name email');

    if (slots.length === 0) {
      console.log('No booked slots found for doctor:', req.user.userId);
      return {
        message: 'No booked slots found for this doctor.',
        data: [],
      };
    }

    console.log('Booked slots fetched successfully:', slots.length);
    return {
      message: 'Booked slots fetched successfully.',
      data: slots,
    };
  }
}
