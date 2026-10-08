import { Controller, Get, Post, Patch, Delete, Param, Body, Query, Req, UnauthorizedException, BadRequestException, ForbiddenException } from '@nestjs/common';
import type { Request } from 'express';
import { ProjectsService } from './projects.service';
import { SessionsService } from '../sessions/sessions.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { RateLimit } from '../common/rate-limit/rate-limit.decorator';

@Controller('projects')
export class ProjectsController {
  constructor(
    private readonly projectsService: ProjectsService,
    private readonly sessionsService: SessionsService,
  ) {}

  private async getUserIdOrThrow(req: Request): Promise<string> {
    const token = req.cookies['session_id'];
    if (!token) throw new UnauthorizedException();
    const userId = await this.sessionsService.validateSession(token);
    if (!userId) throw new UnauthorizedException();
    return userId;
  }

  @Get()
  async getProjects(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('status') status?: string,
  ) {
    return this.projectsService.getProjects({
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 20,
      search,
      status,
    });
  }

  @Get(':slug')
  async getProjectBySlug(@Param('slug') slug: string) {
    return this.projectsService.getProjectBySlug(slug);
  }

  @Post()
  @RateLimit({ limit: 10, windowMs: 60_000, tier: 't3' })
  async createProject(@Req() req: Request, @Body() data: CreateProjectDto) {
    const userId = await this.getUserIdOrThrow(req);

    return this.projectsService.createProject(userId, data);
  }

  @Patch(':id')
  async updateProject(@Req() req: Request, @Param('id') id: string, @Body() data: UpdateProjectDto) {
    const userId = await this.getUserIdOrThrow(req);
    return this.projectsService.updateProject(userId, id, data);
  }

  @Delete(':id')
  async deleteProject(@Req() req: Request, @Param('id') id: string) {
    const userId = await this.getUserIdOrThrow(req);
    return this.projectsService.deleteProject(userId, id);
  }

  @Post(':id/join')
  async joinProject(@Req() req: Request, @Param('id') id: string) {
    const userId = await this.getUserIdOrThrow(req);
    return this.projectsService.joinProject(userId, id);
  }

  @Get(':id/requests')
  async getProjectRequests(@Req() req: Request, @Param('id') id: string) {
    const userId = await this.getUserIdOrThrow(req);
    return this.projectsService.getProjectRequests(userId, id);
  }

  @Patch(':id/requests/:requestId')
  async updateProjectRequest(
    @Req() req: Request, 
    @Param('id') id: string, 
    @Param('requestId') requestId: string, 
    @Body('status') status: string
  ) {
    const userId = await this.getUserIdOrThrow(req);
    if (status !== 'ACCEPTED' && status !== 'REJECTED') {
      throw new BadRequestException('Status must be ACCEPTED or REJECTED');
    }
    return this.projectsService.updateProjectRequest(userId, id, requestId, status as 'ACCEPTED' | 'REJECTED');
  }
}
