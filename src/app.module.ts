import { Module } from '@nestjs/common'
import { AuthModule } from './auth/auth.module'
import { OrganizationsModule } from './organizations/organizations.module'
import { PrismaService } from '../prisma/prisma.service'
import { AppController } from './app.controller'
import { UsersModule } from './users/users.module';
import { PostsController } from './posts/posts.controller';
import { PostsModule } from './posts/posts.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';

@Module({
  imports: [AuthModule, OrganizationsModule, UsersModule, PostsModule, SubscriptionsModule],
  providers: [PrismaService],
  exports: [PrismaService],
  controllers: [AppController, PostsController],
})
export class AppModule { }
