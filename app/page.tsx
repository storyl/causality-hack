// app/page.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { QrCodeResponse, StatusCheckResponse } from './types';

const EXPECTED_NFC_ID = '048306ca311794';

export default function Home() {
  const [qrData, setQrData] = useState<QrCodeResponse | null>(null);
  const [scanStatus, setScanStatus] = useState<StatusCheckResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [registering, setRegistering] = useState(false);

  const registerNfc = async () => {
    try {
      setRegistering(true);
      setError(null);
      
      const response = await fetch('/api/register-nfc', {
        method: 'POST',
      });
      
      const data = await response.json();
      console.log('NFC Registration Response:', data);
      
      if (!response.ok || data.status !== 200) {
        throw new Error(data.error || 'Failed to register NFC');
      }

      // If successful, proceed with QR code generation
      await requestNewQrCode();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to register NFC');
      console.error('NFC registration error:', err);
    } finally {
      setRegistering(false);
    }
  };

  const requestNewQrCode = async () => {
    try {
      setLoading(true);
      setError(null);
      setScanStatus(null);
      
      const response = await fetch('/api/request-qr', {
        method: 'POST',
      });
      
      const data = await response.json();
      console.log('QR Code API Response:', data);
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate QR code');
      }

      setQrData(data);
      
      if (data.qrcode) {
        startStatusCheck(data.qrcode);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate QR code');
      console.error('QR code generation error:', err);
    } finally {
      setLoading(false);
    }
  };

  const startStatusCheck = async (code: string) => {
    let attempts = 0;
    const maxAttempts = 6;
    
    const checkStatus = async () => {
      if (attempts >= maxAttempts) return;
      
      try {
        const response = await fetch('/api/check-status', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ code }),
        });
        
        const data = await response.json();
        console.log('Status Check Response:', data);
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to check status');
        }
        
        setScanStatus(data);
        
        // Handle different status codes
        switch (data.status) {
          case 200:
            console.log('Successful scan!');
            return; // Stop polling
          case 210:
            setError('NFC tag needs to be registered first');
            return; // Stop polling
          default:
            // Continue polling for other status codes
            attempts++;
            if (attempts < maxAttempts) {
              setTimeout(checkStatus, 5000);
            }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to check scan status');
        console.error('Status check error:', err);
      }
    };
    
    checkStatus();
  };

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-md mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-center">NFC Scanner</h1>
        
        <div className="flex flex-col items-center gap-4">
          <button
            onClick={registerNfc}
            disabled={registering || loading}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400"
          >
            {registering ? 'Registering NFC...' : 'Register NFC & Generate QR'}
          </button>
        </div>

        {error && (
          <div className="p-4 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        {qrData?.qrCodeLink && (
          <div className="flex flex-col items-center space-y-4">
            <div className="relative w-[200px] h-[200px] bg-gray-100">
              <Image
                src={qrData.qrCodeLink}
                alt="QR Code"
                fill
                className="border rounded object-contain"
                unoptimized
                onError={(e) => {
                  console.error('Image failed to load:', e);
                  setError('Failed to load QR code image');
                }}
              />
            </div>
            {qrData.deeplink && (
              <a
                href={qrData.deeplink}
                className="text-blue-500 hover:underline"
              >
                Open in App
              </a>
            )}
          </div>
        )}

        {scanStatus && (
          <div className="p-4 rounded border">
            <h2 className="font-semibold mb-2">Scan Status:</h2>
            <pre className="whitespace-pre-wrap">
              {JSON.stringify(scanStatus, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </main>
  );
}