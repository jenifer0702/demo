import { IsString, IsNotEmpty, IsDateString } from 'class-validator';

export class CreateSlotDto {
  @IsString()
  @IsNotEmpty()
  date: string; // e.g. '2025-04-23'

  @IsString()
  @IsNotEmpty()
  specialist: string;

  @IsString()
  @IsNotEmpty()
  from: string; // e.g. '09:00'

  @IsString()
  @IsNotEmpty()
  to: string; // e.g. '17:00'

  @IsString()
  @IsNotEmpty()
  doctorId: string;
}
