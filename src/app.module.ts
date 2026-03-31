import { Module } from '@nestjs/common'
import { AuthModule } from './auth/auth.module'
import { OrganizationsModule } from './organizations/organizations.module'
import { PrismaService } from '../prisma/prisma.service'
import { AppController } from './app.controller'
import { UsersModule } from './users/users.module';

@Module({
  imports: [AuthModule, OrganizationsModule, UsersModule],
  providers: [PrismaService],
  exports: [PrismaService],
  controllers: [AppController],
})
export class AppModule { }
