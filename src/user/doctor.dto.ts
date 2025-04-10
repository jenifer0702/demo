import { IsEmail, IsNotEmpty, MinLength, Matches, IsInt, Min, IsMongoId } from 'class-validator';

export class CreateDoctorDto {
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/, {
    message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
  })
  password: string;

  @IsInt()
  @Min(25, { message: 'Doctor age must be at least 25' })
  age: number;

  @IsNotEmpty()
  specialist: string;

  @IsNotEmpty()
  @IsMongoId({ message: 'Invalid hospitalId format' })
  hospitalId: string;

  @IsNotEmpty()
  role: string;
}
