// server action for 0auth google

"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

import { headers } from "next/headers";

export async function signInWithGoogle() {
  const supabase = await createClient();
  const origin = (await headers()).get("origin") ?? "http://localhost:3000";

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${origin}/auth/callback`,
    },
  });

  // check
  if (error) {
    console.error(`OAuth Error: `, error.message);
  }

  if (data.url) {
    redirect(data.url); // Redirect to the OAuth provider's page
  }
}
