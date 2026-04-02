import { Module } from '@nestjs/common';
import { OrganizationService } from './organizations.service';
import { OrganizationsController } from './organizations.controller';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtStrategy } from '../guards/jwt.strategy';

@Module({
  controllers: [OrganizationsController],
  providers: [OrganizationService, PrismaService, JwtStrategy],
})
export class OrganizationModule {}