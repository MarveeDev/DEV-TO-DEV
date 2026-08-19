import { Controller, Get, Post, Body, Req, UnauthorizedException } from '@nestjs/common';
import type { Request } from 'express';
import { SessionsService } from '../sessions/sessions.service';
import { ProfileService } from './profile.service';
import { OnboardDto } from './dto/onboard.dto';

@Controller('profile')
export class ProfileController {
  constructor(
    private readonly sessionsService: SessionsService,
    private readonly profileService: ProfileService,
  ) {}

  @Post('onboard')
  async onboard(@Req() req: Request, @Body() data: OnboardDto) {
    const token = req.cookies['session_id'];
    if (!token) throw new UnauthorizedException();
    
    const userId = await this.sessionsService.validateSession(token);
    if (!userId) throw new UnauthorizedException();

    return this.profileService.createProfile(userId, data);
  }

  @Get('skills')
  async getSkills() {
    return this.profileService.getAllSkills();
  }

  @Get('goals')
  async getGoals() {
    return this.profileService.getAllGoals();
  }
}
