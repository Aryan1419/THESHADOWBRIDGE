const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const envFile = fs.readFileSync(path.join(__dirname, '../.env.local'), 'utf8');
const env = {};
envFile.split('\n').forEach(line => {
  const [k, v] = line.split('=');
  if (k && v) env[k.trim()] = v.trim();
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL || env.Supabase_key_URL;
const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY || env.Supabase_key_ANON;
const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  console.log('=== STEP 1: Creating a test contact message in Supabase ===');
  const testId = `test-reply-${Date.now()}`;
  const testContact = {
    id: testId,
    name: 'Pratibha Mishra (Test)',
    phone: '+91 9876543210',
    email: 'theshadowbridgesupport@gmail.com',
    city: 'Delhi NCR',
    message: 'Hello, I would like to inquire about enrolling my child for a shadow teacher in Delhi NCR.',
    status: 'new'
  };

  const { error: insertErr } = await supabase.from('contacts').insert(testContact);
  if (insertErr) {
    console.error('Insert test contact error:', insertErr);
    return;
  }
  console.log('Successfully inserted test contact:', testId);

  console.log('\n=== STEP 2: Executing Admin Reply API call ===');
  const replyPayload = {
    action: 'reply_contact',
    id: testId,
    adminReply: 'Dear Pratibha, thank you for reaching out! We have received your inquiry regarding shadow teacher support in Delhi NCR. Our team will schedule an initial consultation with you shortly.'
  };

  const res = await fetch('http://localhost:3000/api/admin/records', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer mock-admin-token-sb-2026'
    },
    body: JSON.stringify(replyPayload)
  }).catch(() => null);

  if (res) {
    const data = await res.json();
    console.log('API Response Status:', res.status);
    console.log('API Response Data:', JSON.stringify(data, null, 2));
  } else {
    console.log('Local dev server not running on port 3000, calling backend function logic directly via Resend & Supabase update...');
    
    // Direct Resend dispatch verification
    const apiKey = env.RESEND_API_KEY;
    const senderEmail = env.SENDER_EMAIL || 'noreply@theshadowbridge.com';
    
    const emailRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        from: `The Shadow Bridge <${senderEmail}>`,
        to: [testContact.email],
        subject: 'Re: Your inquiry to The Shadow Bridge',
        html: `
          <h2 style="color: #3B2A6B; font-family: Georgia, serif; font-size: 20px; margin: 0 0 16px 0;">Dear ${testContact.name},</h2>
          <div style="color: #2D253A; font-size: 15px; line-height: 1.6; margin: 0 0 24px 0;">
            ${replyPayload.adminReply.replace(/\n/g, '<br />')}
          </div>

          <div style="background-color: #F8F5FB; border-left: 4px solid #C89B3C; padding: 16px; margin: 24px 0; border-radius: 4px 12px 12px 4px;">
            <h4 style="margin: 0 0 8px 0; color: #3B2A6B; font-size: 13px; text-transform: uppercase; letter-spacing: 1px;">Your Original Inquiry</h4>
            <p style="margin: 0; font-size: 13px; color: #555555; font-style: italic; line-height: 1.5;">"${testContact.message}"</p>
          </div>

          <div style="border-top: 1px solid #E6E2EB; padding-top: 16px; margin-top: 24px;">
            <p style="margin: 0 0 4px 0; font-weight: bold; color: #3B2A6B; font-size: 14px;">The Shadow Bridge Team</p>
            <p style="margin: 0; font-size: 12px; color: #6A5B7C;">Email: theshadowbridgesupport@gmail.com | Web: https://theshadowbridge.com</p>
          </div>
        `
      })
    });

    const emailData = await emailRes.json();
    console.log('Resend Email Dispatch Status:', emailRes.status, emailData);

    // Update Supabase
    const { data: updatedRow, error: upErr } = await supabase.from('contacts').update({
      status: 'responded',
      admin_reply: replyPayload.adminReply,
      replied_at: new Date().toISOString()
    }).eq('id', testId).select().single();

    if (upErr) console.error('Supabase Update Error:', upErr);
    else console.log('Supabase Record Updated Successfully:', JSON.stringify(updatedRow, null, 2));
  }

  console.log('\n=== STEP 3: Verifying final record in Supabase contacts table ===');
  const { data: finalRecord } = await supabase.from('contacts').select('*').eq('id', testId).single();
  console.log('Final Record in Supabase:', JSON.stringify(finalRecord, null, 2));
}

main();
