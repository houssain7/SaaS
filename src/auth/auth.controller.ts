import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UseGuards, Get, Req } from '@nestjs/common';
import { JwtGuard } from './guards/jwt.guard';
// Swagger decorators
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiBody({
    schema: {
      example: { email: 'test@test.com', password: '123456' },
    },
  })
  async register(@Body() body: { email: string; password: string }) {
    const { email, password } = body;

    if (!email || !password) {
      return { message: 'Email and password required' };
    }

    return this.authService.register(email, password);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login user and return JWT' })
  @ApiResponse({ status: 200, description: 'User logged in successfully' })
  @ApiBody({
    schema: {
      example: { email: 'test@test.com', password: '123456' },
    },
  })
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
        return req.user
    }
}