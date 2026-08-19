import { Controller, Get, Post, Delete, Param, Query, Req, Res, HttpStatus } from '@nestjs/common';
import type { Request, Response } from 'express';
import { RoadmapsService } from './roadmaps.service';
import { SessionsService } from '../sessions/sessions.service';

@Controller('roadmaps')
export class RoadmapsController {
  constructor(
    private readonly roadmapsService: RoadmapsService,
    private readonly sessionsService: SessionsService,
  ) {}

  @Get()
  async getRoadmaps(
    @Query('category') category: string,
    @Query('difficulty') difficulty: string,
    @Query('search') search: string,
  ) {
    return this.roadmapsService.getRoadmaps({ category, difficulty, search });
  }

  @Get('me')
  async getMyProgress(@Req() req: Request, @Res() res: Response) {
    const token = req.cookies['session_id'];
    if (!token) {
      return res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Unauthorized' });
    }

    const userId = await this.sessionsService.validateSession(token);
    if (!userId) {
      return res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Invalid session' });
    }

    try {
      const progress = await this.roadmapsService.getMyProgress(userId);
      return res.status(HttpStatus.OK).json(progress);
    } catch (e: any) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: e.message });
    }
  }

  @Get('nodes/:id')
  async getNodeDetails(@Param('id') id: string, @Res() res: Response) {
    try {
      const node = await this.roadmapsService.getNodeDetails(id);
      return res.status(HttpStatus.OK).json(node);
    } catch (e: any) {
      return res.status(HttpStatus.NOT_FOUND).json({ message: e.message });
    }
  }

  @Get(':slug')
  async getRoadmapBySlug(@Param('slug') slug: string, @Res() res: Response) {
    try {
      const roadmap = await this.roadmapsService.getRoadmapBySlug(slug);
      return res.status(HttpStatus.OK).json(roadmap);
    } catch (e: any) {
      return res.status(HttpStatus.NOT_FOUND).json({ message: e.message });
    }
  }



  @Post(':slug/start')
  async startRoadmap(@Param('slug') slug: string, @Req() req: Request, @Res() res: Response) {
    const token = req.cookies['session_id'];
    if (!token) return res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Unauthorized' });

    const userId = await this.sessionsService.validateSession(token);
    if (!userId) return res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Invalid session' });

    try {
      const result = await this.roadmapsService.startRoadmap(userId, slug);
      return res.status(HttpStatus.OK).json(result);
    } catch (e: any) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: e.message });
    }
  }

  @Post('nodes/:id/complete')
  async markComplete(@Param('id') id: string, @Req() req: Request, @Res() res: Response) {
    const token = req.cookies['session_id'];
    if (!token) return res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Unauthorized' });

    const userId = await this.sessionsService.validateSession(token);
    if (!userId) return res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Invalid session' });

    try {
      const result = await this.roadmapsService.markNodeComplete(userId, id);
      return res.status(HttpStatus.OK).json(result);
    } catch (e: any) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: e.message });
    }
  }

  @Delete('nodes/:id/complete')
  async markIncomplete(@Param('id') id: string, @Req() req: Request, @Res() res: Response) {
    const token = req.cookies['session_id'];
    if (!token) return res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Unauthorized' });

    const userId = await this.sessionsService.validateSession(token);
    if (!userId) return res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Invalid session' });

    try {
      const result = await this.roadmapsService.markNodeIncomplete(userId, id);
      return res.status(HttpStatus.OK).json(result);
    } catch (e: any) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: e.message });
    }
  }
}
