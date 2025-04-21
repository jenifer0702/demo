import { Controller, Post, Get, Body, Req, UseGuards, BadRequestException } from '@nestjs/common';
import { MedicationRequestService } from './medication-request.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateMedicationRequestDto } from './create-medication-request.dto';

@Controller('patient')
@UseGuards(AuthGuard('jwt'))
export class PatientMedicationController {
  constructor(private readonly medicationRequestService: MedicationRequestService) {}

  // POST /patient/request-medication
  @Post('request-medication')
  async requestMedication(@Body() body: CreateMedicationRequestDto, @Req() req) {
    const { medication } = body;
    
    if (!medication) {
      throw new BadRequestException('Medication is required');
    }

    // Use `userId` from JWT token as patientId
    const patientId = req.user.userId;  // Changed from `req.user._id` to `req.user.userId`
    if (!patientId) {
      throw new BadRequestException('Patient ID is required');
    }

    // Pass the patientId along with medication to the service
    const newRequest = await this.medicationRequestService.createRequest(patientId, medication);
    return {
      message: 'Medication request created successfully',
      data: newRequest,
    };
  }

  // GET /patient/request-medication-status
  @Get('request-medication-status')
  async requestMedicationStatus(@Req() req) {
    const patientId = req.user.userId;  // Changed from `req.user._id` to `req.user.userId`
    if (!patientId) {
      throw new BadRequestException('Patient ID is required');
    }

    const requests = await this.medicationRequestService.getRequestsByPatient(patientId);
    return {
      message: 'Medication request status retrieved',
      data: requests,
    };
  }

  // GET /patient/approved-medication-list
  @Get('approved-medication-list')
  async approvedMedicationList(@Req() req) {
    const patientId = req.user.userId;  // Changed from `req.user._id` to `req.user.userId`
    if (!patientId) {
      throw new BadRequestException('Patient ID is required');
    }

    const approvedRequests = await this.medicationRequestService.getApprovedRequestsForPatient(patientId);
    return {
      message: 'Approved medication list retrieved',
      data: approvedRequests,
    };
  }
}
