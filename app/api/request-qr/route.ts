// app/api/request-qr/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}

export async function POST() {
  try {
    if (!process.env.CAUSALITY_API_KEY || !process.env.CAUSALITY_API_TOKEN) {
      console.error('Missing Causality credentials');
      return NextResponse.json(
        { error: 'Server configuration error' }, 
        { status: 500 }
      );
    }

    const response = await fetch('https://causality.xyz/public/api/requestQrCode', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        key: process.env.CAUSALITY_API_KEY,
        token: process.env.CAUSALITY_API_TOKEN,
      }),
      cache: 'no-store'
    });

    const responseText = await response.text();
    console.log('Response body:', responseText);

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

    return NextResponse.json(data);
  } catch (error) {
    console.error('Request QR code error:', error);
    return NextResponse.json(
      { error: 'Failed to generate QR code' }, 
      { status: 500 }
    );
  }
}