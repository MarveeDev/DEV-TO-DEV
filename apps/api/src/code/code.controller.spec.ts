import { UnauthorizedException } from '@nestjs/common';
import { CodeController } from './code.controller';
import { CodeService } from './code.service';
import { SessionsService } from '../sessions/sessions.service';
import type { Request } from 'express';

describe('CodeController client IP', () => {
  const codeService = { run: jest.fn() };
  const sessionsService = { validateSession: jest.fn() };

  let controller: CodeController;

  beforeEach(() => {
    jest.clearAllMocks();
    sessionsService.validateSession.mockResolvedValue('u1');
    codeService.run.mockResolvedValue({ output: 'ok' });
    controller = new CodeController(
      codeService as unknown as CodeService,
      sessionsService as unknown as SessionsService,
    );
  });

  function makeReq(overrides: Partial<Request> = {}): Request {
    return {
      cookies: { session_id: 'token' },
      ip: '1.2.3.4',
      headers: { 'x-forwarded-for': '9.9.9.9' },
      ...overrides,
    } as unknown as Request;
  }

  const dto = { language: 'python', code: 'print(1)' };

  it('uses req.ip instead of a spoofed X-Forwarded-For', async () => {
    await controller.run(dto as never, makeReq());

    expect(codeService.run).toHaveBeenCalledWith(
      'u1',
      '1.2.3.4',
      'python',
      'print(1)',
    );
  });

  it('does not change the IP when the forwarded header changes', async () => {
    await controller.run(
      dto as never,
      makeReq({ headers: { 'x-forwarded-for': '8.8.8.8, 1.1.1.1' } }),
    );

    expect(codeService.run).toHaveBeenCalledWith(
      'u1',
      '1.2.3.4',
      'python',
      'print(1)',
    );
  });

  it('cannot be overridden by missing or malformed forwarding headers', async () => {
    await controller.run(dto as never, makeReq({ headers: {} }));

    expect(codeService.run).toHaveBeenCalledWith(
      'u1',
      '1.2.3.4',
      'python',
      'print(1)',
    );
  });

  it('preserves the authenticated user id for per-user limits', async () => {
    await controller.run(dto as never, makeReq());

    const [userId] = codeService.run.mock.calls[0];
    expect(userId).toBe('u1');
  });

  it('still rejects unauthenticated callers', async () => {
    sessionsService.validateSession.mockResolvedValue(null);
    await expect(
      controller.run(dto as never, makeReq()),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });
});
