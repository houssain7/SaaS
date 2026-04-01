import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'

@Injectable()
export class OrganizationsService {
  constructor(private prisma: PrismaService) {}

  // Create Organization
  async create(name: string, userId: string) {
    return this.prisma.organization.create({
      data: {
        name,
        ownerId: userId,

        // create membership (OWNER)
        memberships: {
          create: {
            userId: userId,
            role: 'OWNER',
          },
        },

        // create subscription (FREE)
        subscription: {
          create: {
            plan: 'FREE',
            status: 'ACTIVE',
          },
        },
      },
      include: {
        memberships: true,
        subscription: true,
      },
    })
  }

  // Get all organizations of a user
  async findUserOrganizations(userId: string) {
    return this.prisma.membership.findMany({
      where: { userId },
      include: {
        organization: true,
      },
    })
  }
}