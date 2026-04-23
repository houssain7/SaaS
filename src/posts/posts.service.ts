import {
  Injectable,
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) { }

  // 📌 Créer un post (brouillon)
  async createPost(
    userId: string,
    organizationId: string,
    data: { title: string; content: string },
  ) {
    const membership = await this.prisma.membership.findFirst({
      where: { userId, organizationId },
    });

    if (!membership) {
      throw new ForbiddenException(
        'Vous ne pouvez pas créer de posts dans cette organisation',
      );
    }

    return this.prisma.post.create({
      data: {
        title: data.title,
        content: data.content,
        userId,
        organizationId,
        status: 'DRAFT',
      },
      include: {
        user: { select: { id: true, email: true } },
        organization: { select: { id: true, name: true } },
      },
    });
  }

  // 📌 Récupérer les posts d'une organisation
  async getOrganizationPosts(organizationId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [posts, total] = await Promise.all([
      this.prisma.post.findMany({
        where: { organizationId },
        include: {
          user: { select: { id: true, email: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.post.count({ where: { organizationId } }),
    ]);

    return {
      data: posts,
      pagination: { total, page, limit, pages: Math.ceil(total / limit) },
    };
  }

  // 📌 Brouillons utilisateur
  async getUserDrafts(userId: string) {
    return this.prisma.post.findMany({
      where: { userId, status: 'DRAFT' },
      include: {
        organization: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // 📌 Get one post
  async getPost(postId: string) {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
      include: {
        user: { select: { id: true, email: true } },
        organization: {
          select: {
            id: true,
            name: true,
            subscription: {
              include: { plan: true },
            },
          },
        },
      },
    });

    if (!post) throw new NotFoundException('Post non trouvé');

    return post;
  }

  // 📌 Update post
  async updatePost(
    postId: string,
    userId: string,
    data: { title?: string; content?: string },
  ) {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) throw new NotFoundException('Post non trouvé');

    if (post.userId !== userId) {
      throw new ForbiddenException('Vous ne pouvez modifier que vos propres posts');
    }

    if (post.status !== 'DRAFT') {
      throw new BadRequestException('Seuls les brouillons peuvent être modifiés');
    }

    return this.prisma.post.update({
      where: { id: postId },
      data,
    });
  }

  // 📌 Delete post
  async deletePost(postId: string, userId: string) {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) throw new NotFoundException('Post non trouvé');

    if (post.userId !== userId) {
      throw new ForbiddenException('Non autorisé');
    }

    await this.prisma.post.delete({
      where: { id: postId },
    });

    return { message: 'Post supprimé' };
  }

  // 📌 Submit for approval (PRO)
  async submitForApproval(postId: string, userId: string) {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
      include: {
        organization: {
          include: {
            subscription: {
              include: { plan: true },
            },
          },
        },
      },
    });

    if (!post) throw new NotFoundException('Post non trouvé');

    if (post.userId !== userId) {
      throw new ForbiddenException('Non autorisé');
    }

    if (post.organization.subscription?.plan?.name !== 'PRO') {
      throw new BadRequestException('Seul le plan PRO peut soumettre');
    }

    return this.prisma.post.update({
      where: { id: postId },
      data: { status: 'PENDING_APPROVAL' },
    });
  }

  // 📌 Approve / Reject
  async approvePost(
    postId: string,
    ownerId: string,
    approve: boolean,
    reason?: string,
  ) {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
      include: { organization: true },
    });

    if (!post) throw new NotFoundException('Post non trouvé');

    if (post.organization.ownerId !== ownerId) {
      throw new ForbiddenException('Seul le propriétaire peut approuver');
    }

    if (post.status !== 'PENDING_APPROVAL') {
      throw new BadRequestException('Post non en attente');
    }
  }

  // 📌 Publish (simple internal)
  async publishPost(postId: string, ownerId: string) {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
      include: { organization: true },
    });

    if (!post) throw new NotFoundException('Post non trouvé');

    if (post.organization.ownerId !== ownerId) {
      throw new ForbiddenException('Non autorisé');
    }

    return this.prisma.post.update({
      where: { id: postId },
      data: {
        status: 'PUBLISHED',
        publishedAt: new Date(),
      },
    });
  }

  // 📌 Filters
  async getPublishedPosts(orgId: string) {
    return this.prisma.post.findMany({
      where: { organizationId: orgId, status: 'PUBLISHED' },
    });
  }

  async getPendingApproval(organizationId: string) {
    return this.prisma.post.findMany({
      where: { organizationId, status: 'PENDING_APPROVAL' },
      include: { user: { select: { id: true, email: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getApprovedPosts(orgId: string) {
    return this.prisma.post.findMany({
      where: { organizationId: orgId, status: 'APPROVED' },
    });
  }

  async getRejectedPosts(orgId: string) {
    return this.prisma.post.findMany({
      where: { organizationId: orgId, status: 'REJECTED' },
    });
  }
}