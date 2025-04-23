import { Controller, NotFoundException, Post, Param, Body, Delete, Get, Query, UseGuards, Req, Patch, BadRequestException } from '@nestjs/common';
import { SlotService } from '../service/slot.service';
import { CreateSlotDto } from '../dto/create-slot.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../guards/roles.decorator';
import { AddPrescriptionDto } from '../dto/prescription.dto';
import { Role } from '../user/role.enum'; // Adjust the path if necessary

@Controller('slot')
export class SlotController {
  constructor(private readonly slotService: SlotService) {}

  // Endpoint for generating slots
  @Post('generate')
  async generateSlots(@Body() dto: CreateSlotDto) {
    return await this.slotService.generateSlots(dto.doctorId, dto);
  }

  // Endpoint for booking a slot using slotId
  @Post('book')
  async bookSlot(@Body() body: { slotId: string, patientId: string }) {
    return await this.slotService.bookSlot(body.slotId, body.patientId);
  }

  // Endpoint for canceling a slot using slotId
  @Delete('cancel/:slotId')
  async cancelSlot(
    @Param('slotId') slotId: string,
    @Body('patientId') patientId: string,
  ) {
    return await this.slotService.cancelSlot(slotId, patientId);
  }

  // Endpoint for rescheduling a slot (cancel old and book new one)
  @Post('reschedule')
  async rescheduleSlot(
    @Body() body: { oldSlotId: string, newSlotId: string, patientId: string },
  ) {
    return await this.slotService.rescheduleSlot(body.oldSlotId, body.newSlotId, body.patientId);
  }

  // Endpoint to get slots by doctor and patient
  @Post('get-by-doctor-and-patient')
  async getSlotsByDoctorAndPatient(
    @Body() body: { date: string, doctorId: string, patientId: string },
  ) {
    return await this.slotService.getSlotsByDoctorAndPatient(body.date, body.doctorId, body.patientId);
  }

  // Filter booked slots by patientId, doctorId, and date
  @Get('filter-booked')
  async filterBookedSlots(
    @Query('doctorId') doctorId?: string,
    @Query('patientId') patientId?: string,
    @Query('date') date?: string,
  ) {
    return await this.slotService.filterBookedSlots({ doctorId, patientId, date });
  }

  @Get('unbooked')
  async getUnbookedSlots(
    @Query('doctorId') doctorId?: string,
    @Query('date') date?: string,
  ) {
    return await this.slotService.getUnbookedSlots({ doctorId, date });
  }

  @Get('booked')
  async getBookedSlots(@Query('filter') filter: string) {
    return await this.slotService.getFilteredBookedSlots(filter);
  }

  // Endpoint for adding prescription by doctor
  @Post('doctor/prescription') 
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('doctor')
  async addPrescription(@Body() dto: AddPrescriptionDto, @Req() req: any) {
    const doctorId = req.user.userId; // ✅ Correct field from JWT
    return this.slotService.addPrescription(dto.slotId, doctorId, dto);
  }

  // Endpoint for removing prescription by doctor
  @Delete('doctor/remove-prescription/:slotId')
@UseGuards(JwtAuthGuard)
@Roles(Role.Doctor)
async removePrescription(@Param('slotId') slotId: string, @Req() req: any) {
  const currentDoctorId = req.user.userId;
  return await this.slotService.removePrescription(slotId, currentDoctorId);
}

}
