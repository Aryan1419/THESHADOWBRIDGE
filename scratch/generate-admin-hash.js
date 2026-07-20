const crypto = require('crypto');

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

function verifyPassword(password, storedHash) {
  const [salt, originalHash] = storedHash.split(':');
  const hashToTest = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  return crypto.timingSafeEqual(Buffer.from(originalHash, 'hex'), Buffer.from(hashToTest, 'hex'));
}

const newPass = 'ShadowBridge2026!Admin';
const hashed = hashPassword(newPass);

console.log('New Admin Password:', newPass);
console.log('PBKDF2 Hashed Value:', hashed);
console.log('Verification check:', verifyPassword(newPass, hashed));
