// app/api/check-status/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}

export async function POST(request: Request) {
  try {
    const { code, nfc_tag = '048306ca311794' } = await request.json();
    
    const response = await fetch('https://causality.xyz/public/api/apiStatusCheck', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
      },
      body: JSON.stringify({ 
        code,
        nfc_tag,
        key: process.env.CAUSALITY_API_KEY,
        token: process.env.CAUSALITY_API_TOKEN,
      }),
      cache: 'no-store'
    });

    const responseText = await response.text();
    console.log('Status check response:', responseText);
    console.log('Request payload:', { code, nfc_tag });

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Failed to parse status check response:', responseText.substring(0, 200));
      return NextResponse.json(
        { error: 'Invalid API response format' }, 
        { status: 500 }
      );
    }

    // If we get an "unapproved physical" error, we need to try to register the NFC tag first
    if (data.status === 203 && data.message === "Unapproved physical. Access denied.") {
      // Make a request to register the NFC tag
      const registerResponse = await fetch('https://causality.xyz/public/api/ammend_uids', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          key: process.env.CAUSALITY_API_KEY,
          token: process.env.CAUSALITY_API_TOKEN,
          action: 'add',
          data: [nfc_tag]
        }),
      });

      const registerData = await registerResponse.json();
      console.log('Register NFC response:', registerData);

      if (registerData.status === 200) {
        // Try the status check again after registering
        const retryResponse = await fetch('https://causality.xyz/public/api/apiStatusCheck', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({ 
            code,
            nfc_tag,
            key: process.env.CAUSALITY_API_KEY,
            token: process.env.CAUSALITY_API_TOKEN,
          }),
        });

        data = await retryResponse.json();
      }
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Status check error:', error);
    return NextResponse.json(
      { error: 'Failed to check status' }, 
      { status: 500 }
    );
  }
}