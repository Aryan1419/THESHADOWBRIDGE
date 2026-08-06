const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const envFile = fs.readFileSync(path.join(__dirname, '../.env.local'), 'utf8');
const env = {};
envFile.split('\n').forEach(line => {
  const [k, ...v] = line.split('=');
  if (k && v.length > 0) env[k.trim()] = v.join('=').trim();
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL || env.Supabase_key_URL;
const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY || env.Supabase_key_ANON;
const supabase = createClient(supabaseUrl, supabaseKey);

const apiKey = env.RESEND_API_KEY;
const senderEmail = env.SENDER_EMAIL || 'noreply@theshadowbridge.com';

async function main() {
  console.log('=== VERIFYING ISSUE 1: SHADOW TEACHER STATUS & NOTES UPDATE ===\n');

  const shadowId = 'shadow-g7g98ur'; // Pratibha Mishra (TSB-2026-9896)
  
  // 1. Update record in Supabase
  const { data: updatedShadow, error: updateErr } = await supabase
    .from('shadow_teachers')
    .update({
      status: 'Shortlisted',
      notes: 'Verified candidate qualifications & experience.'
    })
    .eq('id', shadowId)
    .select()
    .single();

  if (updateErr) {
    console.error('❌ Shadow Teacher Update Failed:', updateErr);
  } else {
    console.log('✅ Shadow Teacher Status & Notes Updated in Database:');
    console.log('   ID:', updatedShadow.id);
    console.log('   Registration ID:', updatedShadow.registration_id);
    console.log('   Name:', updatedShadow.name);
    console.log('   Status:', updatedShadow.status);
    console.log('   Notes:', updatedShadow.notes);
  }

  // 2. Fetch record fresh to confirm persistence after refresh
  const { data: fetchedShadow } = await supabase
    .from('shadow_teachers')
    .select('*')
    .eq('id', shadowId)
    .single();

  console.log('\n   Fresh DB Re-fetch Verification:');
  console.log('   Persisted Status:', fetchedShadow.status);
  console.log('   Persisted Notes:', fetchedShadow.notes);

  console.log('\n=== VERIFYING ISSUE 2: CONTACT REPLY EMAIL DELIVERY ===\n');

  const contactId = 'contact-kr5mvk6';
  const replyMessage = 'Hello Aryan! Thank you for reaching out. Yes, we provide full special education shadow teacher coverage in Greater Noida.';
  const recipientEmail = 'aryanbeltharia1419@gmail.com';

  const fromHeader = senderEmail.includes('<') ? senderEmail : `The Shadow Bridge <${senderEmail}>`;

  // Dispatch via Resend API directly
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      from: fromHeader,
      to: [recipientEmail],
      subject: 'Re: Your inquiry to The Shadow Bridge',
      html: `
        <h2 style="color: #3B2A6B; font-family: Georgia, serif; font-size: 20px; margin: 0 0 16px 0;">Dear Aryan Beltharia,</h2>
        <div style="color: #2D253A; font-size: 15px; line-height: 1.6; margin: 0 0 24px 0;">
          ${replyMessage}
        </div>
        <div style="background-color: #F8F5FB; border-left: 4px solid #C89B3C; padding: 16px; margin: 24px 0; border-radius: 4px 12px 12px 4px;">
          <h4 style="margin: 0 0 8px 0; color: #3B2A6B; font-size: 13px; text-transform: uppercase; letter-spacing: 1px;">Your Original Inquiry</h4>
          <p style="margin: 0; font-size: 13px; color: #555555; font-style: italic; line-height: 1.5;">"do you provide service in gn?"</p>
        </div>
        <div style="border-top: 1px solid #E6E2EB; padding-top: 16px; margin-top: 24px;">
          <p style="margin: 0 0 4px 0; font-weight: bold; color: #3B2A6B; font-size: 14px;">The Shadow Bridge Team</p>
          <p style="margin: 0; font-size: 12px; color: #6A5B7C;">Email: theshadowbridgesupport@gmail.com | Web: https://theshadowbridge.com</p>
        </div>
      `
    })
  });

  const resData = await response.json();
  console.log('Resend Delivery HTTP Status:', response.status);
  console.log('Resend Response Body:', JSON.stringify(resData, null, 2));

  if (response.ok && resData.id) {
    const { data: updatedContact } = await supabase
      .from('contacts')
      .update({
        status: 'responded',
        admin_reply: replyMessage,
        replied_at: new Date().toISOString()
      })
      .eq('id', contactId)
      .select()
      .single();

    console.log('✅ Contact Record Updated to Responded in DB:');
    console.log('   Status:', updatedContact.status);
    console.log('   Admin Reply:', updatedContact.admin_reply);
    console.log('   Replied At:', updatedContact.replied_at);
  }
}

main();
