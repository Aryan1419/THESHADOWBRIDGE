import { supabase } from './supabase';

interface SendEmailParams {
  to: string;
  subject: string;
  type: 'registration' | 'status_change' | 'payment_receipt' | 'match_ready' | 'placement_confirmed' | 'contact_alert' | 'contact_receipt' | 'commission_details';
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
                
                <!-- HEADER BAR WITH LOGO -->
                <tr>
                  <td align="center" style="background-color: #3B2A6B; padding: 32px 20px; border-bottom: 4px solid #C89B3C; text-align: center;">
                    <table border="0" cellpadding="0" cellspacing="0" style="margin: 0 auto;">
                      <tr>
                        <td align="center" style="padding-bottom: 12px;">
                          <img src="https://www.theshadowbridge.com/favicon-192.png" alt="The Shadow Bridge Logo" width="60" height="60" style="display: block; border-radius: 12px; background-color: #ffffff; padding: 4px; border: 1px solid #C89B3C; box-shadow: 0 4px 10px rgba(0,0,0,0.15);" />
                        </td>
                      </tr>
                    </table>
                    <h1 style="color: #ffffff; font-family: Georgia, serif; font-size: 24px; font-weight: 900; margin: 0; letter-spacing: -0.5px;">The Shadow Bridge</h1>
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
                      Email: <a href="mailto:theshadowbridgesupport@gmail.com" style="color: #3B2A6B; text-decoration: underline;">theshadowbridgesupport@gmail.com</a>
                    </p>
                    <div style="margin: 15px 0;">
                      <span style="color: #C89B3C; font-weight: bold;">Delhi NCR &bull; Ahmedabad &bull; Hyderabad &bull; Bangalore &bull; Pune</span>
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
  const senderEmail = process.env.SENDER_EMAIL || 'noreply@theshadowbridge.com';
  const fullHtml = wrapInEmailTemplate(subject, bodyHtml);

  // Format sender header cleanly: "The Shadow Bridge <noreply@theshadowbridge.com>"
  const fromHeader = senderEmail.includes('<') 
    ? senderEmail 
    : `The Shadow Bridge <${senderEmail}>`;

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
        from: fromHeader,
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

