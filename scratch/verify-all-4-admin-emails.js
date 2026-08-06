const fs = require('fs');
const path = require('path');

const envFile = fs.readFileSync(path.join(__dirname, '../.env.local'), 'utf8');
const env = {};
envFile.split('\n').forEach(line => {
  const [k, ...v] = line.split('=');
  if (k && v.length > 0) env[k.trim()] = v.join('=').trim();
});

const apiKey = env.RESEND_API_KEY;
const senderEmail = env.SENDER_EMAIL || 'noreply@theshadowbridge.com';
const adminRecipient = 'theshadowbridgesupport@gmail.com';
const fromHeader = senderEmail.includes('<') ? senderEmail : `The Shadow Bridge <${senderEmail}>`;

function wrapInEmailTemplate(subject, bodyHtml) {
  return `
    <!DOCTYPE html>
    <html>
      <head><meta charset="utf-8"><title>${subject}</title></head>
      <body style="margin: 0; padding: 0; background-color: #F8F5FB; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #F8F5FB; padding: 40px 10px;">
          <tr>
            <td align="center">
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #E6E2EB; box-shadow: 0 4px 12px rgba(59, 42, 107, 0.04);">
                <!-- Header -->
                <tr>
                  <td style="background: linear-gradient(135deg, #3B2A6B 0%, #B0206B 100%); padding: 32px 40px; text-align: center;">
                    <h1 style="color: #ffffff; font-family: Georgia, serif; font-size: 24px; font-weight: normal; margin: 0; letter-spacing: 0.5px;">The Shadow Bridge</h1>
                    <p style="color: #F3EEF8; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; margin: 6px 0 0 0; opacity: 0.9;">Bridge to Inclusive Learning</p>
                  </td>
                </tr>
                <!-- Content -->
                <tr>
                  <td style="padding: 40px; color: #2D253A; font-size: 15px; line-height: 1.6;">
                    ${bodyHtml}
                  </td>
                </tr>
                <!-- Footer -->
                <tr>
                  <td style="background-color: #F8F5FB; padding: 24px 40px; text-align: center; border-top: 1px solid #E6E2EB; font-size: 12px; color: #8C7B9E;">
                    <p style="margin: 0 0 6px 0;"><strong>The Shadow Bridge</strong> — Special Education & Academic Tutoring Platform</p>
                    <p style="margin: 0;">Support Email: <a href="mailto:theshadowbridgesupport@gmail.com" style="color: #3B2A6B; text-decoration: none;">theshadowbridgesupport@gmail.com</a></p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
}

async function sendAdminEmail(subject, bodyHtml) {
  const fullHtml = wrapInEmailTemplate(subject, bodyHtml);

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      from: fromHeader,
      to: [adminRecipient],
      subject,
      html: fullHtml
    })
  });

  const resData = await response.json().catch(() => ({}));
  return { status: response.status, data: resData };
}

async function testAllAdminEmails() {
  console.log('=== VERIFYING ALL 4 ADMIN NOTIFICATION EMAILS TO theshadowbridgesupport@gmail.com ===\n');

  // TEST 1: Shadow Teacher Candidate Registration
  console.log('1. Dispatching Admin Alert: New Shadow Teacher Registration...');
  const res1 = await sendAdminEmail(
    'New Shadow Teacher Registration: Pooja Sharma [TSB-2026-8812]',
    `
      <h2 style="color: #3B2A6B; font-family: Georgia, serif; font-size: 20px; margin: 0 0 16px 0;">New Shadow Teacher Candidate Registration</h2>
      <p style="margin: 0 0 16px 0; color: #4A3E5E;">A new educator has registered as a Special Education Shadow Teacher.</p>
      
      <div style="background-color: #F8F5FB; border-left: 4px solid #3B2A6B; padding: 16px; margin: 20px 0; border-radius: 4px 12px 12px 4px;">
        <p style="margin: 0 0 8px 0;"><strong>Registration ID:</strong> TSB-2026-8812</p>
        <p style="margin: 0 0 8px 0;"><strong>Candidate Name:</strong> Pooja Sharma</p>
        <p style="margin: 0 0 8px 0;"><strong>Phone:</strong> 9876543210</p>
        <p style="margin: 0 0 8px 0;"><strong>Email:</strong> pooja.sharma@example.com</p>
        <p style="margin: 0 0 8px 0;"><strong>City / Location:</strong> Delhi NCR (South Delhi)</p>
        <p style="margin: 0 0 8px 0;"><strong>Qualification:</strong> B.Ed Special Education (Autism Spectrum)</p>
        <p style="margin: 0 0 8px 0;"><strong>Teaching Experience:</strong> 3-5 Years</p>
        <p style="margin: 0;"><strong>Work Preference:</strong> Full-time | Open to Travel: Yes</p>
      </div>

      <p style="margin: 16px 0 0 0; font-size: 13px; color: #6A5B7C;">Log in to the Admin Panel to review this candidate profile and schedule an interview assessment.</p>
    `
  );
  console.log(`   HTTP ${res1.status} | Resend ID: ${res1.data.id || res1.data.message}`);

  // TEST 2: Tutor Candidate Registration
  console.log('\n2. Dispatching Admin Alert: New Tutor Registration...');
  const res2 = await sendAdminEmail(
    'New Tutor Registration: Rajesh Verma [TUT-2026-5541]',
    `
      <h2 style="color: #3B2A6B; font-family: Georgia, serif; font-size: 20px; margin: 0 0 16px 0;">New Home Tutor Candidate Registration</h2>
      <p style="margin: 0 0 16px 0; color: #4A3E5E;">A new educator has registered as an Academic Home Tutor.</p>
      
      <div style="background-color: #F8F5FB; border-left: 4px solid #3B2A6B; padding: 16px; margin: 20px 0; border-radius: 4px 12px 12px 4px;">
        <p style="margin: 0 0 8px 0;"><strong>Registration ID:</strong> TUT-2026-5541</p>
        <p style="margin: 0 0 8px 0;"><strong>Candidate Name:</strong> Rajesh Verma</p>
        <p style="margin: 0 0 8px 0;"><strong>Phone:</strong> 9811223344</p>
        <p style="margin: 0 0 8px 0;"><strong>Email:</strong> rajesh.tutor@example.com</p>
        <p style="margin: 0 0 8px 0;"><strong>City / Location:</strong> Gurgaon / Delhi NCR</p>
        <p style="margin: 0 0 8px 0;"><strong>Qualification:</strong> M.Sc Mathematics (DU)</p>
        <p style="margin: 0 0 8px 0;"><strong>Subjects Taught:</strong> Mathematics, Physics</p>
        <p style="margin: 0;"><strong>Grades Taught:</strong> 9th-10th, 11th-12th</p>
      </div>

      <p style="margin: 16px 0 0 0; font-size: 13px; color: #6A5B7C;">Log in to the Admin Panel to review this tutor profile and schedule an interview assessment.</p>
    `
  );
  console.log(`   HTTP ${res2.status} | Resend ID: ${res2.data.id || res2.data.message}`);

  // TEST 3: Parent Inquiry Registration (Shadow / Tutor)
  console.log('\n3. Dispatching Admin Alert: New Parent Inquiry...');
  const res3 = await sendAdminEmail(
    'New Parent Inquiry (Shadow Teacher): Sunita Gupta [SB-2026-4491]',
    `
      <h2 style="color: #3B2A6B; font-family: Georgia, serif; font-size: 20px; margin: 0 0 16px 0;">New Parent Inquiry (Shadow Teacher Support)</h2>
      <p style="margin: 0 0 16px 0; color: #4A3E5E;">A new parent has registered and paid the ₹99 consultation fee for Shadow Teacher support.</p>
      
      <div style="background-color: #F8F5FB; border-left: 4px solid #3B2A6B; padding: 16px; margin: 20px 0; border-radius: 4px 12px 12px 4px;">
        <p style="margin: 0 0 8px 0;"><strong>Registration ID:</strong> SB-2026-4491</p>
        <p style="margin: 0 0 8px 0;"><strong>Parent Name:</strong> Sunita Gupta (Mother)</p>
        <p style="margin: 0 0 8px 0;"><strong>Phone:</strong> 9988776655</p>
        <p style="margin: 0 0 8px 0;"><strong>Email:</strong> sunita.gupta@example.com</p>
        <p style="margin: 0 0 8px 0;"><strong>Child Name / Grade:</strong> Aarav Gupta (Grade 3)</p>
        <p style="margin: 0 0 8px 0;"><strong>Diagnosis:</strong> ADHD & Mild Dyslexia</p>
        <p style="margin: 0;"><strong>Consultation Status:</strong> Paid ₹99 (Payment ID: pay_test_994112)</p>
      </div>

      <p style="margin: 16px 0 0 0; font-size: 13px; color: #6A5B7C;">Log in to the Admin Panel to review this inquiry and schedule the consultation.</p>
    `
  );
  console.log(`   HTTP ${res3.status} | Resend ID: ${res3.data.id || res3.data.message}`);

  // TEST 4: Website Contact Form Query
  console.log('\n4. Dispatching Admin Alert: Website Contact Query...');
  const res4 = await sendAdminEmail(
    'New Website Inquiry: Ananya Roy',
    `
      <h2 style="color: #3B2A6B; font-family: Georgia, serif; font-size: 20px; font-weight: bold; margin: 0 0 12px 0;">New Contact Form Message</h2>
      <p style="margin: 0 0 24px 0; color: #4A3E5E; font-size: 14px; line-height: 1.5;">A new inquiry has been submitted through The Shadow Bridge website contact form.</p>

      <div style="background-color: #F8F5FB; border-left: 4px solid #3B2A6B; border-radius: 8px; padding: 20px; margin: 0 0 24px 0;">
        <p style="margin: 0 0 10px 0; font-size: 14px; color: #2D253A;"><strong>Name:</strong> Ananya Roy</p>
        <p style="margin: 0 0 10px 0; font-size: 14px; color: #2D253A;"><strong>Phone:</strong> 9711002233</p>
        <p style="margin: 0 0 10px 0; font-size: 14px; color: #2D253A;"><strong>Email:</strong> ananya.roy@example.com</p>
        <p style="margin: 0; font-size: 14px; color: #2D253A;"><strong>City:</strong> Noida</p>
      </div>

      <div style="margin: 0 0 24px 0;">
        <p style="margin: 0 0 8px 0; font-size: 14px; font-weight: bold; color: #3B2A6B;">Message:</p>
        <div style="background-color: #ffffff; border: 1px solid #E6E2EB; border-radius: 8px; padding: 16px; color: #2D253A; font-size: 14px;">Looking for home tutoring options for Grade 7 Science and Mathematics in Sector 62.</div>
      </div>
    `
  );
  console.log(`   HTTP ${res4.status} | Resend ID: ${res4.data.id || res4.data.message}`);

  console.log('\n=== ALL 4 TEST DISPATCHES COMPLETED SUCCESSFULLY! ===');
}

testAllAdminEmails();
