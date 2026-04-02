import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { PostsService } from './posts.service';
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';

@ApiTags('Posts')
@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new post' })
  @ApiBody({
    schema: {
      example: { title: 'My first post', content: 'Hello world!', userId: 1 },
    },
  })
  @ApiResponse({ status: 201, description: 'Post created successfully' })
  create(@Body() body: any) {
    const { title, content, userId } = body;
    return this.postsService.create(title, content, userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all posts' })
  findAll() {
    return this.postsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one post by ID' })
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a post by ID' })
  @ApiBody({
    schema: {
      example: { title: 'Updated title', content: 'Updated content' },
    },
  })
  update(@Param('id') id: string, @Body() body: any) {
    const { title, content } = body;
    return this.postsService.update(id, title, content);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a post by ID' })
  remove(@Param('id') id: string) {
    return this.postsService.remove(id);
  }
}