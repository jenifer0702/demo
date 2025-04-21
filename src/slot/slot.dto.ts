import { IsString, IsNotEmpty, Matches } from 'class-validator';

export class BookSlotDto {
  @IsNotEmpty()
  @IsString()
  doctorId: string;

  @IsNotEmpty()
  @IsString()
  patientId: string;

  @IsNotEmpty()
  @IsString()
  specialist: string;

  @IsNotEmpty()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'Date must be in YYYY-MM-DD format' })
  date: string;
  
  @IsNotEmpty()
  @IsString() // Accept '09:00' style string
  from: string;

  @IsNotEmpty()
  @IsString()
  to: string;
}
