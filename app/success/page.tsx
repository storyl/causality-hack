// app/success/page.tsx
export default function SuccessPage() {
    return (
      <main className="min-h-screen p-8">
        <div className="max-w-md mx-auto text-center space-y-4">
          <h1 className="text-3xl font-bold">Success!</h1>
          <p className="text-lg">Your NFC tag has been successfully verified.</p>
        </div>
      </main>
    );
  }