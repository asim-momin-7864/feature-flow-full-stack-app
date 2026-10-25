// src/app/error.tsx
"use client";

import { Button } from "@/components/ui/button";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center px-4">
      <h1 className="text-3xl font-bold text-destructive">
        Something went wrong!
      </h1>
      <p className="text-muted-foreground text-sm max-w-md">
        {error.message || "An unexpected error occurred."}
      </p>
      <Button onClick={() => reset()} variant="outline">
        Try again
      </Button>
    </div>
  );
}
