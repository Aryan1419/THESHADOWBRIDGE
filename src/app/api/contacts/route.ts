import { NextResponse } from 'next/server';
import { addRecord } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, email, city, message } = body;

    if (!name || !phone || !email || !city || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newContact = {
      id: 'contact-' + Math.random().toString(36).substring(2, 9),
      name,
      phone,
      email,
      city,
      message,
      createdAt: new Date().toISOString(),
    };

    const success = addRecord('contacts', newContact);
    if (!success) {
      return NextResponse.json({ error: 'Failed to write to database' }, { status: 500 });
    }

    return NextResponse.json({ success: true, contact: newContact });
  } catch (error) {
    console.error('Contact API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
