import {
  Body,
  Controller,
  Post,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';
import { CodeService } from './code.service';
import { SessionsService } from '../sessions/sessions.service';
import { RunCodeDto } from './dto/run-code.dto';
import { SkipRateLimit } from '../common/rate-limit/rate-limit.decorator';

@Controller('code')
export class CodeController {
  constructor(
    private readonly codeService: CodeService,
    private readonly sessionsService: SessionsService,
  ) {}

  @Post('run')
  @SkipRateLimit()
  async run(@Body() dto: RunCodeDto, @Req() req: Request) {
    const cookies = req.cookies as Record<string, string | undefined>;
    const token = cookies['session_id'];
    if (!token) {
      throw new UnauthorizedException('Login required to run code.');
    }

    const userId = await this.sessionsService.validateSession(token);
    if (!userId) {
      throw new UnauthorizedException(
        'Your session has expired. Please log in again.',
      );
    }

    return this.codeService.run(
      userId,
      this.clientKey(req),
      dto.language,
      dto.code,
    );
  }

  private clientKey(req: Request): string {
    const fwd = req.headers['x-forwarded-for'];
    if (typeof fwd === 'string' && fwd.length > 0) {
      return fwd.split(',')[0].trim();
    }
    if (Array.isArray(fwd) && fwd.length > 0) {
      return fwd[0];
    }
    return req.ip ?? 'unknown';
  }
}
