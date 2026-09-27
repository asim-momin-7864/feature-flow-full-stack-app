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

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/auth/login");
}

export type AuthState = {
  success: boolean;
  message?: string;
} | null;

export async function loginAction(
  prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { success: false, message: error.message };
  }

  redirect("/");
}

export async function signupAction(
  prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const fullName = formData.get("full-name") as string;
  const avatarUrl = formData.get("avatar-url") as string;
  const repeatPassword = formData.get("repeat-password") as string;

  if (password !== repeatPassword) {
    return { success: false, message: "Passwords do not match" };
  }

  const supabase = await createClient();
  const origin = (await headers()).get("origin") ?? "http://localhost:3000";

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
      data: {
        full_name: fullName,
        avatar_url: avatarUrl,
      },
    },
  });

  if (error) {
    return { success: false, message: error.message };
  }

  redirect("/auth/sign-up-success");
}
