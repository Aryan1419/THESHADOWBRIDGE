import { NextResponse } from 'next/server';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';
import { addRecord } from '@/lib/db';
import { sendEmail } from '@/lib/notifications';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, email, city, message } = body;

    if (!name || !phone || !email || !city || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newContact = {
      id: 'contact-' + Math.random().toString(36).substring(2, 9),
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim().toLowerCase(),
      city: city.trim(),
      message: message.trim(),
      status: 'new',
      created_at: new Date().toISOString(),
    };

    let isSaved = false;
    let dbErrorMsg: string | null = null;

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabaseAdmin.from('contacts').insert([{
          id: newContact.id,
          name: newContact.name,
          phone: newContact.phone,
          email: newContact.email,
          city: newContact.city,
          message: newContact.message,
          status: newContact.status,
          created_at: newContact.created_at
        }]).select();

        if (!error) {
          console.log('✅ Contacts row created in Supabase:', data?.[0]?.id || newContact.id);
          isSaved = true;
        } else {
          console.error('❌ Supabase contact insert error:', error);
          dbErrorMsg = error.message;
        }
      } catch (dbErr: any) {
        console.error('Supabase contact insert exception:', dbErr);
        dbErrorMsg = dbErr.message || 'Supabase exception';
      }
    }

    if (!isSaved) {
      if (isSupabaseConfigured && dbErrorMsg) {
        return NextResponse.json({ error: `Database error: ${dbErrorMsg}` }, { status: 500 });
      }
      const fallbackSuccess = addRecord('contacts', {
        id: newContact.id,
        name: newContact.name,
        phone: newContact.phone,
        email: newContact.email,
        city: newContact.city,
        message: newContact.message,
        createdAt: newContact.created_at
      } as any);

      if (!fallbackSuccess) {
        return NextResponse.json({ error: 'Failed to save contact message.' }, { status: 500 });
      }
    }

    // Send admin notification email and automated user receipt email concurrently and await completion
    await Promise.allSettled([
      sendEmail({
        to: 'theshadowbridgesupport@gmail.com',
        subject: `New Website Inquiry: ${newContact.name}`,
        type: 'contact_alert',
        bodyHtml: `
          <h2 style="color: #3B2A6B; font-family: Georgia, serif; font-size: 22px; font-weight: bold; margin: 0 0 12px 0;">New Contact Form Message</h2>
          <p style="margin: 0 0 24px 0; color: #4A3E5E; font-size: 14px; line-height: 1.5;">A new inquiry has been submitted through The Shadow Bridge website contact form.</p>

          <div style="background-color: #F8F5FB; border-left: 4px solid #3B2A6B; border-radius: 8px; padding: 20px; margin: 0 0 24px 0;">
            <p style="margin: 0 0 10px 0; font-size: 14px; color: #2D253A;"><strong>Name:</strong> ${newContact.name}</p>
            <p style="margin: 0 0 10px 0; font-size: 14px; color: #2D253A;"><strong>Phone:</strong> ${newContact.phone}</p>
            <p style="margin: 0 0 10px 0; font-size: 14px; color: #2D253A;"><strong>Email:</strong> <a href="mailto:${newContact.email}" style="color: #3B2A6B; text-decoration: underline;">${newContact.email}</a></p>
            <p style="margin: 0; font-size: 14px; color: #2D253A;"><strong>City:</strong> ${newContact.city}</p>
          </div>

          <div style="margin: 0 0 24px 0;">
            <p style="margin: 0 0 8px 0; font-size: 14px; font-weight: bold; color: #3B2A6B;">Message:</p>
            <div style="background-color: #ffffff; border: 1px solid #E6E2EB; border-radius: 8px; padding: 16px; color: #2D253A; font-size: 14px; line-height: 1.6; white-space: pre-wrap; word-break: break-word;">${newContact.message}</div>
          </div>

          <p style="margin: 0; font-size: 12px; color: #8C7B9E; border-top: 1px solid #E6E2EB; padding-top: 16px;"><strong>Submitted:</strong> ${new Date(newContact.created_at).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'short' })} IST</p>
        `
      }).catch(err => console.error('Admin contact alert email fail:', err)),

      sendEmail({
        to: newContact.email,
        subject: `We've Received Your Query - The Shadow Bridge`,
        type: 'contact_receipt',
        bodyHtml: `
          <h2 style="color: #3B2A6B; font-family: Georgia, serif; font-size: 20px; margin: 0 0 16px 0;">Dear ${newContact.name},</h2>
          <p style="margin: 0 0 16px 0;">Thank you for reaching out to <strong>The Shadow Bridge</strong>. We have received your query regarding our Shadow Teacher and Home Tutor services in <strong>${newContact.city}</strong>.</p>
          
          <div style="background-color: #F3EEF8; padding: 20px; border-radius: 12px; margin: 20px 0; border: 1px solid #E6E2EB;">
            <p style="margin: 0 0 8px 0; font-size: 14px; font-weight: bold; color: #3B2A6B;">What Happens Next?</p>
            <p style="margin: 0; font-size: 13px; color: #2D253A; line-height: 1.5;">Our educational advisory team is reviewing your message and will reach out to you within <strong>24 hours</strong> via phone or email.</p>
          </div>

          <p style="margin: 0 0 8px 0; font-size: 13px; color: #6A5B7C;">Your submitted message:</p>
          <blockquote style="margin: 0; padding: 12px 16px; background-color: #FAFAFA; border-left: 3px solid #C89B3C; font-style: italic; font-size: 13px; color: #555555;">"${newContact.message}"</blockquote>
        `
      }).catch(err => console.error('User contact receipt email fail:', err))
    ]);

    return NextResponse.json({ success: true, contact: newContact });
  } catch (error: any) {
    console.error('Contact API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
