import { hashPassword, verifyPassword } from './password.util';

describe('password.util', () => {
  it('hashes and verifies a correct password', async () => {
    const stored = await hashPassword('s3cret-pass');
    expect(stored).toContain('scrypt$');
    expect(stored).not.toContain('s3cret-pass');
    await expect(verifyPassword('s3cret-pass', stored)).resolves.toBe(true);
  });

  it('rejects an incorrect password', async () => {
    const stored = await hashPassword('s3cret-pass');
    await expect(verifyPassword('wrong-pass', stored)).resolves.toBe(false);
  });

  it('produces distinct hashes for the same password (random salt)', async () => {
    const a = await hashPassword('s3cret-pass');
    const b = await hashPassword('s3cret-pass');
    expect(a).not.toBe(b);
  });

  it('rejects malformed stored values', async () => {
    await expect(verifyPassword('s3cret-pass', 'not-a-hash')).resolves.toBe(false);
    await expect(verifyPassword('s3cret-pass', 'scrypt$onlytwoparts')).resolves.toBe(false);
  });
});
