import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Slot } from './slot.schema';
import { Model } from 'mongoose';

@Injectable()
export class SlotService {
  constructor(@InjectModel(Slot.name) private slotModel: Model<Slot>) {}

  async bookBySpecialist(specialist: string, date: string, patientId: string) {
    const slot = await this.slotModel.findOneAndUpdate(
      { specialist, date, isBooked: false },
      { isBooked: true, patientId },
      { new: true },
    );

    if (!slot) throw new NotFoundException('No available slots found.');

    return slot;
  }

  async cancelSlot(slotId: string, patientId: string) {
    const slot = await this.slotModel.findOne({
      _id: slotId,
      patientId,
    });

    if (!slot) throw new NotFoundException('Slot not found for this patient.');

    slot.isBooked = false;
    slot.patientId = undefined;
    await slot.save();

    return { message: 'Slot cancelled successfully.' };
  }

  async rescheduleSlot(slotId: string, newDate: string, patientId: string) {
    const currentSlot = await this.slotModel.findOne({
      _id: slotId,
      patientId,
    });

    if (!currentSlot) throw new NotFoundException('Current slot not found.');

    const newSlot = await this.slotModel.findOneAndUpdate(
      {
        specialist: currentSlot.specialist,
        doctorId: currentSlot.doctorId,
        date: newDate,
        isBooked: false,
      },
      {
        isBooked: true,
        patientId,
      },
      { new: true },
    );

    if (!newSlot) throw new NotFoundException('No available slot on new date.');

    currentSlot.isBooked = false;
    currentSlot.patientId = undefined;
    await currentSlot.save();

    return newSlot;
  }

  async filterSlots(filters: {
    date?: string;
    doctorId?: string;
    patientId?: string;
    specialist?: string;
    isBooked?: boolean;
  }) {
    const query: any = {};
    if (filters.date) query.date = filters.date;
    if (filters.doctorId) query.doctorId = filters.doctorId;
    if (filters.patientId) query.patientId = filters.patientId;
    if (filters.specialist) query.specialist = filters.specialist;
    if (typeof filters.isBooked === 'boolean') query.isBooked = filters.isBooked;

    return this.slotModel.find(query);
  }
}
