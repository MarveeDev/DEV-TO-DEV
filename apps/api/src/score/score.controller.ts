import { Controller, Get, Param, Req, UnauthorizedException } from '@nestjs/common';
import type { Request } from 'express';
import { ScoreService } from './score.service';
import { SessionsService } from '../sessions/sessions.service';

@Controller('score')
export class ScoreController {
  constructor(
    private readonly scoreService: ScoreService,
    private readonly sessionsService: SessionsService,
  ) {}

  private async getUserIdOrThrow(req: Request): Promise<string> {
    const token = req.cookies['session_id'];
    if (!token) throw new UnauthorizedException();
    const userId = await this.sessionsService.validateSession(token);
    if (!userId) throw new UnauthorizedException();
    return userId;
  }

  @Get('me')
  async getMyScore(@Req() req: Request) {
    const userId = await this.getUserIdOrThrow(req);
    return this.scoreService.getMyScore(userId);
  }

  @Get('developers/:username')
  async getPublicScore(@Param('username') username: string) {
    return this.scoreService.getPublicScore(username);
  }
}
