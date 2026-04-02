import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  async create(title: string, content: string, userId: string) {
    return this.prisma.post.create({
      data: {
        title,
        content,
        userId,
      },
    });
  }

  async findAll() {
    return this.prisma.post.findMany({
      include: { user: true }, // optional: get user info
    });
  }

  async findOne(id: string) {
    return this.prisma.post.findUnique({
      where: { id },
      include: { user: true },
    });
  }

  async update(id: string, title?: string, content?: string) {
    return this.prisma.post.update({
      where: { id },
      data: { title, content },
    });
  }

  async remove(id: string) {
    return this.prisma.post.delete({
      where: { id },
    });
  }
}