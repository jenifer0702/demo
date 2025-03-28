import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './login.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('login')
    async login(@Body() loginDto: LoginDto) {
        const token = await this.authService.validateUser(loginDto.username, loginDto.password);
        if (!token) {
            throw new UnauthorizedException('Invalid credentials');
        }
        return { access_token: token };
    }
}
