// server action for OAuth google, login, signup, signout

"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import ensureProfile from "@/lib/ensure-profile";

// google oauth
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
    return;
  }

  // redirect to google login page
  if (data.url) {
    redirect(data.url);
  }
}

// signout
export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/auth/login");
}

// auth state for login and signup
export type AuthState = {
  success: boolean;
  message?: string;
} | null;

// login func
export async function loginAction(
  prevState: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { success: false, message: error.message };
  }

  // ensure profile exists
  await ensureProfile();

  redirect("/");
}

// signup func
export async function signupAction(
  prevState: AuthState,
  formData: FormData,
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

  const { data: signUpData, error } = await supabase.auth.signUp({
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

  // If email confirmation is OFF, supabase auto-confirms the user and
  // returns a session immediately. In that case we create the profile now
  // because /auth/callback will NOT be visited.
  // If email confirmation is ON, the session is null here — profile will
  // be created later when the user clicks the email link → /auth/confirm.
  if (signUpData.session) {
    await ensureProfile();
  }

  redirect("/auth/sign-up-success");
}
