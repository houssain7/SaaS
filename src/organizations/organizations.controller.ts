import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { JwtAuthGuard } from '../guards/jwt.guard';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Organizations')
@ApiBearerAuth() // Swagger montre que le endpoint est protégé
@Controller('organizations')
export class OrganizationsController {
  constructor(private readonly organizationService: OrganizationsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'Get all organizations (JWT protected)' })
  @ApiResponse({ status: 200, description: 'List of organizations' })
  findAll() {
    return this.organizationService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Get organization by ID (JWT protected)' })
  findOne(@Param('id') id: string) {
    return this.organizationService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Create a new organization (JWT protected)' })
  create(@Body() body: { name: string }) {
    return this.organizationService.create(body.name);
  }
}