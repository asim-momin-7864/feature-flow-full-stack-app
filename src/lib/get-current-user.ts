//* this function is to get current user data, check is it admin
// to avoid repetative code in components and server actions
import { User } from "@supabase/supabase-js";
import { createClient } from "./supabase/server";

// return type
type RetrunType = {
  isAdmin: boolean;
  userData: User | null;
  profile: any | null;
  errorMessage: string | null;
};

export async function getCurrentUser(): Promise<RetrunType> {
  const supabase = await createClient();

  const { data: currentUser } = await supabase.auth.getUser();

  if (!currentUser?.user) {
    return {
      isAdmin: false,
      userData: null,
      profile: null,
      errorMessage: null,
    };
  }

  // get user profile
  const { data: userProfile, error: profileError } = await supabase
    .from("profile")
    .select("*")
    .eq("id", currentUser.user.id)
    .single();

  if (profileError || !userProfile) {
    return {
      isAdmin: false,
      userData: null,
      profile: null,
      errorMessage: profileError?.message || "User profile not found",
    };
  }

  return {
    isAdmin: userProfile.role === "ADMIN",
    userData: currentUser.user,
    profile: userProfile,
    errorMessage: null,
  };
}
