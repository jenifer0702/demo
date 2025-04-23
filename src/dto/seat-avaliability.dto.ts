import { IsString, IsDateString } from 'class-validator';

export class SetAvailabilityDto {
  @IsString()
  specialist: string; 

  @IsString()
  doctorId:string;

  @IsString()
  date: string; 

  @IsString()
  from: string; 

  @IsString()
  to: string; 
}
