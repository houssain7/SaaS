import { Body, Controller, Post, Get, Param, Put, Delete } from '@nestjs/common'
import { OrganizationsService } from './organizations.service'

@Controller('organizations')
export class OrganizationsController {
    constructor(private service: OrganizationsService) { }

    @Post()
    create(@Body() body: any) {
        return this.service.create(body.name)
    }

    @Get()
    findAll() {
        return this.service.findAll()
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.service.findOne(id)
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() body: any) {
        return this.service.update(id, body.name)
    }

    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.service.delete(id)
    }
}