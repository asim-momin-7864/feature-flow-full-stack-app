"use client";

import { Button } from "@/components/ui/button";
import { signOutAction } from "@/actions/auth";

export function LogoutButton() {
  return (
    <form action={signOutAction}>
      <Button type="submit">Logout</Button>
    </form>
  );
}
