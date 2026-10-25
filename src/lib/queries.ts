// query function

import { createClient } from "./supabase/server";

// check if a user has already voted on a specific feedback
// returns true if they voted, false if they havent
export const hasUserVoted = async (
  feedbackId: string,
  userId: string,
): Promise<boolean> => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("vote")
    .select("id")
    .eq("user_id", userId)
    .eq("feedback_id", feedbackId)
    .maybeSingle();

  // user has not voted
  if (error || !data) {
    return false;
  }

  return true;
};
