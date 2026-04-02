import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'

@Injectable()
export class OrganizationsService {
    constructor(private prisma: PrismaService) { }

    async create(name: string, userId: string) {
        const org = await this.prisma.organization.create({
            data: {
                name,
                ownerId: userId,
                memberships: {
                    create: {
                        userId,
                        role: 'OWNER',
                    },
                },
                subscription: {
                    create: {
                        plan: 'FREE',
                        status: 'ACTIVE',
                    },
                },
            },
        })

        return org
    }

    async findAll(userId: string) {
        return this.prisma.organization.findMany({
            where: {
                memberships: {
                    some: {
                        userId,
                    },
                },
            },
            include: {
                memberships: true,
                subscription: true,
            },
        })
    }

    async findOne(id: string, userId: string) {
        const org = await this.prisma.organization.findUnique({
            where: { id },
            include: {
                memberships: true,
                subscription: true,
            },
        })

        if (!org) throw new NotFoundException('Organization not found')

        const isMember = org.memberships.some(m => m.userId === userId)
        if (!isMember) throw new ForbiddenException('You do not have access to this organization')

        return org
    }

    async update(id: string, name: string, userId: string) {
        const org = await this.findOne(id, userId)

        const isOwner = org.ownerId === userId
        if (!isOwner) throw new ForbiddenException('Only organization owner can update')

        return this.prisma.organization.update({
            where: { id },
            data: { name },
        })
    }

    async delete(id: string, userId: string) {
        const org = await this.findOne(id, userId)

        const isOwner = org.ownerId === userId
        if (!isOwner) throw new ForbiddenException('Only organization owner can delete')

        return this.prisma.organization.delete({
            where: { id },
        })
    }
}