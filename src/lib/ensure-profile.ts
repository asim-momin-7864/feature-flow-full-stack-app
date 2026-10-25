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
        "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original",
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
