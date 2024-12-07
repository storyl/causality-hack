// app/success/page.tsx
'use client';

import Image from 'next/image';

export default function SuccessPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Product Image */}
          <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-gray-100">
            <Image
              src="/uni.png"
              alt="Exclusive Product"
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Product Details */}
          <div className="space-y-8">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">Limited Edition Product</h1>
              <p className="text-sm text-green-600 font-medium">Exclusive Access Unlocked</p>
              <div className="mt-4">
                <span className="text-3xl font-bold text-gray-900">$299.99</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <h2 className="text-lg font-medium text-gray-900">Description</h2>
                <p className="text-gray-600">
                  Congratulations on verifying your authentic product! As a reward, you now have
                  exclusive access to purchase this limited edition timepiece. Featuring premium
                  materials and expert craftsmanship, this watch is only available to verified customers.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-900">Highlights</h3>
                <ul className="list-disc list-inside text-sm text-gray-600 space-y-2">
                  <li>Limited edition - Only 100 pieces available</li>
                  <li>Swiss movement</li>
                  <li>Sapphire crystal</li>
                  <li>100m water resistance</li>
                </ul>
              </div>
            </div>

            <button 
              className="w-full bg-black text-white py-4 px-8 rounded-lg hover:bg-gray-800 transition-colors"
            >
              Add to Cart
            </button>

            <div className="mt-4 text-sm text-gray-500">
              <p>This exclusive offer is only available to verified customers.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}