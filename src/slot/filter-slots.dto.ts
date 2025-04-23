import { IsBoolean, IsOptional, IsString, IsMongoId, IsDateString } from 'class-validator';

export class FilterSlotsDto {
  @IsOptional()
  @IsDateString()
  date?: string;

  @IsOptional()
  @IsMongoId()
  doctorId?: string;

  @IsOptional()
  @IsMongoId()
  patientId?: string;

  @IsOptional()
  @IsString()
  specialist?: string;

  @IsOptional()
  @IsBoolean()
  isBooked?: boolean;
}
