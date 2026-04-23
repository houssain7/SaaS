import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PlansModule } from './plan/plan.module';
import { OrganizationsModule } from './organizations/organizations.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { PrismaService } from '../prisma/prisma.service';
import { JwtGuard } from './auth/guards/jwt.guard';
import { MembershipsModule } from './membership/membership.module';
import { PostsModule } from './posts/posts.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    PlansModule,
    OrganizationsModule,
    SubscriptionsModule,
    MembershipsModule,
    PostsModule,
  ],
  providers: [PrismaService, JwtGuard],
  exports: [PrismaService],
})
export class AppModule { }