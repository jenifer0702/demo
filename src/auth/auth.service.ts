import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    private users = [
        { id: 1, username: 'admin', password: 'admin123' },
        { id: 2, username: 'user', password: 'user123' }
    ];

    constructor(private jwtService: JwtService) {}

    async validateUser(username: string, password: string): Promise<string | null> {
        const user = this.users.find(u => u.username === username && u.password === password);
        if (user) {
            const payload = { username: user.username, sub: user.id };
            return this.jwtService.sign(payload);
        }
        return null;
    }
}
