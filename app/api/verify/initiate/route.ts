
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const response = await fetch('https://causality.xyz/api/requestQrCode', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        key: "$2y$10$Xz8sFyaga4OKc.l2piT3ROT0X0OrvBAt5NXUI1azSZXbBfMtyALdi",
        token: "J4p5mLBf"
      }),
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error initiating verification:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}