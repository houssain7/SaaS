import {
    Controller,
    Post,
    Get,
    Patch,
    Delete,
    Param,
    Body,
    Req,
} from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { UseGuards } from '@nestjs/common';

@UseGuards(JwtGuard)
@Controller('organizations')
export class OrganizationsController {
    constructor(private service: OrganizationsService) { }

    @Post()
    create(@Body() body: { name: string }, @Req() req) {
        console.log(req.user);
        return this.service.createOrganization(req.user.id, body.name);
    }

    @Get()
    getMyOrgs(@Req() req) {
        return this.service.getUserOrganizations(req.user.id);
    }

    @Get(':id')
    getOne(@Param('id') id: string) {
        return this.service.getOrganization(id);
    }

    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() body: { name: string },
        @Req() req,
    ) {
        return this.service.updateOrganization(id, req.user.id, body.name);
    }

    @Delete(':id')
    delete(@Param('id') id: string, @Req() req) {
        return this.service.deleteOrganization(id, req.user.id);
    }
}