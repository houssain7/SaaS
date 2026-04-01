import { Body, Controller, Get, Post, Query } from '@nestjs/common'
import { OrganizationsService } from './organizations.service'

@Controller('organizations')
export class OrganizationsController {
  constructor(private service: OrganizationsService) {}

  // Create organization
  @Post()
  create(@Body() body: any) {
    const { name, userId } = body

    if (!name || !userId) {
      return { message: 'name and userId required' }
    }

    return this.service.create(name, userId)
  }

  // Get user organizations
  @Get()
  getUserOrgs(@Query('userId') userId: string) {
    if (!userId) {
      return { message: 'userId required' }
    }

    return this.service.findUserOrganizations(userId)
  }
}