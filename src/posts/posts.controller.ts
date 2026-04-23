import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Req,
  UseGuards,
  Query,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { JwtGuard } from '../auth/guards/jwt.guard';

@Controller('posts')
@UseGuards(JwtGuard) // 🔥 secure all endpoints
export class PostsController {
  constructor(private readonly postsService: PostsService) { }

  // ✅ Create a new post (draft)
  @Post()
  createPost(
    @Req() req,
    @Body() body: { title: string; content: string; organizationId: string },
  ) {
    return this.postsService.createPost(req.user.id, body.organizationId, {
      title: body.title,
      content: body.content,
    });
  }

  // ✅ Get all posts of an organization with pagination
  @Get('organization/:orgId')
  getOrganizationPosts(
    @Param('orgId') orgId: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    return this.postsService.getOrganizationPosts(orgId, Number(page), Number(limit));
  }

  // ✅ Get all drafts of the logged-in user
  @Get('drafts')
  getUserDrafts(@Req() req) {
    return this.postsService.getUserDrafts(req.user.id);
  }

  // ✅ Get a specific post by ID
  @Get(':id')
  getPost(@Param('id') postId: string) {
    return this.postsService.getPost(postId);
  }

  // ✅ Update a post (only drafts)
  @Put(':id')
  updatePost(
    @Param('id') postId: string,
    @Req() req,
    @Body() body: { title?: string; content?: string },
  ) {
    return this.postsService.updatePost(postId, req.user.id, body);
  }

  // ✅ Delete a post
  @Delete(':id')
  deletePost(@Param('id') postId: string, @Req() req) {
    return this.postsService.deletePost(postId, req.user.id);
  }

  // ✅ Submit a post for approval (PRO only)
  @Put(':id/submit')
  submitForApproval(@Param('id') postId: string, @Req() req) {
    return this.postsService.submitForApproval(postId, req.user.id);
  }

  // ✅ Approve/Reject a post (owner only)
  @Put(':id/approve')
  approvePost(
    @Param('id') postId: string,
    @Req() req,
    @Body() body: { approve: boolean; reason?: string },
  ) {
    return this.postsService.approvePost(postId, req.user.id, body.approve, body.reason);
  }

  // ✅ Get all posts pending approval (owner only)
  @Get('pending/organization/:orgId')
  getPendingApproval(@Param('orgId') orgId: string) {
    return this.postsService.getPendingApproval(orgId);
  }

  // ✅ Publish a post (owner only)
  @Put(':id/publish')
  publishPost(@Param('id') postId: string, @Req() req) {
    return this.postsService.publishPost(postId, req.user.id);
  }

  // ✅ Get all published posts
  @Get('published/organization/:orgId')
  getPublishedPosts(@Param('orgId') orgId: string) {
    return this.postsService.getPublishedPosts(orgId);
  }

  // ✅ Get all approved posts
  @Get('approved/organization/:orgId')
  getApprovedPosts(@Param('orgId') orgId: string) {
    return this.postsService.getApprovedPosts(orgId);
  }

  // ✅ Get all rejected posts
  @Get('rejected/organization/:orgId')
  getRejectedPosts(@Param('orgId') orgId: string) {
    return this.postsService.getRejectedPosts(orgId);
  }
}