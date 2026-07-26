import crypto from 'crypto';
import bcrypt from 'bcryptjs';

/**
 * Hashes a plain-text password using bcrypt with salt rounds = 10.
 * Returns format: "$2b$10$..."
 */
export function hashPassword(password: string): string {
  return bcrypt.hashSync(password, 10);
}

/**
 * Verifies a plain-text password against a stored bcrypt hash, PBKDF2 salt:hash, or fallback.
 */
export function verifyPassword(password: string, storedHashOrPlain: string): boolean {
  if (!storedHashOrPlain) return false;

  // 1. Verify bcrypt hash format ($2a$, $2b$, $2y$)
  if (
    storedHashOrPlain.startsWith('$2a$') ||
    storedHashOrPlain.startsWith('$2b$') ||
    storedHashOrPlain.startsWith('$2y$')
  ) {
    try {
      return bcrypt.compareSync(password, storedHashOrPlain);
    } catch {
      return false;
    }
  }

  // 2. Verify against PBKDF2 salt:hash format
  if (storedHashOrPlain.includes(':')) {
    const [salt, originalHash] = storedHashOrPlain.split(':');
    const hashToTest = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
    try {
      return crypto.timingSafeEqual(Buffer.from(originalHash, 'hex'), Buffer.from(hashToTest, 'hex'));
    } catch {
      return false;
    }
  }

  // 3. Fallback check for unhashed string during migration
  return password === storedHashOrPlain;
}
