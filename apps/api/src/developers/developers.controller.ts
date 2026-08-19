import { Controller, Get, Param, Query, Req, UnauthorizedException } from '@nestjs/common';
import type { Request } from 'express';
import { DevelopersService } from './developers.service';
import { SessionsService } from '../sessions/sessions.service';
import { MatchingService } from './matching.service';

@Controller('developers')
export class DevelopersController {
  constructor(
    private readonly developersService: DevelopersService,
    private readonly sessionsService: SessionsService,
    private readonly matchingService: MatchingService,
  ) {}

  private async getUserIdOrThrow(req: Request): Promise<string> {
    const token = req.cookies['session_id'];
    if (!token) throw new UnauthorizedException();
    const userId = await this.sessionsService.validateSession(token);
    if (!userId) throw new UnauthorizedException();
    return userId;
  }

  @Get()
  async searchDevelopers(
    @Req() req: Request,
    @Query('username') username?: string,
    @Query('name') name?: string,
    @Query('skills') skills?: string,
    @Query('goals') goals?: string,
    @Query('experienceLevel') experienceLevel?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const currentUserId = await this.getUserIdOrThrow(req);
    return this.developersService.searchDevelopers(currentUserId, {
      username,
      name,
      skills,
      goals,
      experienceLevel,
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 20,
    });
  }

  @Get('matches')
  async getMatches(
    @Req() req: Request,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const currentUserId = await this.getUserIdOrThrow(req);
    return this.matchingService.getMatches(currentUserId, {
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 20,
    });
  }

  @Get(':username')
  async getDeveloperByUsername(@Req() req: Request, @Param('username') username: string) {
    const currentUserId = await this.getUserIdOrThrow(req);
    return this.developersService.getDeveloperByUsername(currentUserId, username);
  }
}
