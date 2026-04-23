import { Module } from '@nestjs/common';
import { PlansService } from './plan.service';
import { PlansController } from './plan.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [PlansController],
  providers: [PlansService, PrismaService],
  exports: [PlansService],
})
export class PlansModule { }