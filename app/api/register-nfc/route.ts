// app/api/register-nfc/route.ts
import { NextResponse } from 'next/server';

const ID = '047b06ca311794'; // Used for both NFC and Product List ID

export async function POST() {
  try {
    if (!process.env.CAUSALITY_API_KEY || !process.env.CAUSALITY_API_TOKEN) {
      console.error('Missing API credentials');
      return NextResponse.json(
        { error: 'Missing API credentials' },
        { status: 500 }
      );
    }

    console.log('Registering NFC with ID:', ID);

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
        data: [ID],
        product_list_id: ID
      }),
      cache: 'no-store'
    });

    const responseText = await response.text();
    console.log('Response status:', response.status);
    console.log('Response body:', responseText);

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Failed to parse response as JSON:', responseText);
      return NextResponse.json(
        { error: 'Invalid API response format' },
        { status: 500 }
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