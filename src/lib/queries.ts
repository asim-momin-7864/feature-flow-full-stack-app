// query function

import { createClient } from "./supabase/server";
import { VotesType } from "./validations";

export const hasUserVoted = async (feedbackId: string, userId: string) => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("votes")
    .select("*")
    .eq("user_id", userId)
    .eq("feedback_id", feedbackId)
    .single();

  if (error || !data) {
    return false;
  }

  return true;
};
