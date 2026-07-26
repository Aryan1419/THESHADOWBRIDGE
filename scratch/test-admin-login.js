const bcrypt = require('bcryptjs');

const hashInSupabase = '$2b$10$3fvCPp4VHgvDMwFQ15lEDemPQXxSM8wINxfjH.5F9D/OYG.LTyP8G';
const passwordToTest = 'ShadowBridge@2026';

console.log('=== ADMIN AUTHENTICATION VERIFICATION ===');
console.log('Testing password:', passwordToTest);
console.log('Stored Hash:', hashInSupabase);

const isBcryptValid = bcrypt.compareSync(passwordToTest, hashInSupabase);
console.log('Direct bcrypt.compareSync check:', isBcryptValid ? 'PASSED (100% Valid)' : 'FAILED');

const wrongPasswordCheck = bcrypt.compareSync('adminpassword', hashInSupabase);
console.log('Old password ("adminpassword") check (should be false):', wrongPasswordCheck);
