"use client";

import { useState } from "react";

export function UserAvatar({
  url,
  fallbackText,
}: {
  url?: string | null;
  fallbackText: string;
}) {
  const [hasError, setHasError] = useState(false);

  return (
    <>
      <span className="absolute">{fallbackText}</span>
      {url && !hasError && (
        <img
          src={url}
          alt="Avatar"
          className="absolute inset-0 w-full h-full object-cover bg-background"
          onError={() => setHasError(true)}
        />
      )}
    </>
  );
}
