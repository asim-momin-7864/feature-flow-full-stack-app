// profile making function
import { createClient } from "./supabase/server";

type EnsureProfileResult = {
  profile: any | null;
  error: null | string;
};

const ensureProfile = async (): Promise<EnsureProfileResult> => {
  // instance
  const supabase = await createClient();

  const { data: currentUser, error: userError } = await supabase.auth.getUser();

  if (userError || !currentUser.user) {
    return {
      profile: null,
      error: "No user is logged-in",
    };
  }

  // user object
  const user = currentUser.user;

  // chck user has profile row
  const { data: existingProfile, error: fetchError } = await supabase
    .from("profile")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (fetchError) {
    return {
      profile: null,
      error: fetchError.message,
    };
  }

  // profile exists
  if (existingProfile) {
    return {
      profile: existingProfile,
      error: null,
    };
  }

  // create user
  const { data: newProfile, error: createError } = await supabase
    .from("profile")
    .insert({
      id: user.id,
      full_name:
        user?.user_metadata.full_name || user?.user_metadata.name || "No name",
      avatar_url:
        user?.user_metadata.avatar_url ||
        "https://imgs.search.brave.com/ajOI_7oCfnAzS075ZSCxdW3HII4j5cleOSYz3QYXXdM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pLnBp/bmltZy5jb20vb3Jp/Z2luYWxzLzBmLzY5/LzFjLzBmNjkxY2Q3/N2E4YzZkOTBmMDdi/MzVjMTBjOTU2Njhm/LmpwZw",
    });

  // check
  if (createError) {
    return {
      profile: null,
      error: createError.message,
    };
  }

  return {
    profile: newProfile,
    error: null,
  };
};

export default ensureProfile;
