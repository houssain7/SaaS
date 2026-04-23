import {
    Controller,
    Post,
    Delete,
    Get,
    Param,
    Body,
    Req,
    Patch,
} from '@nestjs/common';
import { MembershipsService } from './membership.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { UseGuards } from '@nestjs/common';

@Controller('organizations/:orgId/members')
@UseGuards(JwtGuard)
export class MembershipsController {
    constructor(private service: MembershipsService) { }

    // ADD MEMBER
    @Post()
    addMember(
        @Param('orgId') orgId: string,
        @Body() body: { userId: string; role: 'MEMBER' | 'OWNER' },
        @Req() req,
    ) {
        return this.service.addMember(
            orgId,
            req.user.id,
            body.userId,
            body.role,
        );
    }

    // GET MEMBERS
    @Get()
    getMembers(@Param('orgId') orgId: string) {
        return this.service.getMembers(orgId);
    }

    // REMOVE MEMBER
    @Delete(':userId')
    removeMember(
        @Param('orgId') orgId: string,
        @Param('userId') userId: string,
        @Req() req,
    ) {
        return this.service.removeMember(orgId, req.user.id, userId);
    }

    // UPDATE ROLE
    @Patch(':userId')
    updateRole(
        @Param('orgId') orgId: string,
        @Param('userId') userId: string,
        @Body() body: { role: 'OWNER' | 'MEMBER' },
        @Req() req,
    ) {
        return this.service.updateRole(
            orgId,
            req.user.id,
            userId,
            body.role,
        );
    }
}