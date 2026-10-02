import {
  Body,
  Controller,
  Post,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';
import { SessionsService } from '../sessions/sessions.service';
import { PhoneVerificationService } from './phone-verification.service';
import { SendOtpDto } from './dto/send-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';

@Controller('profile/phone')
export class PhoneVerificationController {
  constructor(
    private readonly sessionsService: SessionsService,
    private readonly phoneVerificationService: PhoneVerificationService,
  ) {}

  private async getUserIdOrThrow(req: Request): Promise<string> {
    const token = req.cookies['session_id'];
    if (!token) throw new UnauthorizedException();
    const userId = await this.sessionsService.validateSession(token);
    if (!userId) throw new UnauthorizedException();
    return userId;
  }

  @Post('send-otp')
  async sendOtp(@Req() req: Request, @Body() body: SendOtpDto) {
    const userId = await this.getUserIdOrThrow(req);
    return this.phoneVerificationService.sendOtp(userId, body.phoneNumber);
  }

  @Post('verify-otp')
  async verifyOtp(@Req() req: Request, @Body() body: VerifyOtpDto) {
    const userId = await this.getUserIdOrThrow(req);
    return this.phoneVerificationService.verifyOtp(userId, body.otp);
  }
}
