import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class JwtGuard implements CanActivate {
    constructor(private readonly jwtService: JwtService, private readonly authService: AuthService) { }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest<Request>();
        const token = request.headers['authorization']?.split(' ')[1];

        if (!token) {
            return false;
        }

        try {
            const payload = this.jwtService.verify(token);
            // payload uses 'sub' for the user id as defined in AuthService.generateTokens
            return this.authService.validateUser(payload.sub);
        } catch (err) {
            return false;
        }
    }
}