import { IsEmail, IsString, MinLength} from 'class-validator';
 export class LoginDto {
    @IsEmail({},{message: 'Invalid email format'})
    email: string;

    @IsString()
    @MinLength(6,{ message:'password must be atleast 6 characters'})
    password: string;
 }