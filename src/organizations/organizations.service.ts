import {
    Injectable,
    NotFoundException,
    ForbiddenException,
    BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
@Injectable()
export class OrganizationsService {
    constructor(private prisma: PrismaService) { }

    // CREATE ORGANIZATION
    async createOrganization(userId: string, name: string) {
        const freePlan = await this.prisma.plan.findUnique({
            where: { name: 'FREE' },
        });

        if (!freePlan) {
            throw new NotFoundException('FREE plan not found');
        }

        return this.prisma.organization.create({
            data: {
                name,
                owner: {
                    connect: { id: userId },
                },
                memberships: {
                    create: {
                        userId,
                        role: 'OWNER',
                    },
                },
                subscription: {
                    create: {
                        planId: freePlan.id,
                        status: 'ACTIVE',
                    },
                },
            },
            include: {
                memberships: true,
                subscription: true,
                owner: true,
            },
        });
    }

    // GET USER ORGANIZATIONS
    async getUserOrganizations(userId: string) {
        const memberships = await this.prisma.membership.findMany({
            where: { userId },
            include: {
                organization: {
                    include: {
                        subscription: {
                            include: { plan: true },
                        },
                    },
                },
            },
        });

        return memberships.map((m) => ({
            ...m.organization,
            role: m.role,
        }));
    }

    // GET ONE ORGANIZATION
    async getOrganization(id: string) {
        const org = await this.prisma.organization.findUnique({
            where: { id },
            include: {
                subscription: { include: { plan: true } },
                memberships: {
                    include: { user: { select: { id: true, email: true } } },
                },
            },
        });

        if (!org) throw new NotFoundException('Organization not found');

        return org;
    }

    // CHECK OWNER (ONLY HERE ✅)
    async checkOwner(orgId: string, userId: string) {
        const org = await this.prisma.organization.findUnique({
            where: { id: orgId },
        });

        if (!org) throw new NotFoundException('Organization not found');

        if (org.ownerId !== userId) {
            throw new ForbiddenException('Only owner allowed');
        }
    }

    // UPDATE
    async updateOrganization(orgId: string, userId: string, name: string) {
        await this.checkOwner(orgId, userId);

        return this.prisma.organization.update({
            where: { id: orgId },
            data: { name },
        });
    }

    // DELETE
    async deleteOrganization(orgId: string, userId: string) {
        await this.checkOwner(orgId, userId);

        await this.prisma.organization.delete({
            where: { id: orgId },
        });

        return { message: 'Deleted successfully' };
    }
}