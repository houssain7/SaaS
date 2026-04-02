import { Body, Controller, Post, Get, UseGuards, Req, Param, Put, Delete } from '@nestjs/common'
import { OrganizationsService } from './organizations.service'
import { JwtGuard } from '../auth/guards/jwt.guard'

@Controller('organizations')
@UseGuards(JwtGuard)
export class OrganizationsController {
    constructor(private service: OrganizationsService) { }

    @Post()
    create(@Body() body: any, @Req() req: any) {
        return this.service.create(body.name, req.user.userId)
    }

    @Get()
    findAll(@Req() req: any) {
        return this.service.findAll(req.user.userId)
    }

    @Get(':id')
    findOne(@Param('id') id: string, @Req() req: any) {
        return this.service.findOne(id, req.user.userId)
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() body: any, @Req() req: any) {
        return this.service.update(id, body.name, req.user.userId)
    }

    @Delete(':id')
    delete(@Param('id') id: string, @Req() req: any) {
        return this.service.delete(id, req.user.userId)
    }
}