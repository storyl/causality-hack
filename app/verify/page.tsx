import VerificationClient from '@/components/VerificationClient';

export default function VerifyPage() {
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
        <div className="p-8">
          <h2 className="text-2xl font-bold mb-4 text-center">
            Product Verification
          </h2>
          <VerificationClient />
        </div>
      </div>
    </div>
  );
}