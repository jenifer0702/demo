import { Injectable, CanActivate , ExecutionContext, UnauthorizedException } from "@nestjs/common";
import {JwtService } from '@nestjs/jwt';
import { Observable } from "rxjs";

@Injectable() 
export class JwtAuthGuard implements CanActivate {
    constructor(private jwtService: JwtService){}
      
    canActivate(context: ExecutionContext): boolean |Promise<boolean>| Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        const authHeader = request.headers.authorization;

        if (!authHeader) {
            throw new UnauthorizedException('No token provided');
        }
        const [, token] = authHeader.split('');

        try{
            const decoded = this.jwtService.verify(token);
            request.user = decoded;
            return true;
        } catch {
            throw new UnauthorizedException('Invalid token');
        }
        }
    }
    
    
    
