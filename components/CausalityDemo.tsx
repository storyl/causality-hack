'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

export function CausalityDemo() {
  const [qrCode, setQrCode] = useState<string | null>(null)
  const [deepLink, setDeepLink] = useState<string | null>(null)
  const [sessionCode, setSessionCode] = useState<string | null>(null)
  const [status, setStatus] = useState<string>('Idle')

  const initiateSession = async () => {
    setStatus('Initiating session...')
    try {
      const response = await fetch('/api/initiate-session', { method: 'POST' })
      const data = await response.json()
      if (data.status === 200) {
        setQrCode(data.qrCodeLink)
        setDeepLink(data.deeplink)
        setSessionCode(data.qrcode)
        setStatus('Session initiated. Scan the QR code or click the link.')
      } else {
        setStatus('Failed to initiate session.')
      }
    } catch (error) {
      setStatus('Error initiating session.')
    }
  }

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    if (sessionCode) {
      interval = setInterval(async () => {
        try {
          const response = await fetch('/api/check-status', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code: sessionCode }),
          })
          const data = await response.json()
          if (data.status === 200 && data.message === 'true') {
            setStatus(`Success! NFC Tag: ${data.nfc_tag}`)
            clearInterval(interval)
          }
        } catch (error) {
          console.error('Error checking status:', error)
        }
      }, 5000)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [sessionCode])

  return (
    <div className="flex flex-col items-center space-y-4">
      <button
        onClick={initiateSession}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Initiate Session
      </button>
      <p>{status}</p>
      {qrCode && (
        <div className="mt-4">
          <Image src={qrCode} alt="QR Code" width={200} height={200} />
        </div>
      )}
      {deepLink && (
        <a
          href={deepLink}
          className="text-blue-500 hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          Open in Causality App
        </a>
      )}
    </div>
  )
}

