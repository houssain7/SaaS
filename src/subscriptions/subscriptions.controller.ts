import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  Req,
} from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { UseGuards } from '@nestjs/common';

@Controller('organizations/:orgId/subscription')
@UseGuards(JwtGuard)
export class SubscriptionsController {
  constructor(private service: SubscriptionsService) { }

  // GET SUBSCRIPTION
  @Get()
  getSubscription(@Param('orgId') orgId: string) {
    return this.service.getSubscription(orgId);
  }

  // CHANGE PLAN
  @Patch('change-plan')
  changePlan(
    @Param('orgId') orgId: string,
    @Body() body: { plan: 'FREE' | 'PRO' },
    @Req() req,
  ) {
    return this.service.changePlan(
      orgId,
      req.user.id,
      body.plan,
    );
  }

  // CANCEL
  @Patch('cancel')
  cancel(@Param('orgId') orgId: string, @Req() req) {
    return this.service.cancelSubscription(orgId, req.user.id);
  }
}