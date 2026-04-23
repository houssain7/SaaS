import { Module } from '@nestjs/common';
import { MembershipsService } from './membership.service';
import { MembershipsController } from './membership.controller';
import { PrismaService } from '../../prisma/prisma.service';
import { OrganizationsModule } from '../organizations/organizations.module';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [OrganizationsModule, AuthModule],
  controllers: [MembershipsController],
  providers: [MembershipsService, PrismaService, JwtGuard],
})
export class MembershipsModule { }