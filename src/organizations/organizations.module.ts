import { Module } from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { OrganizationsController } from './organizations.controller';
import { PrismaService } from '../../prisma/prisma.service';
import { AuthModule } from '../auth/auth.module';
import { AuthService } from 'src/auth/auth.service';

@Module({
  imports: [AuthModule],
  providers: [OrganizationsService, PrismaService],
  controllers: [OrganizationsController]
})
export class OrganizationsModule { }