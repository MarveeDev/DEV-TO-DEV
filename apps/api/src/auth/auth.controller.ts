import {
  Controller,
  Get,
  Req,
  Res,
  Query,
  UnauthorizedException,
  Post,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { randomBytes } from 'crypto';
import { SessionsService } from '../sessions/sessions.service';
import { MailService } from '../mail/mail.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly sessionsService: SessionsService,
    private readonly mailService: MailService,
  ) {}

  private get apiUrl(): string {
    return process.env.API_URL || 'http://localhost:3001';
  }

  private get frontendUrl(): string {
    return process.env.FRONTEND_URL || 'http://localhost:3000';
  }

  @Get('github')
  async githubAuth(@Req() req: Request, @Res() res: Response) {
    // Generate secure single-use state
    const state = randomBytes(16).toString('hex');
    
    // Check if it's a linking intent based on current session
    const currentToken = req.cookies['session_id'];
    let currentUserId = null;
    if (currentToken) {
      currentUserId = await this.sessionsService.validateSession(currentToken);
    }
    
    // Save state in Redis for 10 minutes
    await this.authService.storeOAuthState(state, currentUserId || 'new_login');

    const clientId = process.env.GITHUB_CLIENT_ID;
    const redirectUri = `${this.apiUrl}/api/v1/auth/github/callback`;
    const url = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=read:user user:email&state=${state}`;

    return res.redirect(url);
  }

  @Get('github/callback')
  async githubCallback(
    @Query('code') code: string,
    @Query('state') state: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    if (!code || !state) {
      throw new UnauthorizedException('Missing code or state');
    }

    // Validate and consume state
    const intent = await this.authService.consumeOAuthState(state);
    if (!intent) {
      throw new UnauthorizedException('Invalid or expired OAuth state');
    }

    try {
      const { user, isNewUser } = await this.authService.processGitHubCallback(code, intent);
      if (!user) throw new Error('Authentication failed');

      // Create session
      const token = await this.sessionsService.createSession(user.id);

      // Send sign-in notification (fire-and-forget; only for actual sign-ins, not account linking)
      if (intent === 'new_login') {
        void this.mailService.sendSignInNotification({
          to: user.email,
          provider: 'github',
          isNewUser,
          timestamp: new Date(),
        });
      }
      
      res.cookie('session_id', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 14 * 24 * 60 * 60 * 1000,
      });

      // Redirect to frontend onboarding if new user, otherwise profile
      if (isNewUser) {
        return res.redirect(`${this.frontendUrl}/onboarding`);
      }
      return res.redirect(`${this.frontendUrl}/dashboard`);
    } catch (e) {
      // Safe error redirect
      return res.redirect(`${this.frontendUrl}/login?error=${encodeURIComponent(e.message)}`);
    }
  }

  @Get('google')
  async googleAuth(@Req() req: Request, @Res() res: Response) {
    const state = randomBytes(16).toString('hex');
    const currentToken = req.cookies['session_id'];
    let currentUserId = null;
    if (currentToken) {
      currentUserId = await this.sessionsService.validateSession(currentToken);
    }
    
    await this.authService.storeOAuthState(state, currentUserId || 'new_login');

    const clientId = process.env.GOOGLE_CLIENT_ID;
    const redirectUri = `${this.apiUrl}/api/v1/auth/google/callback`;
    const scope = encodeURIComponent('openid email profile');
    const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&state=${state}&access_type=offline`;

    return res.redirect(url);
  }

  @Get('google/callback')
  async googleCallback(
    @Query('code') code: string,
    @Query('state') state: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    if (!code || !state) {
      throw new UnauthorizedException('Missing code or state');
    }

    const intent = await this.authService.consumeOAuthState(state);
    if (!intent) {
      throw new UnauthorizedException('Invalid or expired OAuth state');
    }

    try {
      const { user, isNewUser } = await this.authService.processGoogleCallback(code, intent);
      if (!user) throw new Error('Authentication failed');

      const token = await this.sessionsService.createSession(user.id);

      // Send sign-in notification (fire-and-forget; only for actual sign-ins, not account linking)
      if (intent === 'new_login') {
        void this.mailService.sendSignInNotification({
          to: user.email,
          provider: 'google',
          isNewUser,
          timestamp: new Date(),
        });
      }
      
      res.cookie('session_id', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 14 * 24 * 60 * 60 * 1000,
      });

      if (isNewUser) {
        return res.redirect(`${this.frontendUrl}/onboarding`);
      }
      return res.redirect(`${this.frontendUrl}/dashboard`);
    } catch (e) {
      return res.redirect(`${this.frontendUrl}/login?error=${encodeURIComponent(e.message)}`);
    }
  }

  @Get('me')
  async getMe(@Req() req: Request) {
    const token = req.cookies['session_id'];
    if (!token) throw new UnauthorizedException('No session token');

    const userId = await this.sessionsService.validateSession(token);
    if (!userId) {
      throw new UnauthorizedException('Invalid or expired session');
    }

    const user = await this.authService.getUser(userId);
    return user;
  }

  @Post('logout')
  async logout(@Req() req: Request, @Res() res: Response) {
    const token = req.cookies['session_id'];
    if (token) {
      await this.sessionsService.revokeSession(token);
    }
    
    res.clearCookie('session_id');
    return res.json({ success: true });
  }
}
