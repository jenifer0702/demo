import { IsEmail, IsNotEmpty, MinLength, Matches, IsInt, Min, IsMongoId, IsIn, IsEnum } from 'class-validator';
import { Role } from '../user/role.enum';  // Importing Role enum for role validation

export class CreatePatientDto {
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
    message:
      'Password too weak. Must contain uppercase, lowercase, number, and special character.',
  })
  password: string;

  @IsInt()
  @Min(18)
  age: number;

  @IsNotEmpty()
  @IsIn(['Male', 'Female', 'Other'])
  gender: string;

  @IsNotEmpty()
  diagnosis: string;

  @IsEnum(Role)
  role: Role;  // Ensuring that the role is a valid Role enum value

  @IsNotEmpty()
  address: string;

  @IsMongoId()
  doctorId: string;

  @IsMongoId()
  hospitalId: string;
}
