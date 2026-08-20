import { Controller, Get, Query, BadRequestException } from '@nestjs/common';
import { VideosService } from './videos.service';

@Controller('videos')
export class VideosController {
  constructor(private readonly videosService: VideosService) {}

  @Get('search')
  async searchVideos(@Query('q') query: string) {
    if (!query) {
      throw new BadRequestException('Search query (q) is required');
    }
    return this.videosService.searchVideos(query);
  }
}
