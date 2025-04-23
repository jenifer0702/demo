import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Slot, SlotDocument } from '../slot/slot.schema';
import { CreateSlotDto } from '../dto/create-slot.dto';
import { AddPrescriptionDto } from '../dto/prescription.dto';
import{Request}from 'express'; 

@Injectable()
export class SlotService {
  constructor(
    @InjectModel(Slot.name) private slotModel: Model<SlotDocument>,
  ) {}

  async generateSlots(doctorId: string, dto: CreateSlotDto) {
    const fromTime = new Date(`${dto.date}T${dto.from}:00`);
    const toTime = new Date(`${dto.date}T${dto.to}:00`);
    const originalDate = dto.date;

    const slots: Partial<Slot>[] = [];
    let current = new Date(fromTime);
    let breakAdded = false;

    while (current < toTime) {
      const end = new Date(current.getTime() + 15 * 60000);

      if (!breakAdded && current.getHours() >= 13 && current.getHours() < 14) {
        current.setHours(14, 0, 0, 0);
        breakAdded = true;
        continue;
      }

      slots.push({
        doctorId: new Types.ObjectId(doctorId),
        specialist: dto.specialist,
        from: new Date(current),
        to: new Date(end),
        date: new Date(originalDate),
        isBooked: false,
      });

      current = new Date(end);
    }

    return await this.slotModel.insertMany(slots);
  }

  async bookSlot(slotId: string, patientId: string) {
    const slot = await this.slotModel.findById(slotId);
    if (!slot) throw new NotFoundException('Slot not found');
    if (slot.isBooked)
      throw new BadRequestException('Slot is already booked');

    slot.isBooked = true;
    slot.patientId = new Types.ObjectId(patientId);

    return await slot.save();
  }

  async cancelSlot(slotId: string, patientId: string) {
    const slot = await this.slotModel.findById(slotId);
    if (!slot) throw new NotFoundException('Slot not found');
    if (!slot.patientId || slot.patientId.toString() !== patientId) {
      throw new BadRequestException('Unauthorized cancellation');
    }

    slot.isBooked = false;
    slot.patientId = null;
    return await slot.save();
  }

  async rescheduleSlot(oldSlotId: string, newSlotId: string, patientId: string) {
    const oldSlot = await this.slotModel.findById(oldSlotId);
    const newSlot = await this.slotModel.findById(newSlotId);

    if (!oldSlot || !newSlot)
      throw new NotFoundException('Slot not found');
    if (newSlot.isBooked)
      throw new BadRequestException('New slot is already booked');

    if (!oldSlot.patientId || oldSlot.patientId.toString() !== patientId) {
      throw new BadRequestException('Unauthorized reschedule');
    }

    oldSlot.isBooked = false;
    oldSlot.patientId = null;
    await oldSlot.save();

    newSlot.isBooked = true;
    newSlot.patientId = new Types.ObjectId(patientId);
    return await newSlot.save();
  }

  async getSlotsByDoctorAndPatient(date: string, doctorId: string, patientId: string) {
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      throw new BadRequestException(`Invalid date format: '${date}'`);
    }

    const slots = await this.slotModel.find({
      doctorId: new Types.ObjectId(doctorId),
      date: parsedDate,
    });

    if (!slots || slots.length === 0) {
      throw new NotFoundException('No slots found');
    }

    if (patientId) {
      return slots.filter(slot => !slot.isBooked || slot.patientId?.toString() === patientId);
    }

