import crypto from 'crypto';

/**
 * Hashes a plain-text password using PBKDF2 with SHA-512, 100,000 iterations, and a random 16-byte salt.
 * Returns format: "salt:hash"
 */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

/**
 * Verifies a plain-text password against a stored "salt:hash" string.
 */
export function verifyPassword(password: string, storedHashOrPlain: string): boolean {
  if (!storedHashOrPlain) return false;

  // 1. Verify against salt:hash format
  if (storedHashOrPlain.includes(':')) {
    const [salt, originalHash] = storedHashOrPlain.split(':');
    const hashToTest = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
    try {
      return crypto.timingSafeEqual(Buffer.from(originalHash, 'hex'), Buffer.from(hashToTest, 'hex'));
    } catch {
      return false;
    }
  }

  // 2. Fallback check for unhashed string during migration
  return password === storedHashOrPlain;
}
