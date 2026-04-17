"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="text-center max-w-md">
        <p className="font-display text-6xl font-bold text-destructive/20 mb-4">!</p>
        <h2 className="font-display text-2xl font-bold mb-2">
          Something went wrong
        </h2>
        <p className="text-muted-foreground mb-6 text-sm">
          حدث خطأ غير متوقع · An unexpected error occurred.
        </p>
        <button
          onClick={reset}
          className="px-6 py-2.5 rounded-full bg-primary text-primary-foreground font-medium hover:opacity-90 transition text-sm"
        >
          Try Again · حاول مجدداً
        </button>
      </div>
    </div>
  );
}
