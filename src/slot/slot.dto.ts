import { IsString,IsNotEmpty, IsDateString } from 'class-validator';

export class BookSlotDto {
  @IsNotEmpty()
  @IsString()
  doctorId: string;
  
  @IsString()
  patientId: string;

  @IsString()
  specialist: string; // Add specialist to the DTO

  @IsDateString()
  date: string; // Add date to the DTO
}
