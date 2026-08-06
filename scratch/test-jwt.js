const crypto = require('crypto');

const JWT_SECRET = 'the-shadow-bridge-secret-key-2026';

function signAdminToken(email, expiresInSeconds = 86400) {
  const header = { alg: 'HS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    email,
    role: 'admin',
    iat: now,
    exp: now + expiresInSeconds
  };

  const base64UrlHeader = Buffer.from(JSON.stringify(header)).toString('base64url');
  const base64UrlPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');

  const signature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(`${base64UrlHeader}.${base64UrlPayload}`)
    .digest('base64url');

  return `${base64UrlHeader}.${base64UrlPayload}.${signature}`;
}

function verifyAdminToken(token) {
  if (!token) return null;

  const parts = token.split('.');
  if (parts.length !== 3) return null;

  const [base64UrlHeader, base64UrlPayload, signature] = parts;

  const expectedSignature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(`${base64UrlHeader}.${base64UrlPayload}`)
    .digest('base64url');

  try {
    const isSignatureValid = crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );

    if (!isSignatureValid) return null;

    const payload = JSON.parse(
      Buffer.from(base64UrlPayload, 'base64url').toString('utf8')
    );

    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      return null;
    }

    return payload;
  } catch (err) {
    return null;
  }
}

console.log('=== TESTING HMAC-SHA256 JWT AUTHENTICATION ===\n');

const token = signAdminToken('pratibha@theshadowbridge.com');
console.log('Signed JWT Token:', token);

const verified = verifyAdminToken(token);
console.log('\nVerified Payload:', verified);

const tamperedToken = token + 'fake';
const tamperedResult = verifyAdminToken(tamperedToken);
console.log('\nTampered Token Result (Should be null):', tamperedResult);
