import { Body, Controller, Post } from '@nestjs/common'
import { AuthService } from './auth.service'

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body() body: any) {
    const { email, password } = body

    if (!email || !password) {
      return { message: 'Email and password required' }
    }

    return this.authService.register(email, password)
  }

  @Post('login')
  login(@Body() body: any) {
    const { email, password } = body

    if (!email || !password) {
      return { message: 'Email and password required' }
    }

    return this.authService.login(email, password)
  }
}