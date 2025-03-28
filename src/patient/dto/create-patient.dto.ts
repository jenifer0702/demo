import { IsString, IsEmail, IsOptional, IsInt, Min, MaxLength, IsPhoneNumber } from 'class-validator';

export class CreatePatientDto {
  @IsString()
  @MaxLength(50)
  firstName: string;

  @IsString()
  @MaxLength(50)
  lastName: string;

  @IsEmail()
  email: string;

  @IsPhoneNumber('IN')
  phone: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  age?: number;
}