    return slots;
  }

  async filterBookedSlots(query: {
    patientId?: string;
    doctorId?: string;
    date?: string;
  }) {
    const filter: any = { isBooked: true };

    if (query.patientId) {
      filter.patientId = new Types.ObjectId(query.patientId);
    }

    if (query.doctorId) {
      filter.doctorId = new Types.ObjectId(query.doctorId);
    }

    if (query.date) {
      const parsedDate = new Date(query.date);
      if (isNaN(parsedDate.getTime())) {
        throw new BadRequestException('Invalid date format');
      }
      filter.date = parsedDate;
    }

    return await this.slotModel.find(filter);
  }

  async getUnbookedSlots(filters: { doctorId?: string; date?: string }) {
    const query: any = { isBooked: false };

    if (filters.doctorId) {
      query.doctorId = new Types.ObjectId(filters.doctorId);
    }

    if (filters.date) {
      const parsedDate = new Date(filters.date);
      if (isNaN(parsedDate.getTime())) {
        throw new BadRequestException(`Invalid date format`);
      }
      query.date = parsedDate;
    }

    return await this.slotModel.find(query);
  }

  // ✅ OPTION 2: Filter booked slots by doctorId + patient name + date
  async getBookedSlotsWithPatientDetails(filters: {
    doctorId?: string;
    patientId?: string;
    date?: string;
    patientName?: string;
  }) {
    const matchStage: any = { isBooked: true };

    if (filters.doctorId) {
      matchStage.doctorId = new Types.ObjectId(filters.doctorId);
    }

    if (filters.patientId) {
      matchStage.patientId = new Types.ObjectId(filters.patientId);
    }

    if (filters.date) {
      const parsedDate = new Date(filters.date);
      if (isNaN(parsedDate.getTime())) {
        throw new BadRequestException('Invalid date format');
      }
      matchStage.date = parsedDate;
    }

    const pipeline: any[] = [
      { $match: matchStage },
      {
        $lookup: {
          from: 'users',
          localField: 'patientId',
          foreignField: '_id',
          as: 'patient',
        },
      },
      { $unwind: '$patient' },
    ];

    if (filters.patientName) {
      pipeline.push({
        $match: {
          'patient.name': { $regex: filters.patientName, $options: 'i' },
        },
      });
    }

    return this.slotModel.aggregate(pipeline);
  }

  async getFilteredBookedSlots(filter?: string) {
    const query: any = { patientId: { $ne: null } };
    let patientMatch: any = {};
    let doctorMatch: any = {};

    if (filter) {
      const [field, value] = filter.split('|');
      const [scope, key] = field.split('.');

      switch (scope) {
        case 'patient':
          if (key === 'name' || key === 'email') {
            patientMatch[key] = { $regex: new RegExp(value, 'i') };
          } else if (key === 'age') {
            const age = parseInt(value, 10);
            if (!isNaN(age)) patientMatch.age = age;
          } else if (key === '_id') {
            patientMatch._id = value;
          }
          break;

        case 'doctor':
          if (key === 'name') {
            doctorMatch.name = { $regex: new RegExp(value, 'i') };
          } else if (key === 'age') {
            const age = parseInt(value, 10);
            if (!isNaN(age)) doctorMatch.age = age;
          } else if (key === '_id') {
            doctorMatch._id = value;
          }
          break;
      }
    }

    const slots = await this.slotModel
      .find(query)
      .populate({
        path: 'patientId',
        match: patientMatch,
        select: 'name email age',
      })
      .populate({
        path: 'doctorId',
        match: doctorMatch,
        select: 'name age specialist',
      })
      .exec();

    return slots.filter(slot => {
      if (filter?.startsWith('doctor.') && !slot.doctorId) return false;
      if (filter?.startsWith('patient.') && !slot.patientId) return false;
      return true;
    });
  }
  async addPrescription(slotId: string, doctorId: string, dto: AddPrescriptionDto) {
    const slot = await this.slotModel.findById(slotId);
  
    if (!slot) {
      throw new NotFoundException('Slot not found');
    }
  
    if (!slot.isBooked) {
      throw new BadRequestException('Slot is not booked yet');
    }
  
    const slotDoctorId = slot.doctorId?.toString();
    const currentDoctorId = doctorId?.toString().trim();
  
    if (!slotDoctorId || slotDoctorId !== currentDoctorId) {
      console.log('Slot doctor:', slotDoctorId);
      console.log('Logged in doctor:', currentDoctorId);
      throw new BadRequestException('You are not authorized to add prescription for this slot');
    }
  
    slot.prescription = dto.prescriptions;
    await slot.save();
  
    // 🔽 Populate patient info after saving
    return this.slotModel.findById(slotId).populate('patientId', '-password -favoriteDoctors');

  }

  async findSlotById(slotId: string) {
    const slot = await this.slotModel.findById(slotId).populate('patientId', '-password -favoriteDoctors');
    if (!slot) {
      throw new NotFoundException('Slot not found');
    }
    return slot;
  }
  async removePrescription(slotId: string, doctorId: string) {
    const slot = await this.slotModel.findById(slotId);
  
    if (!slot) {
      throw new NotFoundException('Slot not found');
    }
  
    if (!slot.isBooked) {
      throw new BadRequestException('Slot is not booked yet');
    }
  
    const slotDoctorId = slot.doctorId?.toString();
  
    if (!slotDoctorId || slotDoctorId !== doctorId) {
      throw new BadRequestException('You are not authorized to remove prescription from this slot');
    }
  
    slot.prescription = []; 
    return await slot.save();
  }
}  