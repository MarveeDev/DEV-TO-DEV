import {
  Controller,
  Get,
  Logger,
  Req,
  Res,
  Query,
  Param,
  Body,
  HttpCode,
  HttpStatus,
  UnauthorizedException,
  ForbiddenException,
  Post,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { randomBytes } from 'crypto';
import { SessionsService } from '../sessions/sessions.service';
import { MailService } from '../mail/mail.service';
import { RateLimit } from '../common/rate-limit/rate-limit.decorator';
import { LoginDto } from './dto/login.dto';
import { ActivateDto } from './dto/activate.dto';

const OAUTH_RATE_LIMIT = { limit: 30, windowMs: 60_000, tier: 't4', identity: 'ip', failClosed: true } as const;

// Generic, user-safe message returned to the browser on OAuth callback failure.
// It intentionally carries no provider, infrastructure, or exception detail.
const OAUTH_LOGIN_ERROR = 'Authentication failed. Please try again.';

// Secret-bearing keys that must never appear in server logs. Any value that
// follows one of these keys (separated by `=` or `:`) is replaced before the
// error is logged.
const SENSITIVE_KEY_PATTERN =
  /(client_secret|access_token|refresh_token|id_token|authorization|bearer|session_id|session|api_key|apikey|token|secret|code)\s*[:=]\s*[^\s,;"']+/gi;

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

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

  private setSessionCookie(res: Response, token: string): void {
    res.cookie('session_id', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 14 * 24 * 60 * 60 * 1000,
    });
  }

  /**
   * Decide where to send a user immediately after a successful OAuth sign-in.
   * Uses the authenticated user's server-backed role from the database (never a
   * client-supplied value). Admin Console users land in /admin; brand-new users
   * go through onboarding; everyone else goes to their normal dashboard.
   */
  private postLoginDestination(user: { role?: string } | null, isNewUser: boolean): string {
    if (user && user.role && user.role !== 'USER') {
      return `${this.frontendUrl}/admin`;
    }
    if (isNewUser) {
      return `${this.frontendUrl}/onboarding`;
    }
    return `${this.frontendUrl}/dashboard`;
  }

  /**
   * Records a server-side-only diagnostic for an OAuth callback failure.
   * Only the error name and a scrubbed message are logged; values following
   * secret-bearing keys (tokens, secrets, codes, session ids) are redacted and
   * the message is truncated. The browser never sees this content.
   */
  private logOAuthFailure(provider: 'github' | 'google', error: unknown): void {
    const name = error instanceof Error ? error.name : 'UnknownError';
    const rawMessage = error instanceof Error ? error.message : String(error);
    const sanitizedMessage = rawMessage
      .replace(SENSITIVE_KEY_PATTERN, '$1=[REDACTED]')
      .slice(0, 500);
    this.logger.error(
      `OAuth (${provider}) callback failed: ${name}: ${sanitizedMessage}`,
    );
  }

  @Get('github')
  @RateLimit(OAUTH_RATE_LIMIT)
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
  @RateLimit(OAUTH_RATE_LIMIT)
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

      await this.authService.applyPendingStaffInvite(user.id, user.email).catch((e) => {
        this.logger.error(`Staff invite application failed: ${e instanceof Error ? e.message : String(e)}`);
      });

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

      // Redirect to the correct destination based on role / new-user status
      return res.redirect(this.postLoginDestination(user, isNewUser));
    } catch (e) {
      this.logOAuthFailure('github', e);
      return res.redirect(`${this.frontendUrl}/login?error=${encodeURIComponent(OAUTH_LOGIN_ERROR)}`);
    }
  }

  @Get('google')
  @RateLimit(OAUTH_RATE_LIMIT)
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
  @RateLimit(OAUTH_RATE_LIMIT)
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

      await this.authService.applyPendingStaffInvite(user.id, user.email).catch((e) => {
        this.logger.error(`Staff invite application failed: ${e instanceof Error ? e.message : String(e)}`);
      });

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

      // Redirect to the correct destination based on role / new-user status
      return res.redirect(this.postLoginDestination(user, isNewUser));
    } catch (e) {
      this.logOAuthFailure('google', e);
      return res.redirect(`${this.frontendUrl}/login?error=${encodeURIComponent(OAUTH_LOGIN_ERROR)}`);
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

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @RateLimit({ limit: 10, windowMs: 60_000, tier: 't4', identity: 'ip', failClosed: true })
  async login(@Body() body: LoginDto, @Res() res: Response) {
    const user = await this.authService.loginWithPassword(body.email, body.password);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }
    if (user.status !== 'ACTIVE') {
      throw new ForbiddenException('This account is restricted');
    }

    const token = await this.sessionsService.createSession(user.id);
    this.setSessionCookie(res, token);
    return res.json({ user: await this.authService.getUser(user.id) });
  }

  @Get('activate/:token')
  @RateLimit({ limit: 30, windowMs: 60_000, tier: 't3', identity: 'ip' })
  getActivationInfo(@Param('token') token: string) {
    return this.authService.getInvitationInfo(token);
  }

  @Post('activate')
  @HttpCode(HttpStatus.OK)
  @RateLimit({ limit: 10, windowMs: 60_000, tier: 't4', identity: 'ip', failClosed: true })
  async activate(@Body() body: ActivateDto, @Res() res: Response) {
    const { user } = await this.authService.activateInvite(body.token, body.password);

    const token = await this.sessionsService.createSession(user.id);
    this.setSessionCookie(res, token);
    return res.json({ user: await this.authService.getUser(user.id) });
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
