import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { OrganizationsService } from 'src/organizations/organizations.service';

@Injectable()
export class SubscriptionsService {
  constructor(
    private prisma: PrismaService,
    private orgService: OrganizationsService, // ✅ reuse
  ) { }

  // GET SUBSCRIPTION
  async getSubscription(orgId: string) {
    const sub = await this.prisma.subscription.findUnique({
      where: { organizationId: orgId },
      include: { plan: true },
    });

    if (!sub) throw new NotFoundException('Subscription not found');
    return sub;
  }

  // CHANGE PLAN
  async changePlan(
    orgId: string,
    userId: string,
    planName: 'FREE' | 'PRO',
  ) {
    await this.orgService.checkOwner(orgId, userId);

    const plan = await this.prisma.plan.findUnique({
      where: { name: planName },
    });

    if (!plan) throw new NotFoundException('Plan not found');

    return this.prisma.subscription.update({
      where: { organizationId: orgId },
      data: {
        plan: { connect: { id: plan.id } },
        status: 'ACTIVE',
        renewalDate: new Date(
          new Date().setMonth(new Date().getMonth() + 1),
        ),
      },
      include: { plan: true },
    });
  }

  // CANCEL SUBSCRIPTION
  async cancelSubscription(orgId: string, userId: string) {
    await this.orgService.checkOwner(orgId, userId);

    return this.prisma.subscription.update({
      where: { organizationId: orgId },
      data: { status: 'CANCELLED' },
    });
  }

  // CHECK IF PRO
  async isPro(orgId: string): Promise<boolean> {
    const sub = await this.prisma.subscription.findUnique({
      where: { organizationId: orgId },
      include: { plan: true },
    });

    if (!sub) return false;

    return sub.plan.name === 'PRO';
  }
}