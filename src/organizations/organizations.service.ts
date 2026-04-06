import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'

@Injectable()
export class OrganizationsService {
    constructor(private prisma: PrismaService) { }

    async create(name: string) {
        return this.prisma.organization.create({
            data: {
                name,
                ownerId: "dev-user", // ✅ required by schema
                subscription: {
                    create: {
                        plan: 'FREE',
                        status: 'ACTIVE',
                    },
                },
            },
        })
    }

    async findAll() {
        return this.prisma.organization.findMany({
            include: {
                memberships: true,
                subscription: true,
            },
        })
    }

    async findOne(id: string) {
        const org = await this.prisma.organization.findUnique({
            where: { id },
            include: {
                memberships: true,
                subscription: true,
            },
        })

        if (!org) throw new NotFoundException('Organization not found')

        return org
    }

    async update(id: string, name: string) {
        await this.findOne(id)

        return this.prisma.organization.update({
            where: { id },
            data: { name },
        })
    }

    async delete(id: string) {
        await this.findOne(id)

        return this.prisma.organization.delete({
            where: { id },
        })
    }
}