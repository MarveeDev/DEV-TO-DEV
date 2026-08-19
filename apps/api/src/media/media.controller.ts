import { Controller, Post, Delete, Param, UseInterceptors, UploadedFile, Req, UnauthorizedException } from '@nestjs/common';
import type { Request } from 'express';
import { MediaService } from './media.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { SessionsService } from '../sessions/sessions.service';

async function getUserIdOrThrow(req: Request, sessionsService: SessionsService): Promise<string> {
  const token = req.cookies['session_id'];
  if (!token) throw new UnauthorizedException();
  const userId = await sessionsService.validateSession(token);
  if (!userId) throw new UnauthorizedException();
  return userId;
}

@Controller('media')
export class MediaController {
  constructor(
    private readonly mediaService: MediaService,
    private readonly sessionsService: SessionsService
  ) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadMedia(@Req() req: Request, @UploadedFile() file: Express.Multer.File) {
    const userId = await getUserIdOrThrow(req, this.sessionsService);
    return this.mediaService.uploadMedia(userId, file);
  }

  @Delete(':id')
  async deleteMedia(@Req() req: Request, @Param('id') id: string) {
    const userId = await getUserIdOrThrow(req, this.sessionsService);
    return this.mediaService.deleteMedia(userId, id);
  }
}
