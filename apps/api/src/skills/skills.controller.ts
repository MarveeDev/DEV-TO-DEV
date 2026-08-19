import { Controller, Get, Param } from '@nestjs/common';
import { SkillsService } from './skills.service';

@Controller('skills')
export class SkillsController {
  constructor(private readonly skillsService: SkillsService) {}

  @Get(':slug')
  async getSkillBySlug(@Param('slug') slug: string) {
    return this.skillsService.getSkillBySlug(slug);
  }
}
