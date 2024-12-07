import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { code } = await request.json()

  try {
    const response = await fetch('https://causality.xyz/api/apiStatusCheck', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    })

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error checking status:', error)
    return NextResponse.json({ status: 500, message: 'Error checking status' })
  }
}

