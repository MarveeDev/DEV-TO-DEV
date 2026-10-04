import { HttpException } from '@nestjs/common';
import { CodeService } from './code.service';
import { RedisService } from '../redis/redis.service';

async function expectStatus(
  promise: Promise<unknown>,
  status: number,
): Promise<void> {
  try {
    await promise;
    throw new Error('expected the call to reject');
  } catch (err) {
    if (err instanceof Error && err.message === 'expected the call to reject') {
      throw err;
    }
    expect(err).toBeInstanceOf(HttpException);
    expect((err as HttpException).getStatus()).toBe(status);
  }
}

describe('CodeService', () => {
  let service: CodeService;
  let incr: jest.Mock;
  let expire: jest.Mock;
  let fetchMock: jest.Mock;

  beforeEach(() => {
    incr = jest.fn().mockResolvedValue(1);
    expire = jest.fn().mockResolvedValue(1);

    const redis = {
      getClient: () => ({ incr, expire }),
    } as unknown as RedisService;

    fetchMock = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, output: 'hi\n', error: null }),
    });
    global.fetch = fetchMock as unknown as typeof fetch;

    service = new CodeService(redis);
  });

  it('executes code when under all limits', async () => {
    const result = await service.run('u1', '1.2.3.4', 'python', 'print(1)');
    expect(result).toEqual({ success: true, output: 'hi\n', error: null });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('rejects (fail-closed) when Redis is unavailable', async () => {
    incr.mockRejectedValue(new Error('redis down'));
    await expectStatus(service.run('u1', '1.2.3.4', 'python', 'print(1)'), 503);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('rejects when the per-user minute limit is exceeded', async () => {
    incr.mockResolvedValue(31);
    await expectStatus(service.run('u1', '1.2.3.4', 'python', 'print(1)'), 429);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('rejects a second concurrent run for the same user', async () => {
    // The first call registers the user synchronously before its first await,
    // so a second call for the same user is rejected immediately.
    const first = service.run('u1', '1.2.3.4', 'python', 'print(1)');
    await expectStatus(service.run('u1', '1.2.3.4', 'python', 'print(2)'), 429);
    await first;
  });
});
