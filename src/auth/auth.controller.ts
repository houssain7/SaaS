import { Body, Controller, Post, UseGuards, Get, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtGuard } from './guards/jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Post('register')
  async register(@Body() body: { email: string; password: string, name: string }) {
    const { email, password, name } = body;

    if (!email || !password || !name) {
      return { message: 'Email and password and name are required' };
    }

    return this.authService.register(email, password, name);
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    const { email, password } = body;

    if (!email || !password) {
      return { message: 'Email and password required' };
    }

    return this.authService.login(email, password);
  }

  @UseGuards(JwtGuard)
  @Get('profile')
  getProfile(@Req() req: any) {
    return req.user;
  }
}