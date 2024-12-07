// app/api/register-nfc/route.ts
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    if (!process.env.CAUSALITY_API_KEY || !process.env.CAUSALITY_API_TOKEN) {
      return NextResponse.json(
        { error: 'Missing API credentials' },
        { status: 500 }
      );
    }

    const response = await fetch('https://causality.xyz/public/api/ammend_uids', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        key: process.env.CAUSALITY_API_KEY,
        token: process.env.CAUSALITY_API_TOKEN,
        action: 'add',
        data: ['048306ca311794']
      }),
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('NFC registration error:', error);
    return NextResponse.json(
      { error: 'Failed to register NFC' },
      { status: 500 }
    );
  }
}