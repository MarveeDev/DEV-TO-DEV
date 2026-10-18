import { Logger, UnauthorizedException } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SessionsService } from '../sessions/sessions.service';
import { MailService } from '../mail/mail.service';

const GENERIC_ERROR = encodeURIComponent(
  'Authentication failed. Please try again.',
);

describe('AuthController OAuth error handling', () => {
  const authService = {
    consumeOAuthState: jest.fn(),
    processGitHubCallback: jest.fn(),
    processGoogleCallback: jest.fn(),
  };
  const sessionsService = { createSession: jest.fn(), validateSession: jest.fn() };
  const mailService = { sendSignInNotification: jest.fn() };

  let controller: AuthController;
  let errorSpy: jest.SpyInstance;

  const res = () => ({ redirect: jest.fn(), cookie: jest.fn() }) as never;
  const req = () => ({ cookies: {} }) as never;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.FRONTEND_URL = 'http://frontend.test';
    controller = new AuthController(
      authService as unknown as AuthService,
      sessionsService as unknown as SessionsService,
      mailService as unknown as MailService,
    );
    errorSpy = jest
      .spyOn(Logger.prototype, 'error')
      .mockImplementation(() => undefined);
  });

  afterEach(() => {
    errorSpy.mockRestore();
  });

  function loggedMessages(): string {
    return errorSpy.mock.calls.map((call) => String(call[0])).join(' ');
  }

  it('redirects with a generic message and never leaks internal details (github)', async () => {
    authService.consumeOAuthState.mockResolvedValue('new_login');
    authService.processGitHubCallback.mockRejectedValue(
      new Error(
        "Can't reach database server at `postgres:5432` field `email` client_secret=SECRET123 code=abc123",
      ),
    );
    const response = res();

    await controller.githubCallback('thecode', 'thestate', req(), response);

    const redirectUrl = response.redirect.mock.calls[0][0];
    expect(redirectUrl).toContain(`login?error=${GENERIC_ERROR}`);
    expect(redirectUrl).not.toContain('postgres:5432');
    expect(redirectUrl).not.toContain('email');
    expect(redirectUrl).not.toContain('SECRET123');
    expect(redirectUrl).not.toContain('abc123');
    expect(redirectUrl).not.toContain('client_secret');

    expect(errorSpy).toHaveBeenCalled();
    expect(loggedMessages()).not.toContain('SECRET123');
    expect(loggedMessages()).not.toContain('abc123');
  });

  it('redirects with a generic message and never leaks internal details (google)', async () => {
    authService.consumeOAuthState.mockResolvedValue('new_login');
    authService.processGoogleCallback.mockRejectedValue(
      new Error(
        "Can't reach database server at `postgres:5432` access_token=TOPSECRET refresh_token=REFRESH1",
      ),
    );
    const response = res();

    await controller.googleCallback('thecode', 'thestate', req(), response);

    const redirectUrl = response.redirect.mock.calls[0][0];
    expect(redirectUrl).toContain(`login?error=${GENERIC_ERROR}`);
    expect(redirectUrl).not.toContain('postgres:5432');
    expect(redirectUrl).not.toContain('TOPSECRET');
    expect(redirectUrl).not.toContain('REFRESH1');
    expect(redirectUrl).not.toContain('access_token');

    expect(errorSpy).toHaveBeenCalled();
    expect(loggedMessages()).not.toContain('TOPSECRET');
    expect(loggedMessages()).not.toContain('REFRESH1');
  });

  it('preserves successful GitHub callback behavior (cookie + redirect)', async () => {
    authService.consumeOAuthState.mockResolvedValue('new_login');
    authService.processGitHubCallback.mockResolvedValue({
      user: { id: 'u1', role: 'USER', email: 'a@example.com' },
      isNewUser: true,
    });
    sessionsService.createSession.mockResolvedValue('sess-token');
    const response = res();

    await controller.githubCallback('code', 'state', req(), response);

    expect(response.cookie).toHaveBeenCalledWith(
      'session_id',
      'sess-token',
      expect.any(Object),
    );
    expect(response.redirect).toHaveBeenCalledWith(
      'http://frontend.test/onboarding',
    );
    expect(mailService.sendSignInNotification).toHaveBeenCalled();
    expect(errorSpy).not.toHaveBeenCalled();
  });

  it('still throws a static error when code or state is missing (unchanged)', async () => {
    await expect(
      controller.githubCallback(undefined as never, undefined as never, req(), res()),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });
});
