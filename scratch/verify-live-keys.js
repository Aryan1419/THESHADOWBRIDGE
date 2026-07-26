const fs = require('fs');
const path = require('path');

function checkEnv(fileName) {
  const filePath = path.join(__dirname, '..', fileName);
  if (!fs.existsSync(filePath)) {
    console.log(`${fileName}: NOT FOUND`);
    return;
  }
  const content = fs.readFileSync(filePath, 'utf8');
  const env = {};
  content.split('\n').forEach(line => {
    const [k, v] = line.split('=');
    if (k && v) env[k.trim()] = v.trim();
  });

  console.log(`=== ${fileName} ===`);
  console.log('RAZORPAY_KEY_ID:', env.RAZORPAY_KEY_ID);
  console.log('NEXT_PUBLIC_RAZORPAY_KEY_ID:', env.NEXT_PUBLIC_RAZORPAY_KEY_ID);
  console.log('RAZORPAY_KEY_SECRET:', env.RAZORPAY_KEY_SECRET ? (env.RAZORPAY_KEY_SECRET.substring(0, 4) + '***' + env.RAZORPAY_KEY_SECRET.substring(env.RAZORPAY_KEY_SECRET.length - 4)) : 'MISSING');
}

checkEnv('.env.local');
checkEnv('.env');
