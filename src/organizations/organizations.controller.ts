import { Body, Controller, Post } from '@nestjs/common'
import { OrganizationsService } from './organizations.service'

@Controller('organizations')
export class OrganizationsController {
    constructor(private service: OrganizationsService) { }

    @Post()
    create(@Body() body: any) {
        return this.service.create(body.name, body.userId)
    }
}
//