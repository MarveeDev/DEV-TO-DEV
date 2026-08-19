import { Controller, Post, Get, Patch, Delete, Param, Req, UnauthorizedException } from '@nestjs/common';
import type { Request } from 'express';
import { ConnectionsService } from './connections.service';
import { SessionsService } from '../sessions/sessions.service';

@Controller('connections')
export class ConnectionsController {
  constructor(
    private readonly connectionsService: ConnectionsService,
    private readonly sessionsService: SessionsService
  ) {}

  private async getUserIdOrThrow(req: Request): Promise<string> {
    const token = req.cookies['session_id'];
    if (!token) throw new UnauthorizedException();
    const userId = await this.sessionsService.validateSession(token);
    if (!userId) throw new UnauthorizedException();
    return userId;
  }

  @Post(':username')
  async sendRequest(@Req() req: Request, @Param('username') username: string) {
    const userId = await this.getUserIdOrThrow(req);
    return this.connectionsService.sendRequest(userId, username);
  }

  @Get()
  async getConnections(@Req() req: Request) {
    const userId = await this.getUserIdOrThrow(req);
    const connections = await this.connectionsService.getConnections(userId);
    // Sanitize output
    return connections.map(conn => {
      return {
        id: conn.id,
        status: conn.status,
        createdAt: conn.createdAt,
        requester: {
          id: conn.requester.id,
          profile: conn.requester.developerProfile
        },
        addressee: {
          id: conn.addressee.id,
          profile: conn.addressee.developerProfile
        }
      };
    });
  }

  @Get('requests')
  async getRequests(@Req() req: Request) {
    const userId = await this.getUserIdOrThrow(req);
    const requests = await this.connectionsService.getRequests(userId);
    return requests.map(conn => {
      return {
        id: conn.id,
        status: conn.status,
        createdAt: conn.createdAt,
        requester: {
          id: conn.requester.id,
          profile: conn.requester.developerProfile
        },
        addressee: {
          id: conn.addressee.id,
          profile: conn.addressee.developerProfile
        }
      };
    });
  }

  @Patch(':id/accept')
  async acceptRequest(@Req() req: Request, @Param('id') id: string) {
    const userId = await this.getUserIdOrThrow(req);
    return this.connectionsService.acceptRequest(userId, id);
  }

  @Patch(':id/reject')
  async rejectRequest(@Req() req: Request, @Param('id') id: string) {
    const userId = await this.getUserIdOrThrow(req);
    return this.connectionsService.rejectRequest(userId, id);
  }

  @Delete(':id')
  async deleteConnection(@Req() req: Request, @Param('id') id: string) {
    const userId = await this.getUserIdOrThrow(req);
    return this.connectionsService.deleteConnection(userId, id);
  }
}
