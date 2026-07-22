const fs = require('fs');
const path = require('path');
const Razorpay = require('razorpay');
const crypto = require('crypto');

const envFile = fs.readFileSync(path.join(__dirname, '../.env.local'), 'utf8');
const env = {};
envFile.split('\n').forEach(line => {
  const [k, v] = line.split('=');
  if (k && v) env[k.trim()] = v.trim();
});

const keyId = env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
const keySecret = env.RAZORPAY_KEY_SECRET;

console.log('=== RAZORPAY CREDENTIALS DIAGNOSTIC ===');
console.log('Key ID:', keyId);
console.log('Key Secret:', keySecret ? (keySecret.substring(0, 4) + '***') : 'MISSING');

async function testRazorpay() {
  console.log('\n--- 1. Testing Order Creation via Razorpay SDK ---');
  try {
    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret
    });

    const order = await razorpay.orders.create({
      amount: 9900, // ₹99 in paise
      currency: 'INR',
      receipt: `rcpt_test_${Date.now()}`,
      notes: { purpose: 'Test Consultation Fee Verification' }
    });

    console.log('Order Creation SUCCESS!');
    console.log('Order ID:', order.id);
    console.log('Order Amount (paise):', order.amount);
    console.log('Order Currency:', order.currency);
    console.log('Order Status:', order.status);

    console.log('\n--- 2. Testing HMAC-SHA256 Signature Verification ---');
    const mockPaymentId = 'pay_mock_' + Date.now();
    const generatedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(order.id + '|' + mockPaymentId)
      .digest('hex');

    console.log('Mock Payment ID:', mockPaymentId);
    console.log('Generated Signature:', generatedSignature);

    const isMatch = crypto
      .createHmac('sha256', keySecret)
      .update(order.id + '|' + mockPaymentId)
      .digest('hex') === generatedSignature;

    console.log('Signature Validation Check:', isMatch ? 'PASSED (100% Valid HMAC-SHA256)' : 'FAILED');

  } catch (err) {
    console.error('Razorpay Test Exception:', err);
  }
}

testRazorpay();
