import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MedicationRequest, MedicationRequestDocument } from './medication-request.schema';

@Injectable()
export class MedicationRequestService {
  constructor(
    @InjectModel(MedicationRequest.name)
    private readonly medicationRequestModel: Model<MedicationRequestDocument>,
  ) {}

  // Patient creates a medication request
  async createRequest(patientId: string, medication: string): Promise<MedicationRequest> {
    const newRequest = new this.medicationRequestModel({
      patientId,
      medication,
      status: 'pending',
    });
    return newRequest.save();
  }

  // Get all requests for a given patient
  async getRequestsByPatient(patientId: string): Promise<MedicationRequest[]> {
    return this.medicationRequestModel.find({ patientId }).exec();
  }

  // Get only approved requests for a given patient
  async getApprovedRequestsForPatient(patientId: string): Promise<MedicationRequest[]> {
    return this.medicationRequestModel.find({ patientId, status: 'approved' }).exec();
  }

  // ADMIN: Get all medication requests
  async getAllRequests(): Promise<MedicationRequest[]> {
    return this.medicationRequestModel.find().exec();
  }

  // ADMIN: Update a medication request (e.g., approve or reject)
  async updateRequest(requestId: string, updateData: Partial<MedicationRequest>): Promise<MedicationRequest> {
    const request = await this.medicationRequestModel.findById(requestId);
    if (!request) {
      throw new NotFoundException('Medication request not found');
    }
    // Only update allowed fields: medication and status in this example.
    if (updateData.medication !== undefined) {
      request.medication = updateData.medication;
    }
    if (updateData.status !== undefined) {
      if (!['pending', 'approved', 'rejected'].includes(updateData.status)) {
        throw new BadRequestException('Invalid status provided');
      }
      request.status = updateData.status;
    }
    return request.save();
  }
}
