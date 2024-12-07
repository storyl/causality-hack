import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
      const { code } = await request.json();
      const response = await fetch('https://causality.xyz/api/apiStatusCheck', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });
  
      const data = await response.json();
      return NextResponse.json(data);
    } catch (error) {
      return NextResponse.json({ error: 'Failed to check status' }, { status: 500 });
    }
  }