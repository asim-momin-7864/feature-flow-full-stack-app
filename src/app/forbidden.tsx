// src/app/forbidden.tsx
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function Forbidden() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center px-4">
      <h1 className="text-3xl font-bold">403 - Access Denied</h1>
      <p className="text-muted-foreground">
        You do not have admin permissions to access this feature.
      </p>
      <Link href="/" className={buttonVariants({ variant: "outline" })}>
        Back to Home
      </Link>
    </div>
  );
}
