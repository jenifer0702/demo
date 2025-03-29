import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './login.dto';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async login(loginDto: LoginDto) {
    const payload = { email: loginDto.email, role: loginDto.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
