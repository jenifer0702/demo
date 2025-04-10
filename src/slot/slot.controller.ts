import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  Query,
  Patch,
  BadRequestException,
  NotFoundException,
  UseGuards,
  Req,
} from '@nestjs/common';
import { SlotService } from './slot.service';
import { Types } from 'mongoose';
import { AuthGuard } from '@nestjs/passport';

@Controller('slots')
export class SlotController {
  constructor(private readonly slotService: SlotService) {}

  @Post('generate')
  async generateSlotsBySpecialist(
    @Body() body: {doctorId:string, specialist: string; date: string; from: string; to: string }
  ) {
    const { doctorId, specialist, date, from, to } = body;
    if (!doctorId||!specialist || !date || !from || !to) {
      throw new BadRequestException(' doctorId ,Specialist, date, from, and to are required.');
    }
    return this.slotService.createSlotsBySpecialist(doctorId,specialist, date, from, to);
  }

  @Get('available')
  async getAvailableSlots(
    @Query('specialist') specialist: string,
    @Query('date') date: string
  ) {
    if (!specialist || !date) {
      throw new BadRequestException('Specialist and date are required.');
    }

    const availableSlots = await this.slotService.getAvailableSlots(specialist, date);

    if (!availableSlots.length) {
      throw new NotFoundException(
        'No available slots found for this specialist on the selected date.'
      );
    }

    return availableSlots;
  }

  @Patch('book/:slotId')
  async bookSlot(
    @Param('slotId') slotId: string,
    @Body() body: { patientId: string }
  ) {
    const { patientId } = body;

    if (!Types.ObjectId.isValid(slotId)) {
      throw new BadRequestException('Invalid slot ID.');
    }

    if (!Types.ObjectId.isValid(patientId)) {
      throw new BadRequestException('Invalid patient ID.');
    }

    const slot = await this.slotService.getSlotById(slotId);
    if (!slot) {
      throw new NotFoundException('Slot not found.');
    }

    const now = new Date();
    const slotDateTime = new Date(`${slot.date}T${slot.from}`);
    if (slotDateTime < now) {
      throw new BadRequestException('Cannot book a past slot.');
    }

    if (slot.isBooked) {
      throw new BadRequestException('This slot is already booked.');
    }

    return this.slotService.bookSlot(slotId, patientId);
  }

  @Patch('book-by-specialist')
  async bookBySpecialist(
    @Body() body: {
      specialist: string;
      date:string;
      patientId: string;
      doctorId: string;
      slotId: string;
    }
  ) {
    const { specialist,date, patientId, doctorId, slotId } = body;

    if (!specialist ||!date|| !patientId || !doctorId || !slotId) {
      throw new BadRequestException(
        'Specialist,date, doctorId, slotId, and patientId are required.'
      );
    }

    if (
      !Types.ObjectId.isValid(patientId) ||
      !Types.ObjectId.isValid(doctorId) ||
      !Types.ObjectId.isValid(slotId)
    ) {
      throw new BadRequestException('Invalid ObjectId in one or more fields.');
    }

    const slot = await this.slotService.getSlotById(slotId);
    if (!slot) {
      throw new NotFoundException('Slot not found.');
    }

    if (
      slot.specialist !== specialist ||
      slot.date !== date ||
      slot.doctor.toString() !== doctorId
    ) {
      throw new BadRequestException('Slot details do not match the provided information.');
    }

    const now = new Date();
    const slotDateTime = new Date(`${slot.date}T${slot.from}`);
    if (slotDateTime < now) {
      throw new BadRequestException('Cannot book a past slot.');
    }

    if (slot.isBooked) {
      throw new BadRequestException('This slot is already booked.');
    }

    const bookedSlot = await this.slotService.bookSlot(slotId, patientId);

    return {
      message: 'Slot booked successfully.',
      data: {
        from: bookedSlot.from,
        to: bookedSlot.to,
        date: bookedSlot.date,
        specialist: bookedSlot.specialist,
        doctorId: bookedSlot.doctor,
      },
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('booked')
  async getBookedSlots(@Req() req) {
    const user = req.user;

    if (!user || user.role !== 'doctor') {
      throw new BadRequestException('Only doctors can access their booked slots.');
    }

    const doctorId = user._id || user.id;

    if (!Types.ObjectId.isValid(doctorId)) {
      throw new BadRequestException('Invalid doctor ID in token.');
    }

    const slots = await this.slotService.getBookedSlotsByDoctor(doctorId);

    return {
      message: 'Booked slots retrieved successfully.',
      data: slots,
    };
  }

  @Patch('cancel/:slotId')
  async cancelSlot(
    @Param('slotId') slotId: string,
    @Body() body: { patientId: string }
  ) {
    const { patientId } = body;

    if (!slotId || !patientId) {
      throw new BadRequestException('slotId and patientId are required');
    }

    return this.slotService.cancelBookedSlot(slotId, patientId);
  }

  @Patch('reschedule')
  async rescheduleSlot(
    @Body() body: { oldSlotId: string; newSlotId: string; patientId: string }
  ) {
    const { oldSlotId, newSlotId, patientId } = body;

    if (!oldSlotId || !newSlotId || !patientId) {
      throw new BadRequestException('oldSlotId, newSlotId, and patientId are required.');
    }

    return this.slotService.rescheduleSlot(oldSlotId, newSlotId, patientId);
  }
}
