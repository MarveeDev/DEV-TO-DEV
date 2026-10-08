import { Controller, Get, Query, BadRequestException } from '@nestjs/common';
import { VideosService } from './videos.service';
import { RateLimit } from '../common/rate-limit/rate-limit.decorator';

@Controller('videos')
export class VideosController {
  constructor(private readonly videosService: VideosService) {}

  @Get('search')
  @RateLimit({ limit: 15, windowMs: 60_000, tier: 't2', identity: 'ip' })
  async searchVideos(@Query('q') query: string) {
    if (!query) {
      throw new BadRequestException('Search query (q) is required');
    }
    return this.videosService.searchVideos(query);
  }
}
