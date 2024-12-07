import { NextResponse } from 'next/server'

export async function POST() {
  const apiKey = process.env.CAUSALITY_API_KEY
  const apiToken = process.env.CAUSALITY_API_TOKEN

  if (!apiKey || !apiToken) {
    return NextResponse.json({ status: 500, message: 'API credentials not configured' })
  }

  try {
    const response = await fetch('https://causality.xyz/api/requestQrCode', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: apiKey, token: apiToken }),
    })

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error initiating session:', error)
    return NextResponse.json({ status: 500, message: 'Error initiating session' })
  }
}

