// dto/prescription.dto.ts

import { IsString, IsNotEmpty, ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

class PrescriptionItem {
  @IsNotEmpty()
  @IsString()
  medicine: string;

  @IsNotEmpty()
  @IsString()
  dose: string;
}

export class AddPrescriptionDto {
  @IsNotEmpty()
  @IsString()
  slotId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PrescriptionItem)
  prescriptions: PrescriptionItem[];
}
