import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';
import { SessionsService } from '../../sessions/sessions.service';
import { PushService } from './push.service';
import { SubscribePushDto, UnsubscribePushDto } from './push.dto';

@Controller('notifications/push')
export class PushController {
  constructor(
    private readonly pushService: PushService,
    private readonly sessionsService: SessionsService,
  ) {}

  private async getUserIdOrThrow(req: Request): Promise<string> {
    const token = req.cookies['session_id'];
    if (!token) throw new UnauthorizedException();
    const userId = await this.sessionsService.validateSession(token);
    if (!userId) throw new UnauthorizedException();
    return userId;
  }

  @Get('vapid-public-key')
  async getVapidPublicKey() {
    return { publicKey: this.pushService.getVapidPublicKey() };
  }

  @Post('subscribe')
  async subscribe(@Req() req: Request, @Body() body: SubscribePushDto) {
    const userId = await this.getUserIdOrThrow(req);
    await this.pushService.subscribe(userId, {
      endpoint: body.endpoint,
      p256dh: body.keys.p256dh,
      auth: body.keys.auth,
    });
    return { success: true };
  }

  @Delete('subscribe')
  async unsubscribe(@Req() req: Request, @Body() body: UnsubscribePushDto) {
    const userId = await this.getUserIdOrThrow(req);
    const removed = await this.pushService.unsubscribe(userId, body.endpoint);
    return { success: removed };
  }
}
