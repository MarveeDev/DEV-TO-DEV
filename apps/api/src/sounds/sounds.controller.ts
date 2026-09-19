import { Controller, Get, Param, Query } from '@nestjs/common';
import { SoundsService } from './sounds.service';

@Controller('sounds')
export class SoundsController {
  constructor(private readonly soundsService: SoundsService) {}

  @Get()
  getSounds(
    @Query('search') search?: string,
    @Query('category') category?: string,
    @Query('sort') sort?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.soundsService.getSounds({
      search,
      category,
      sort,
      page: page ? parseInt(page, 10) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
    });
  }

  @Get(':id')
  getSound(@Param('id') id: string) {
    return this.soundsService.getSoundById(id);
  }
}
