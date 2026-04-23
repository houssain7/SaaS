import {
  Controller,
  Get,
  Put,
  Post,
  Body,
  Headers,
  BadRequestException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthService } from '../auth/auth.service';

@Controller('users')
export class UsersController {
  constructor(
    @Inject(forwardRef(() => AuthService))
    private usersService: UsersService,
    private authService: AuthService,
  ) { }

  // Extraire userId du JWT
  private getUserIdFromToken(authHeader: string): string {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new BadRequestException('Token manquant');
    }

    const token = authHeader.replace('Bearer ', '');
    const decoded = this.authService.verifyToken(token);

    return decoded.sub;
  }

  @Get('profile')
  async getProfile(@Headers('authorization') authHeader: string) {
    const userId = this.getUserIdFromToken(authHeader);
    return this.usersService.getUserProfile(userId);
  }

  @Put('profile')
  async updateProfile(
    @Headers('authorization') authHeader: string,
    @Body() updateData: { email?: string },
  ) {
    const userId = this.getUserIdFromToken(authHeader);
    return this.usersService.updateUserProfile(userId, updateData);
  }

  @Get('organizations')
  async getUserOrganizations(@Headers('authorization') authHeader: string) {
    const userId = this.getUserIdFromToken(authHeader);
    return this.usersService.getUserOrganizations(userId);
  }

  @Post('change-password')
  async changePassword(
    @Headers('authorization') authHeader: string,
    @Body() body: { currentPassword: string; newPassword: string },
  ) {
    const userId = this.getUserIdFromToken(authHeader);
    return this.usersService.changePassword(
      userId,
      body.currentPassword,
      body.newPassword,
    );
  }
}