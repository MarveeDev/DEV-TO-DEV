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

  private async getViewerIdOrNull(req: Request): Promise<string | undefined> {
    const token = req.cookies['session_id'];
    if (!token) return undefined;
    const userId = await this.sessionsService.validateSession(token);
    return userId || undefined;
  }

  @Post()
  async createPost(@Req() req: Request, @Body() body: CreatePostDto) {
    const userId = await this.getUserIdOrThrow(req);
    return this.postsService.createPost(userId, body);
  }

  @Get()
  async getPosts(
    @Req() req: Request,
    @Query('username') username?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const viewerId = await this.getViewerIdOrNull(req);
    return this.postsService.getPosts({
      username,
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 20,
    }, viewerId);
  }

  @Get(':id')
  async getPostById(@Req() req: Request, @Param('id') id: string) {
    const viewerId = await this.getViewerIdOrNull(req);
    return this.postsService.getPostById(id, viewerId);
  }

  @Get(':id/comments')
  async getComments(@Param('id') id: string) {
    return this.postsService.getComments(id);
  }

  @Post(':id/comments')
  async createComment(@Req() req: Request, @Param('id') id: string, @Body('content') content: string) {
    const userId = await this.getUserIdOrThrow(req);
    return this.postsService.createComment(userId, id, content);
  }

  @Post(':id/like')
  async likePost(@Req() req: Request, @Param('id') id: string) {
    const userId = await this.getUserIdOrThrow(req);
    return this.postsService.likePost(userId, id);
  }

  @Delete(':id/like')
  async unlikePost(@Req() req: Request, @Param('id') id: string) {
    const userId = await this.getUserIdOrThrow(req);
    return this.postsService.unlikePost(userId, id);
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
