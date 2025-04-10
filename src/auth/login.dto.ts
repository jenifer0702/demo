import { IsEmail, IsString, IsNotEmpty, IsIn, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)  // Ensure the password has at least 6 characters
  password: string;

  @IsString()
  @IsIn(['doctor', 'patient'])  // Role must be either 'doctor' or 'patient'
  role: string;  
}
