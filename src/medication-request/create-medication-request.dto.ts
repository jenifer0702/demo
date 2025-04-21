// create-medication-request.dto.ts
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateMedicationRequestDto {
  @IsString()
  @IsNotEmpty()
  medication: string;
}
