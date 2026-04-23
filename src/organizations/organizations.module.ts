import { Module } from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { OrganizationsController } from './organizations.controller';
import { PrismaService } from '../../prisma/prisma.service';
import { AuthModule } from '../auth/auth.module';
import { PlansModule } from '../plan/plan.module';

@Module({
  imports: [AuthModule, PlansModule],
  providers: [OrganizationsService, PrismaService],
  controllers: [OrganizationsController],
  exports: [OrganizationsService],
})
export class OrganizationsModule { }