      // Resend Sandbox Fallback: If recipient is blocked by unverified domain policy, retry to verified owner email
      if (resData.message?.includes('testing emails to your own email address') && to !== 'aryanbeltharia1419@gmail.com') {
        console.log(`[Resend Sandbox Retry] Re-routing alert to verified owner email (aryanbeltharia1419@gmail.com) for testing.`);
        return sendEmail({
          to: 'aryanbeltharia1419@gmail.com',
          subject: `[Sandbox Alert for ${to}] ` + subject,
          type,
          bodyHtml
        });
      }

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

/**
 * Sends a structured, branded email notification to a Shadow Teacher detailing their
 * agreed monthly salary, commission percentage, total one-time commission, and installment schedule.
 */
export async function sendCommissionNotificationEmail({
  to,
  teacherName,
  monthlySalary,
  commissionPercentage,
  totalCommission,
  installments
}: {
  to: string;
  teacherName: string;
  monthlySalary: number;
  commissionPercentage: number;
  totalCommission: number;
  installments: Array<{
    installmentNumber: number;
    month: string;
    dueDate?: string;
    amount: number;
    status: string;
  }>;
}): Promise<{ success: boolean; error?: string; id?: string }> {
  const installmentRowsHtml = installments.map(inst => `
    <tr>
      <td style="padding: 10px 14px; border-bottom: 1px solid #E6E2EB; font-size: 13px; color: #2D253A; font-weight: bold;">Installment ${inst.installmentNumber} (${inst.month})</td>
      <td style="padding: 10px 14px; border-bottom: 1px solid #E6E2EB; font-size: 13px; color: #2D253A;">${inst.dueDate ? new Date(inst.dueDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : inst.month}</td>
      <td style="padding: 10px 14px; border-bottom: 1px solid #E6E2EB; font-size: 13px; color: #3B2A6B; font-weight: bold;">₹${inst.amount.toLocaleString('en-IN')}</td>
      <td style="padding: 10px 14px; border-bottom: 1px solid #E6E2EB; font-size: 12px;">
        <span style="display: inline-block; padding: 3px 8px; border-radius: 6px; font-weight: bold; background-color: ${inst.status === 'Paid' ? '#D1FAE5; color: #065F46' : '#FEF3C7; color: #92400E'};">${inst.status}</span>
      </td>
    </tr>
  `).join('');

  const bodyHtml = `
    <h2 style="color: #3B2A6B; font-family: Georgia, serif; font-size: 20px; margin: 0 0 16px 0;">Placement Commission Details &amp; Payment Schedule</h2>
    
    <p style="margin: 0 0 16px 0; font-size: 14px; color: #2D253A;">Dear <strong>${teacherName}</strong>,</p>
    
    <p style="margin: 0 0 16px 0; font-size: 14px; color: #555555; line-height: 1.6;">
      Your Shadow Teacher placement has been successfully confirmed. As per the agreed placement terms, your one-time placement commission details are outlined below:
    </p>

    <div style="background-color: #F8F6FA; border: 1px solid #E6E2EB; border-radius: 12px; padding: 18px 20px; margin-bottom: 24px;">
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 6px 0; font-size: 13px; color: #6A5B7C; width: 45%;">Decided Monthly Salary:</td>
          <td style="padding: 6px 0; font-size: 14px; color: #2D253A; font-weight: bold;">₹${monthlySalary.toLocaleString('en-IN')} / month</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; font-size: 13px; color: #6A5B7C;">Commission Percentage:</td>
          <td style="padding: 6px 0; font-size: 14px; color: #2D253A; font-weight: bold;">${commissionPercentage}%</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; font-size: 13px; color: #6A5B7C; border-top: 1px solid #E6E2EB;">Total One-Time Commission:</td>
          <td style="padding: 6px 0; font-size: 16px; color: #3B2A6B; font-weight: 900; border-top: 1px solid #E6E2EB;">₹${totalCommission.toLocaleString('en-IN')}</td>
        </tr>
      </table>
    </div>

    <h3 style="color: #3B2A6B; font-size: 15px; margin: 0 0 12px 0;">Agreed Payment Schedule</h3>
    
    <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px; border: 1px solid #E6E2EB; border-radius: 8px; overflow: hidden;">
      <thead>
        <tr style="background-color: #3B2A6B; color: #ffffff; text-align: left;">
          <th style="padding: 10px 14px; font-size: 12px; text-transform: uppercase;">Installment</th>
          <th style="padding: 10px 14px; font-size: 12px; text-transform: uppercase;">Due Date</th>
          <th style="padding: 10px 14px; font-size: 12px; text-transform: uppercase;">Amount</th>
          <th style="padding: 10px 14px; font-size: 12px; text-transform: uppercase;">Status</th>
        </tr>
      </thead>
      <tbody>
        ${installmentRowsHtml}
      </tbody>
    </table>

    <p style="margin: 0 0 16px 0; font-size: 13px; color: #6A5B7C; line-height: 1.5;">
      Please note that the above commission amount and payment schedule are applicable as per the agreed placement terms. For any queries or payment confirmation, please reply directly to this email or contact support.
    </p>

    <p style="margin: 24px 0 0 0; font-size: 14px; color: #2D253A;">
      Warm regards,<br />
      <strong>Pratibha Mishra &amp; The Shadow Bridge Team</strong><br />
      <span style="font-size: 12px; color: #6A5B7C;">theshadowbridge.com</span>
    </p>
  `;

  return sendEmail({
    to,
    subject: 'Placement Commission Details & Payment Schedule — The Shadow Bridge',
    type: 'commission_details',
    bodyHtml
  });
}
