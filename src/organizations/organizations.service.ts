import { Injectable } from '@nestjs/common'
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
}
//