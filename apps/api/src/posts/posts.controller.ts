import { Controller, Post, Get, Patch, Delete, Param, Query, Body, Req, UnauthorizedException } from '@nestjs/common';
import type { Request } from 'express';
import { PostsService } from './posts.service';
import { SessionsService } from '../sessions/sessions.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly sessionsService: SessionsService,
  ) {}

  private async getUserIdOrThrow(req: Request): Promise<string> {
    const token = req.cookies['session_id'];
    if (!token) throw new UnauthorizedException();
    const userId = await this.sessionsService.validateSession(token);
    if (!userId) throw new UnauthorizedException();
    return userId;
  }

  @Post()
  async createPost(@Req() req: Request, @Body() body: CreatePostDto) {
    const userId = await this.getUserIdOrThrow(req);
    return this.postsService.createPost(userId, body);
  }

  @Get()
  async getPosts(
    @Query('username') username?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.postsService.getPosts({
      username,
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 20,
    });
  }

  @Get(':id')
  async getPostById(@Param('id') id: string) {
    return this.postsService.getPostById(id);
  }

  @Patch(':id')
  async updatePost(@Req() req: Request, @Param('id') id: string, @Body() body: UpdatePostDto) {
    const userId = await this.getUserIdOrThrow(req);
    return this.postsService.updatePost(userId, id, body);
  }

  @Delete(':id')
  async deletePost(@Req() req: Request, @Param('id') id: string) {
    const userId = await this.getUserIdOrThrow(req);
    return this.postsService.deletePost(userId, id);
  }
}
