import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Slot, SlotDocument } from './slot.schema';
import { User, UserDocument } from '../user/user.schema';
import * as moment from 'moment';

@Injectable()
export class SlotService {
  constructor(
    @InjectModel(Slot.name) private slotModel: Model<SlotDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  private generateTimeSlots(from: string, to: string): { from: string; to: string }[] {
    const slots: { from: string; to: string }[] = [];
    const start = moment(from, 'HH:mm');
    const end = moment(to, 'HH:mm');

    while (start.isBefore(end)) {
      if (start.format('HH:mm') === '12:00') {
        start.add(60, 'minutes'); // 1-hour break
        continue;
      }

      const slotEnd = moment(start).add(15, 'minutes');
      if (slotEnd.isAfter(end)) break;

      slots.push({ from: start.format('HH:mm'), to: slotEnd.format('HH:mm') });
      start.add(15, 'minutes');
    }

    return slots;
  }

  async createSlotsBySpecialist(
    doctorId: string,
    specialist: string,
    date: string,
    from: string,
    to: string,
  ): Promise<SlotDocument[]> {
    const doctor = await this.userModel.findOne({
      _id: doctorId,
      role: 'doctor',
      specialist,
    });

    if (!doctor) throw new NotFoundException('Doctor not found with the given specialist and ID');

    const existingSlots = await this.slotModel.find({ doctor: doctor._id, date });
    if (existingSlots.length > 0) {
      throw new BadRequestException('Slots already exist for this doctor on this date');
    }

    const timeSlots = this.generateTimeSlots(from, to);

    const slotsToCreate = timeSlots.map(slot => ({
      doctor: doctor._id,
      doctorId,
      specialist,
      date,
      from: slot.from,
      to: slot.to,
      isBooked: false,
    }));

    return await this.slotModel.insertMany(slotsToCreate) as SlotDocument[];
  }

  async getAvailableSlots(specialist: string, date: string): Promise<SlotDocument[]> {
    const doctor = await this.userModel.findOne({ role: 'doctor', specialist });
    if (!doctor) throw new NotFoundException('No doctor found with that specialist');

    return this.slotModel.find({
      doctor: doctor._id,
      date,
      isBooked: false,
    });
  }

  async getSlotById(slotId: string): Promise<SlotDocument> {
    if (!Types.ObjectId.isValid(slotId)) {
      throw new BadRequestException('Invalid slot ID');
    }

    const slot = await this.slotModel.findById(slotId);
    if (!slot) throw new NotFoundException('Slot not found');

    return slot;
  }

  async bookSlot(slotId: string, patientId: string): Promise<SlotDocument> {
    const slot = await this.slotModel.findById(slotId);
    if (!slot) throw new NotFoundException('Slot not found');
    if (slot.isBooked) throw new BadRequestException('Slot already booked');

    slot.isBooked = true;
    slot.bookedBy = new Types.ObjectId(patientId);
    await slot.save();
    return slot;
  }

  async getBookedSlotsByDoctor(doctorId: string): Promise<SlotDocument[]> {
    if (!Types.ObjectId.isValid(doctorId)) {
      throw new BadRequestException('Invalid doctor ID');
    }

    const slots = await this.slotModel.find({
      doctor: new Types.ObjectId(doctorId),
      isBooked: true,
    }).populate('bookedBy', '-password');

    if (!slots.length) {
      throw new NotFoundException('No booked slots found for this doctor');
    }

    return slots;
  }

  async cancelBookedSlot(slotId: string, patientId: string): Promise<SlotDocument> {
    const slot = await this.slotModel.findById(slotId);
    if (!slot) throw new NotFoundException('Slot not found');

    if (!slot.isBooked) throw new BadRequestException('Slot is not booked');
    if (slot.bookedBy?.toString() !== patientId) {
      throw new BadRequestException('You did not book this slot');
    }

    slot.isBooked = false;
    slot.bookedBy = null;
    await slot.save();

    return slot;
  }

  async rescheduleSlot(oldSlotId: string, newSlotId: string, patientId: string): Promise<any> {
    const oldSlot = await this.slotModel.findById(oldSlotId);
    const newSlot = await this.slotModel.findById(newSlotId);

    if (!oldSlot || !newSlot) {
      throw new NotFoundException('Old or new slot not found');
    }

    if (!oldSlot.isBooked || oldSlot.bookedBy?.toString() !== patientId) {
      throw new BadRequestException('Old slot is not booked by this patient');
    }

    if (newSlot.isBooked) {
      throw new BadRequestException('New slot is already booked');
    }

    oldSlot.isBooked = false;
    oldSlot.bookedBy = null;
    await oldSlot.save();

    newSlot.isBooked = true;
    newSlot.bookedBy = new Types.ObjectId(patientId);
    await newSlot.save();

    return {
      message: 'Slot rescheduled successfully',
      oldSlotId,
      newSlotId,
    };
  }
}
