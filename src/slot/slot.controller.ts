import { Controller, Post, Get, Delete, Body, Param, Query, Req, UseGuards } from '@nestjs/common';
import { SlotService } from './slot.service';
import { JwtAuthGuard } from '../auth/jwt.guard';

@Controller('slots')
@UseGuards(JwtAuthGuard)
export class SlotController {
  constructor(private readonly slotService: SlotService) {}

  @Post('book-by-specialist')
  async bookBySpecialist(@Body() body: { specialist: string; date: string }, @Req() req) {
    const patientId = req.user.userId;
    return this.slotService.bookBySpecialist(body.specialist, body.date, patientId);
  }

  @Delete('cancel/:id')
  async cancelSlot(@Param('id') id: string, @Req() req) {
    return this.slotService.cancelSlot(id, req.user.userId);
  }

  @Post('reschedule/:id')
  async rescheduleSlot(@Param('id') id: string, @Body() body: { date: string }, @Req() req) {
    return this.slotService.rescheduleSlot(id, body.date, req.user.userId);
  }

  @Get('filter')
  async filterSlots(@Query() query) {
    const filters = {
      date: query.date,
      doctorId: query.doctorId,
      patientId: query.patientId,
      specialist: query.specialist,
      isBooked: query.isBooked === 'true' ? true : query.isBooked === 'false' ? false : undefined,
    };

    return this.slotService.filterSlots(filters);
  }
}
