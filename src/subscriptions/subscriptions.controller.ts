import { Body, Controller, Get, Patch, Query } from '@nestjs/common'
import { SubscriptionsService } from './subscriptions.service'

@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private service: SubscriptionsService) {}

  // Get subscription
  @Get()
  getSubscription(@Query('orgId') orgId: string) {
    if (!orgId) {
      return { message: 'orgId required' }
    }

    return this.service.getByOrganization(orgId)
  }

  // Change plan
  @Patch('plan')
  changePlan(@Body() body: any) {
    const { orgId, plan } = body

    if (!orgId || !plan) {
      return { message: 'orgId and plan required' }
    }

    return this.service.changePlan(orgId, plan)
  }

  // Update status
  @Patch('status')
  updateStatus(@Body() body: any) {
    const { orgId, status } = body

    if (!orgId || !status) {
      return { message: 'orgId and status required' }
    }

    return this.service.updateStatus(orgId, status)
  }
}