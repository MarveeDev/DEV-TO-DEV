import { Controller, Get, Post, Param, Body, Req, Query, UnauthorizedException } from '@nestjs/common';
import type { Request } from 'express';
import { SupportService } from './support.service';
import { SessionsService } from '../sessions/sessions.service';
import { RateLimit } from '../common/rate-limit/rate-limit.decorator';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { CreateMessageDto } from './dto/create-message.dto';

@Controller('support')
export class SupportController {
  constructor(
    private readonly supportService: SupportService,
    private readonly sessionsService: SessionsService,
  ) {}

  private async getUserIdOrThrow(req: Request): Promise<string> {
    const token = req.cookies['session_id'];
    if (!token) throw new UnauthorizedException();
    const userId = await this.sessionsService.validateSession(token);
    if (!userId) throw new UnauthorizedException();
    return userId;
  }

  @Post('tickets')
  @RateLimit({ limit: 10, windowMs: 3_600_000, tier: 't3' })
  async createTicket(@Req() req: Request, @Body() body: CreateTicketDto) {
    const userId = await this.getUserIdOrThrow(req);
    return this.supportService.createTicket(userId, body);
  }

  @Get('tickets')
  async listTickets(
    @Req() req: Request,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const userId = await this.getUserIdOrThrow(req);
    return this.supportService.listDeveloperTickets(userId, page, limit);
  }

  @Get('tickets/:id')
  async getTicket(@Req() req: Request, @Param('id') id: string) {
    const userId = await this.getUserIdOrThrow(req);
    return this.supportService.getDeveloperTicket(userId, id);
  }

  @Post('tickets/:id/messages')
  @RateLimit({ limit: 30, windowMs: 60_000, tier: 't3' })
  async addMessage(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() body: CreateMessageDto,
  ) {
    const userId = await this.getUserIdOrThrow(req);
    return this.supportService.addDeveloperMessage(userId, id, body.body);
  }
}
