// src/app/not-found.tsx
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center px-4">
      <h1 className="text-4xl font-bold">404 - Page Not Found</h1>
      <p className="text-muted-foreground">
        The page or feedback you are looking for does not exist.
      </p>
      <Link href="/" className={buttonVariants({ variant: "default" })}>
        Go Home
      </Link>
    </div>
  );
}
