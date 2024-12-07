'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface ProductInfo {
  product_name: string;
  product_id: string;
  nfc_tag: string;
}

export default function VerificationClient() {
  const router = useRouter();
  const [verificationStatus, setVerificationStatus] = useState('waiting');
  const [productInfo, setProductInfo] = useState<ProductInfo | null>(null);
  const [qrCode, setQrCode] = useState(null);

  useEffect(() => {
    const initiateVerification = async () => {
      try {
        // Initialize QR code session
        const response = await fetch('/api/verify/initiate', {
          method: 'POST',
        });
        const data = await response.json();
        setQrCode(data);

        // Start polling for verification
        const interval = setInterval(async () => {
          const statusResponse = await fetch('/api/verify/status', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ code: data.qrcode }),
          });
          const statusData = await statusResponse.json();

          if (statusData.message === 'true') {
            setVerificationStatus('verified');
            setProductInfo(statusData);
            clearInterval(interval);
          }
        }, 5000);

        // Clear interval after 30 seconds
        setTimeout(() => {
          clearInterval(interval);
          if (verificationStatus === 'waiting') {
            setVerificationStatus('timeout');
          }
        }, 30000);

        return () => clearInterval(interval);
      } catch (error) {
        console.error('Verification error:', error);
        setVerificationStatus('error');
      }
    };

    initiateVerification();
  }, []);

  const renderStatus = () => {
    switch (verificationStatus) {
      case 'waiting':
        return (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Waiting for NFC verification...</p>
          </div>
        );
      case 'verified':
        return (
          <div className="text-center">
            <div className="text-green-500 text-xl mb-4">✓ Verified!</div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-bold">Product Details:</h3>
              <p>Name: {productInfo?.product_name}</p>
              <p>ID: {productInfo?.product_id}</p>
              <p>NFC Tag: {productInfo?.nfc_tag}</p>
            </div>
            <button
              onClick={() => router.push('/claim')}
              className="mt-4 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors"
            >
              Claim Prize
            </button>
          </div>
        );
      case 'timeout':
        return (
          <div className="text-center text-red-500">
            Verification timeout. Please try again.
          </div>
        );
      case 'error':
        return (
          <div className="text-center text-red-500">
            An error occurred. Please try again.
          </div>
        );
    }
  };

  return renderStatus();
}