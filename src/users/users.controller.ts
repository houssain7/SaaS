import { Controller, Get, Query } from '@nestjs/common'
import { UsersService } from './users.service'

@Controller('users')
export class UsersController {
  constructor(private service: UsersService) {}

  // Get profile 
  @Get('me')
  getProfile(@Query('userId') userId: string) {
    if (!userId) {
      return { message: 'userId required' }
    }

    return this.service.getProfile(userId)
  }

  // Get organizations 
  @Get('me/orgs')
  getMyOrgs(@Query('userId') userId: string) {
    if (!userId) {
      return { message: 'userId required' }
    }

    return this.service.getUserWithOrganizations(userId)
  }
}