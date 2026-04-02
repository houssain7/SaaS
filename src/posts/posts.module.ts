import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [PostsController],
  providers: [PostsService, PrismaService],
  exports: [PostsService], // optional, only if used outside
})
export class PostsModule {}