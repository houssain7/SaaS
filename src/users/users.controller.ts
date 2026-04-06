import {
  Controller,
  Get,
  Put,
  Post,
  Body,
  Headers,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) { }

  // Helper: Extraire l'ID utilisateur du token JWT
  private getUserIdFromToken(authHeader: string): string {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new BadRequestException('Token manquant');
    }

    const token = authHeader.replace('Bearer ', '');
    const decoded = this.usersService.verifyToken(token);

    return decoded.sub; // 'sub' contient l'ID utilisateur
  }

  // GET /users/profile
  @Get('profile')
  async getProfile(@Headers('authorization') authHeader: string) {
    const userId = this.getUserIdFromToken(authHeader);
    return this.usersService.getUserProfile(userId);
  }

  // PUT /users/profile
  @Put('profile')
  async updateProfile(
    @Headers('authorization') authHeader: string,
    @Body() updateData: { email?: string },
  ) {
    const userId = this.getUserIdFromToken(authHeader);
    return this.usersService.updateUserProfile(userId, updateData);
  }

  // GET /users/organizations
  @Get('organizations')
  async getUserOrganizations(@Headers('authorization') authHeader: string) {
    const userId = this.getUserIdFromToken(authHeader);
    return this.usersService.getUserOrganizations(userId);
  }

  // POST /users/change-password
  @Post('change-password')
  async changePassword(
    @Headers('authorization') authHeader: string,
    @Body()
    body: { currentPassword: string; newPassword: string },
  ) {
    const userId = this.getUserIdFromToken(authHeader);
    return this.usersService.changePassword(
      userId,
      body.currentPassword,
      body.newPassword,
    );
  }
}