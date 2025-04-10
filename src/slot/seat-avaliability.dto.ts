import { IsString, IsDateString } from 'class-validator';

export class SetAvailabilityDto {
  @IsString()
  specialist: string; 

  @IsDateString()
  date: string; 

  @IsDateString()
  from: string; 

  @IsDateString()
  to: string; 
}
