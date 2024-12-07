// app/api/register-nfc/route.ts
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    if (!process.env.CAUSALITY_API_KEY || !process.env.CAUSALITY_API_TOKEN) {
      console.error('Missing API credentials');
      return NextResponse.json(
        { error: 'Missing API credentials' },
        { status: 500 }
      );
    }

    console.log('Attempting to register NFC with credentials:', {
      key: process.env.CAUSALITY_API_KEY?.substring(0, 4) + '...',
      token: process.env.CAUSALITY_API_TOKEN?.substring(0, 4) + '...'
    });

    const response = await fetch('https://causality.xyz/public/api/ammend_uids', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
      },
      body: JSON.stringify({
        key: process.env.CAUSALITY_API_KEY,
        token: process.env.CAUSALITY_API_TOKEN,
        action: 'add',
        data: ['048306ca311794']
      }),
      cache: 'no-store'
    });

    // Log the response details
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    // Get the response text first
    const responseText = await response.text();
    console.log('Response body:', responseText);

    // Try to parse it as JSON
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Failed to parse response as JSON:', responseText.substring(0, 200));
      return NextResponse.json(
        { error: 'Invalid API response format' },
        { status: 500 }
      );
    }

    if (!response.ok) {
      console.error('API error:', data);
      return NextResponse.json(
        { error: data.message || 'Failed to register NFC' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('NFC registration error:', error);
    return NextResponse.json(
      { error: 'Failed to register NFC' },
      { status: 500 }
    );
  }
}