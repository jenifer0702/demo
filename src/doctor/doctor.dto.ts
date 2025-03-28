import { IsString, IsEmail, MinLength, Matches, IsInt, Min } from 'class-validator';

export class CreateDoctorDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
  @Matches(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
  @Matches(/[0-9]/, { message: 'Password must contain at least one digit' })
  @Matches(/[@$!%*?&]/, { message: 'Password must contain at least one special character' })
  password: string;

  @IsInt()
  @Min(25, { message: 'Doctor must be at least 25 years old' })
  age: number;

  @IsString()
  specialist: string;
}
