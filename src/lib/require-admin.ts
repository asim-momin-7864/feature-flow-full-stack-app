// src/lib/require-admin.ts
import { getCurrentUser } from "./get-current-user";
import { forbidden, redirect } from "next/navigation";

export async function requireAdmin() {
  const { userData, profile, isAdmin } = await getCurrentUser();

  //not loggein
  if (!userData) {
    redirect("/auth/login");
  }

  // not admin - unauthorized
  if (!isAdmin) {
    return forbidden();
  }

  return { userData, profile, isAdmin };
}
