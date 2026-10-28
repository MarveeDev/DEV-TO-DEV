import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(scryptCallback);

const KEY_LENGTH = 64;
const SALT_LENGTH = 16;
const SEPARATOR = '$';

/**
 * A valid scrypt hash of a fixed, non-secret value. Used to equalize the cost of
 * `verifyPassword` for unknown emails / password-less (OAuth-only) accounts so
 * that login timing does not reveal whether an account exists.
 */
export const DUMMY_PASSWORD_HASH =
  'scrypt$SZcD4JVo8kqlgiNiix7sdg$CsbAYJiVfhizcmFc5bmqsDjsb-1aniERFzGe77ElU4Gxbr-_6T69JRvJJmVlHlXzU7DE8wmO28M7xU2agXSM1Q';

/**
 * Password hashing backed by Node's built-in `scrypt` (a memory-hard KDF), so
 * no external password-hashing dependency is required. The stored value is
 * self-describing: `scrypt$<salt-b64url>$<derived-key-b64url>`.
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(SALT_LENGTH);
  const derived = (await scrypt(password, salt, KEY_LENGTH)) as Buffer;
  return `scrypt${SEPARATOR}${salt.toString('base64url')}${SEPARATOR}${derived.toString('base64url')}`;
}

/**
 * Constant-time comparison of a candidate password against a stored hash.
 * Returns false for any malformed stored value rather than throwing.
 */
export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const parts = stored.split(SEPARATOR);
  if (parts.length !== 3 || parts[0] !== 'scrypt') return false;

  let salt: Buffer;
  let expected: Buffer;
  try {
    salt = Buffer.from(parts[1], 'base64url');
    expected = Buffer.from(parts[2], 'base64url');
  } catch {
    return false;
  }

  if (salt.length === 0 || expected.length === 0) return false;

  const derived = (await scrypt(password, salt, expected.length)) as Buffer;
  return timingSafeEqual(derived, expected);
}
