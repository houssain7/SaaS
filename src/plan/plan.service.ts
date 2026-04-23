import {
    Injectable,
    NotFoundException,
    BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PlansService {
    constructor(private prisma: PrismaService) { }

    // GET ALL PLANS
    async getPlans() {
        return this.prisma.plan.findMany();
    }

    // GET ONE PLAN
    async getPlanById(id: string) {
        const plan = await this.prisma.plan.findUnique({
            where: { id },
        });

        if (!plan) throw new NotFoundException('Plan not found');

        return plan;
    }

    // GET BY NAME (VERY IMPORTANT)
    async getPlanByName(name: string) {
        const plan = await this.prisma.plan.findUnique({
            where: { name },
        });

        if (!plan) throw new NotFoundException('Plan not found');

        return plan;
    }

    // CREATE PLAN (ADMIN)
    async createPlan(data: any) {
        console.log('DATA:', data); // 👈 ADD THIS

        if (!data) {
            throw new BadRequestException('Body is missing');
        }
        const { name, maxMembers, price, features } = data;

        if (!name) {
            throw new BadRequestException('Name is required');
        }

        const exists = await this.prisma.plan.findUnique({
            where: { name },
        });

        if (exists) throw new BadRequestException('Plan already exists');

        return this.prisma.plan.create({
            data: {
                name,
                maxMembers,
                price,
                features,
            },
        });
    }

    // UPDATE PLAN
    async updatePlan(id: string, data: any) {
        return this.prisma.plan.update({
            where: { id },
            data,
        });
    }

    // DELETE PLAN
    async deletePlan(id: string) {
        await this.getPlanById(id);

        return this.prisma.plan.delete({
            where: { id },
        });
    }
}