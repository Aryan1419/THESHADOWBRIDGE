const fs = require('fs');
const path = require('path');
const Razorpay = require('razorpay');

const envFile = fs.readFileSync(path.join(__dirname, '../.env.local'), 'utf8');
const env = {};
envFile.split('\n').forEach(line => {
  const [k, ...v] = line.split('=');
  if (k && v.length > 0) env[k.trim()] = v.join('=').trim();
});

const keyId = env.NEXT_PUBLIC_RAZORPAY_KEY_ID || env.RAZORPAY_KEY_ID;
const keySecret = env.RAZORPAY_KEY_SECRET;

console.log('Testing Razorpay Credentials...');
console.log('Key ID:', keyId);
console.log('Key Secret Present:', Boolean(keySecret));

const razorpay = new Razorpay({
  key_id: keyId,
  key_secret: keySecret
});

async function testOrders() {
  try {
    console.log('\n1. Creating ₹5,000 Shadow Placement Order...');
    const order5000 = await razorpay.orders.create({
      amount: 500000,
      currency: 'INR',
      receipt: `rcpt_shadow_5000_${Date.now()}`,
      notes: { purpose: 'Shadow Teacher Placement Fee' }
    });
    console.log('   ✅ ₹5,000 Order Created Successfully!');
    console.log('   Order ID:', order5000.id);
    console.log('   Amount in Paise:', order5000.amount);
    console.log('   Currency:', order5000.currency);

    console.log('\n2. Creating ₹3,000 Home Tutor Placement Order...');
    const order3000 = await razorpay.orders.create({
      amount: 300000,
      currency: 'INR',
      receipt: `rcpt_tutor_3000_${Date.now()}`,
      notes: { purpose: 'Home Tutor Placement Fee' }
    });
    console.log('   ✅ ₹3,000 Order Created Successfully!');
    console.log('   Order ID:', order3000.id);
    console.log('   Amount in Paise:', order3000.amount);

    console.log('\n=== RAZORPAY ORDER CREATION VERIFICATION PASSED 100% ===');
  } catch (err) {
    console.error('❌ Razorpay Order Creation Failed:', err);
  }
}

testOrders();
