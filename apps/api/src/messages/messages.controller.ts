import { Controller, Get, Post, Param, Body, Req, UnauthorizedException } from '@nestjs/common';
import type { Request } from 'express';
import { MessagesService } from './messages.service';
import { SessionsService } from '../sessions/sessions.service';

@Controller('messages')
export class MessagesController {
  constructor(
    private readonly messagesService: MessagesService,
    private readonly sessionsService: SessionsService,
  ) {}

  private async getUserIdOrThrow(req: Request): Promise<string> {
    const token = req.cookies['session_id'];
    if (!token) throw new UnauthorizedException();
    const userId = await this.sessionsService.validateSession(token);
    if (!userId) throw new UnauthorizedException();
    return userId;
  }

  // Inbox: list of the current user's conversations.
  @Get('conversations')
  async getConversations(@Req() req: Request) {
    const userId = await this.getUserIdOrThrow(req);
    return this.messagesService.getConversations(userId);
  }

  // Open (or create) a conversation with a developer by username, returning the thread.
  @Get('with/:username')
  async getOrCreateWith(@Req() req: Request, @Param('username') username: string) {
    const userId = await this.getUserIdOrThrow(req);
    const conversation = await this.messagesService.getOrCreateConversationWithUsername(userId, username);
    return this.messagesService.getConversationThread(userId, conversation.id);
  }

  // Poll an existing conversation thread by id.
  @Get(':conversationId')
  async getThread(@Req() req: Request, @Param('conversationId') conversationId: string) {
    const userId = await this.getUserIdOrThrow(req);
    return this.messagesService.getConversationThread(userId, conversationId);
  }

  @Post(':conversationId')
  async sendMessage(
    @Req() req: Request,
    @Param('conversationId') conversationId: string,
    @Body('body') body: string,
  ) {
    const userId = await this.getUserIdOrThrow(req);
    return this.messagesService.sendMessage(userId, conversationId, body);
  }
}
