import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Param,
    Body,
} from '@nestjs/common';
import { PlansService } from './plan.service';

@Controller('plans')
export class PlansController {
    constructor(private readonly service: PlansService) { }

    // GET ALL
    @Get()
    getAll() {
        return this.service.getPlans();
    }

    // GET ONE
    @Get(':id')
    getOne(@Param('id') id: string) {
        return this.service.getPlanById(id);
    }

    // CREATE (ADMIN ONLY later with guard)
    @Post()
    create(@Body() body: any) {
        console.log(body);
        return this.service.createPlan(body);
    }

    // UPDATE
    @Put(':id')
    update(@Param('id') id: string, @Body() body) {
        return this.service.updatePlan(id, body);
    }

    // DELETE
    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.service.deletePlan(id);
    }
}