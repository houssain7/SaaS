import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'

@Injectable()
export class SubscriptionsService {
  constructor(private prisma: PrismaService) {}

  // Get subscription by organization
  async getByOrganization(orgId: string) {
    return this.prisma.subscription.findUnique({
      where: { organizationId: orgId },
    })
  }

  // Change plan (FREE → PRO)
  async changePlan(orgId: string, plan: string) {
    return this.prisma.subscription.update({
      where: { organizationId: orgId },
      data: {
        plan,
      },
    })
  }

  // Update status (ACTIVE / CANCELED)
  async updateStatus(orgId: string, status: string) {
    return this.prisma.subscription.update({
      where: { organizationId: orgId },
      data: {
        status,
      },
    })
  }
}