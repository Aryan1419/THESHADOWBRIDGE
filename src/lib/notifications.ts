import { supabase } from './supabase';

interface SendEmailParams {
  to: string;
  subject: string;
  type: 'registration' | 'status_change' | 'payment_receipt' | 'match_ready' | 'placement_confirmed';
  bodyHtml: string;
}

interface SendSMSParams {
  to: string;
  message: string;
  type: string;
}

// Plain-English explanation mapping for application/request statuses
export const STATUS_EXPLANATIONS: Record<string, string> = {
  // Tutor / Shadow Teacher statuses
  'Interview Awaiting': 'We are currently screening your application credentials and verifying qualifications.',
  'Interview Scheduled': 'We have scheduled your panel assessment interview with Founder Pratibha Mishra. Meeting link guidelines are active on your dashboard.',
  'Shortlisted': 'Congratulations, you have been shortlisted and inducted into our active matching candidate pool.',
  'Onboarding': 'We are completing your reference checks, address validation, and standard onboarding credentials verification.',
  'Active': 'Your profile is now active! Our matchmaking system will pair you with parent requests.',
  'Rejected': 'Thank you for applying. We are unable to proceed with your onboarding at this time. Your profile will be retained for future openings.',

  // Parent statuses
  'Consultation Scheduled': 'We have scheduled your 45-minute parent-educator video assessment session with Lead Mentor Pratibha Mishra.',
  'Requirement Analysis': 'Our lead clinical mentors are analyzing your requirements and formulating developmental targets.',
  'Match Proposed': 'We have proposed an educator candidate match! You can review their verified profile directly on your dashboard.',
  'Introduction Call': 'We are scheduling a trial introduction call between the proposed educator, yourself, and your child.',
  'Support Started': 'Congratulations, your educational placement is active and regular learning support sessions have commenced.',
  'Closed': 'This support request has been archived or closed by the administration.'
};

/**
 * Wraps custom email body HTML into a unified, premium branded email template
 */
export function wrapInEmailTemplate(subject: string, bodyContentHtml: string): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>${subject}</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #F8F5FB; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #F8F5FB; padding: 40px 10px;">
          <tr>
            <td align="center">
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #E6E2EB; box-shadow: 0 4px 12px rgba(59, 42, 107, 0.04);">
                
                <!-- HEADER BAR -->
                <tr>
                  <td align="center" style="background-color: #3B2A6B; padding: 30px; border-bottom: 4px solid #C89B3C;">
                    <h1 style="color: #ffffff; font-family: Georgia, serif; font-size: 26px; font-weight: 900; margin: 0; letter-spacing: -0.5px;">The Shadow Bridge</h1>
                    <span style="color: #C89B3C; font-size: 10px; font-weight: bold; letter-spacing: 2px; text-transform: uppercase; display: block; margin-top: 6px;">by Pratibha Mishra</span>
                  </td>
                </tr>

                <!-- EMAIL BODY CARD -->
                <tr>
                  <td style="padding: 40px 30px; color: #2D253A; font-size: 15px; line-height: 1.6;">
                    ${bodyContentHtml}
                  </td>
                </tr>

                <!-- FOOTER INFO -->
                <tr>
                  <td align="center" style="background-color: #F3EEF8; padding: 30px; text-align: center; color: #6A5B7C; font-size: 12px; border-top: 1px solid #E6E2EB;">
                    <p style="margin: 0 0 10px 0; font-weight: bold; color: #3B2A6B;">The Shadow Bridge Co.</p>
                    <p style="margin: 0 0 15px 0; line-height: 1.4;">
                      Office 203, Madhapur, Hitec City, Hyderabad, Telangana, 500081<br>
                      Phone: +91 98123 45678 &bull; Email: info@shadowbridge.in
                    </p>
                    <div style="margin: 15px 0;">
                      <span style="color: #C89B3C; font-weight: bold;">Ahmedabad &bull; Hyderabad</span>
                    </div>
                    <p style="margin: 15px 0 0 0; font-size: 11px; color: #9B8EA9; line-height: 1.4;">
                      This is an automated operational notification regarding your application or account.<br>
                      To manage preferences, please contact support.
                    </p>
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

/**
 * Sends an automated email notification via Resend.
 * Outcomes are saved to the notifications_log table.
 */
export async function sendEmail({ to, subject, type, bodyHtml }: SendEmailParams): Promise<{ success: boolean; id?: string; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  const senderEmail = process.env.SENDER_EMAIL || 'onboarding@resend.dev';
  const fullHtml = wrapInEmailTemplate(subject, bodyHtml);

  // If API key is missing, log failure in database but do NOT crash execution
  if (!apiKey) {
    const errorMsg = 'RESEND_API_KEY environment variable is not configured.';
    console.error(`[Email Fail Log] To: ${to}, Type: ${type}, Subject: ${subject}. Error: ${errorMsg}`);
    
    await supabase.from('notifications_log').insert({
      recipient: to,
      type,
      subject,
      status: 'failed',
      error_message: errorMsg
    });

    return { success: false, error: errorMsg };
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        from: `The Shadow Bridge <${senderEmail}>`,
        to: [to],
        subject,
        html: fullHtml
      })
    });

    const resData = await response.json().catch(() => ({}));

    if (response.ok && resData.id) {
      // Save successful dispatch log
      await supabase.from('notifications_log').insert({
        recipient: to,
        type,
        subject,
        status: 'sent',
        error_message: null
      });

      return { success: true, id: resData.id };
    } else {
      const errorMsg = resData.message || `Resend API returned status ${response.status}`;
      console.error(`[Email Fail Log] To: ${to}, Type: ${type}. Error: ${errorMsg}`);

      await supabase.from('notifications_log').insert({
        recipient: to,
        type,
        subject,
        status: 'failed',
        error_message: errorMsg
      });

      return { success: false, error: errorMsg };
    }
  } catch (err: any) {
    const errorMsg = err.message || 'Unknown network error occurred while dispatching via Resend.';
    console.error(`[Email Fail Log] To: ${to}, Type: ${type}. Exception:`, err);

    await supabase.from('notifications_log').insert({
      recipient: to,
      type,
      subject,
      status: 'failed',
      error_message: errorMsg
    });

    return { success: false, error: errorMsg };
  }
}

/**
 * Structural stub for SMS notifications (to follow once DLT registration is complete).
 * Currently logs to console.
 */
export async function sendSMS({ to, message, type }: SendSMSParams): Promise<{ success: boolean }> {
  console.log(`[SMS Structural Stub] (Waiting for DLT Activation)`);
  console.log(`To: ${to}`);
  console.log(`Type: ${type}`);
  console.log(`Content: "${message}"`);
  return { success: true };
}
