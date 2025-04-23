import { IsString, IsNotEmpty } from 'class-validator';

export class RescheduleSlotDto {
  @IsString()
  @IsNotEmpty()
  oldSlotId: string;

  @IsString()
  @IsNotEmpty()
  newSlotId: string;
}
