import { Controller, Get, Post, Patch, Body, Req, UnauthorizedException } from '@nestjs/common';
import type { Request } from 'express';
import { SessionsService } from '../sessions/sessions.service';
import { ProfileService } from './profile.service';
import { OnboardDto } from './dto/onboard.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

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

  @Get('me')
  async getProfile(@Req() req: Request) {
    const token = req.cookies['session_id'];
    if (!token) throw new UnauthorizedException();
    
    const userId = await this.sessionsService.validateSession(token);
    if (!userId) throw new UnauthorizedException();

    return this.profileService.getProfile(userId);
  }

  @Patch('me')
  async updateProfile(@Req() req: Request, @Body() data: UpdateProfileDto) {
    const token = req.cookies['session_id'];
    if (!token) throw new UnauthorizedException();
    
    const userId = await this.sessionsService.validateSession(token);
    if (!userId) throw new UnauthorizedException();

    return this.profileService.updateProfile(userId, data);
  }
}
