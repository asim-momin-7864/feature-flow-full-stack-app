// feedback acctions

"use server";

import { createClient } from "@/lib/supabase/server";
import { CreateFeedbackSchema } from "@/lib/validations";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// Action State - what all server actions return to form
export type ActionState = {
  success: boolean;
  errors?: {
    // this errors is only for form field errors
    title?: string[];
    category?: string[];
    description?: string[];
  };
  message?: string; // it gets success or error both messages
};

// create
export async function createFeedbackAction(
  prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  // check user is authenticated
  const supabase = await createClient();
  const { data: authData, error: authError } = await supabase.auth.getUser();

  if (authError || !authData.user) {
    return {
      success: false,
      message: authError?.message || "User not authenticated",
    };
  }

  // parse and validation
  const rawData = Object.fromEntries(formData.entries());
  const validatedData = CreateFeedbackSchema.safeParse(rawData);

  // check
  if (!validatedData.success) {
    return {
      success: false,
      errors: z.flattenError(validatedData.error).fieldErrors,
    };
  }

  // insert
  const { error } = await supabase.from("feedback").insert({
    ...validatedData.data,
    user_id: authData.user.id, // needed for RLS
  });

  // check
  if (error) {
    console.error("Error creating feedback:", error.message);
    return {
      success: false,
      message: error.message,
    };
  }

  // revalidate
  revalidatePath("/");

  return {
    success: true,
    message: "Feedback created successfully!",
  };
}

// soft delete feedback action
export async function deleteFeedbackAction(
  prevState: ActionState,
  formData: FormData,
) {
  // check user is authenticated
  const supabase = await createClient();
  // logged-in
  const { data: authData, error: authError } = await supabase.auth.getUser();

  if (authError || !authData.user) {
    return {
      success: false,
      message: authError?.message || "User not authenticated",
    };
  }

  const feedbackId = String(formData.get("id"));

  // Check if the user is an admin
  const { data: profile } = await supabase
    .from("profile")
    .select("role")
    .eq("id", authData.user.id)
    .single();

  const isAdmin = profile?.role === "ADMIN";

  // delete (soft delete)
  const { error } = await supabase
    .from("feedback")
    .update({
      is_deleted: true,
      deleted_by_admin: isAdmin,
      deleted_at: new Date(),
    })
    .eq("id", feedbackId);

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  // revalidate
  revalidatePath("/");
  // redirect home
  redirect("/");
}

// voteActionState
type VoteActionState = {
  success: boolean;
  message?: string;
  error?: string;
};

// vote toggler
export const toggleVoteAction = async (
  prevState: VoteActionState,
  formData: FormData,
): Promise<VoteActionState> => {
  // check auth
  const supabase = await createClient();
  const { data: authData, error: authError } = await supabase.auth.getUser();

  if (authError || !authData.user) {
    return {
      success: false,
      error: authError?.message || "User not authenticated",
    };
  }

  const feedbackId = String(formData.get("feedback_id"));
  const isVoted = formData.get("isVoted") === "true";

  if (isVoted) {
    // down vote
    const { error } = await supabase
      .from("votes")
      .delete()
      .eq("user_id", authData.user.id)
      .eq("feedback_id", feedbackId);

    // check error
    if (error) {
      return { success: false, error: error.message };
    }
  } else {
    // upvote
    const { error } = await supabase.from("votes").insert({
      feedback_id: feedbackId,
      user_id: authData.user.id,
    });

    if (error) {
      return { success: false, error: error.message };
    }
  }

  // revalidate
  revalidatePath("/");

  return {
    success: true,
    message: "Vote toggled successfully",
  };
};
