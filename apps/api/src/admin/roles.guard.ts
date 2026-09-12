import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Request } from 'express';
import { PrismaService } from '../prisma/prisma.service';
import { SessionsService } from '../sessions/sessions.service';
import { ROLES_KEY } from './roles.decorator';
import { UserRole } from '@prisma/client';

export interface AuthenticatedAdminRequest extends Request {
  userId?: string;
  role?: UserRole;
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly sessionsService: SessionsService,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const required = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!required || required.length === 0) {
      return true;
    }

    const req = context.switchToHttp().getRequest<AuthenticatedAdminRequest>();
    const token = req.cookies['session_id'];
    if (!token) throw new UnauthorizedException('No session token');

    const userId = await this.sessionsService.validateSession(token);
    if (!userId) throw new UnauthorizedException('Invalid or expired session');

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { role: true, status: true },
    });

    if (!user) throw new UnauthorizedException('User not found');
    if (user.status !== 'ACTIVE') {
      throw new ForbiddenException('Account is restricted');
    }

    if (!required.includes(user.role)) {
      throw new ForbiddenException('Insufficient permissions');
    }

    req.userId = userId;
    req.role = user.role;
    return true;
  }
}
