import { Controller, Get, Patch, Param, Req, UnauthorizedException } from '@nestjs/common';
import type { Request } from 'express';
import { NotificationsService } from './notifications.service';
import { SessionsService } from '../sessions/sessions.service';

@Controller('notifications')
export class NotificationsController {
  constructor(
    private readonly notificationsService: NotificationsService,
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
  async getNotifications(@Req() req: Request) {
    const userId = await this.getUserIdOrThrow(req);
    return this.notificationsService.getNotifications(userId);
  }

  @Patch(':id/read')
  async markAsRead(@Req() req: Request, @Param('id') id: string) {
    const userId = await this.getUserIdOrThrow(req);
    return this.notificationsService.markAsRead(userId, id);
  }
}
