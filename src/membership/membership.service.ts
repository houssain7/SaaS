import {
    Injectable,
    NotFoundException,
    ForbiddenException,
    BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { OrganizationsService } from 'src/organizations/organizations.service';
@Injectable()
export class MembershipsService {
    constructor(
        private prisma: PrismaService,
        private orgService: OrganizationsService, // ✅ inject
    ) { }

    // ADD MEMBER
    async addMember(
        orgId: string,
        ownerId: string,
        userId: string,
        role: 'MEMBER' | 'OWNER' = 'MEMBER',
    ) {
        // ✅ SECURITY
        await this.orgService.checkOwner(orgId, ownerId);

        const org = await this.prisma.organization.findUnique({
            where: { id: orgId },
            include: {
                subscription: { include: { plan: true } },
            },
        });

        if (!org) throw new NotFoundException('Organization not found');

        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) throw new NotFoundException('User not found');

        const existing = await this.prisma.membership.findUnique({
            where: {
                userId_organizationId: {
                    userId,
                    organizationId: orgId,
                },
            },
        });

        if (existing) {
            throw new BadRequestException('User already a member');
        }

        const count = await this.prisma.membership.count({
            where: { organizationId: orgId },
        });

        if (!org.subscription) {
            throw new BadRequestException('Subscription not found');
        }

        if (count >= org.subscription.plan.maxMembers) {
            throw new BadRequestException('Membership limit reached');
        }

        return this.prisma.membership.create({
            data: {
                userId,
                organizationId: orgId,
                role, // ✅ FIXED
            },
        });
    }

    // GET MEMBERS
    async getMembers(orgId: string) {
        return this.prisma.membership.findMany({
            where: { organizationId: orgId },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                    },
                },
            },
        });
    }

    // REMOVE MEMBER
    async removeMember(orgId: string, ownerId: string, targetUserId: string) {
        await this.orgService.checkOwner(orgId, ownerId);

        const membership = await this.prisma.membership.findUnique({
            where: {
                userId_organizationId: {
                    userId: targetUserId,
                    organizationId: orgId,
                },
            },
        });

        if (!membership) {
            throw new NotFoundException('Membership not found');
        }

        if (membership.role === 'OWNER') {
            throw new ForbiddenException('Cannot remove owner');
        }

        await this.prisma.membership.delete({
            where: {
                userId_organizationId: {
                    userId: targetUserId,
                    organizationId: orgId,
                },
            },
        });

        return { message: 'Member removed' };
    }

    // UPDATE ROLE
    async updateRole(
        orgId: string,
        ownerId: string,
        targetUserId: string,
        role: 'OWNER' | 'MEMBER',
    ) {
        await this.orgService.checkOwner(orgId, ownerId);

        const membership = await this.prisma.membership.findUnique({
            where: {
                userId_organizationId: {
                    userId: targetUserId,
                    organizationId: orgId,
                },
            },
        });

        if (!membership) {
            throw new NotFoundException('Membership not found');
        }

        if (membership.role === 'OWNER') {
            throw new ForbiddenException('Cannot change owner role');
        }

        return this.prisma.membership.update({
            where: {
                userId_organizationId: {
                    userId: targetUserId,
                    organizationId: orgId,
                },
            },
            data: { role },
        });
    }
}