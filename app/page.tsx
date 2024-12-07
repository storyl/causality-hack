import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
        <div className="p-8">
          <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
            Exclusive Product
          </div>
          <h1 className="block mt-1 text-lg leading-tight font-medium text-black">
            Special Edition Item
          </h1>
          <p className="mt-2 text-gray-500">
            Purchase this exclusive item to unlock special rewards!
          </p>
          <Link 
            href="/verify"
            className="mt-4 w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors block text-center"
          >
            Purchase & Verify
          </Link>
        </div>
      </div>
    </div>
  );
}
