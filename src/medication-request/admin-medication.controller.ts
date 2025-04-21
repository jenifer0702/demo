import {
    Controller,
    Get,
    Post,
    Body,
    UseGuards,
    Req,
    BadRequestException,
  } from '@nestjs/common';
  import { MedicationRequestService } from './medication-request.service';
  import { AuthGuard } from '@nestjs/passport';
  import { RolesGuard } from '../guards/roles.guard';
  import { Roles } from '../guards/roles.decorator';
  
  @Controller('admin')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('doctor') // only doctors can access this controller
  export class AdminMedicationController {
    constructor(
      private readonly medicationRequestService: MedicationRequestService,
    ) {}
  
    // GET /admin/get-all-request-medication
    @Get('get-all-request-medication')
    async getAllRequests() {
      const requests = await this.medicationRequestService.getAllRequests();
      return {
        message: 'All medication requests retrieved',
        data: requests,
      };
    }
  
    // POST /admin/update-medication
    @Post('update-medication')
    async updateMedication(
      @Body()
      body: {
        requestId: string;
        medication?: string;
        status?: 'approved' | 'pending' | 'rejected';
      },
    ) {
      const { requestId, medication, status } = body;
  
      if (!requestId) {
        throw new BadRequestException('Request ID is required');
      }
  
      const updatedRequest = await this.medicationRequestService.updateRequest(
        requestId,
        { medication, status },
      );
  
      return {
        message: 'Medication request updated successfully',
        data: updatedRequest,
      };
    }
  }
  