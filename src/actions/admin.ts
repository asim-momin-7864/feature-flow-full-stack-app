// admin server action

"use server";

import { createClient } from "@/lib/supabase/server";
// enum type
import { type statusEnumType } from "@/lib/validations";
import { revalidatePath } from "next/cache";

// action state
type ActionState = {
  success: boolean;
  message?: string;
  error?: string;
};

// server func
export const updateStatusAdminAction = async (
  prevState: ActionState,
  formData: FormData,
): Promise<ActionState> => {
  // check user loggedin
  const supabase = await createClient();
  const { data: authData, error: authError } = await supabase.auth.getUser();

  if (authError || !authData.user) {
    return {
      success: false,
      error: authError?.message || "User not authenticated",
    };
  }

  // check if user is admin
  const { data: profile, error: profileError } = await supabase
    .from("profile")
    .select("role")
    .eq("id", authData.user.id)
    .single();

  if (profileError || !profile || profile.role !== "ADMIN") {
    return {
      success: false,
      error: "You are not authorized to perform this action",
    };
  }

  // data from form
  const feedbackId = formData.get("feedback_id") as string;
  const updatedStatus = formData.get("status") as statusEnumType;

  // update the status in database
  const { error: updateError } = await supabase
    .from("feedback")
    .update({ status: updatedStatus })
    .eq("id", feedbackId);

  if (updateError) {
    return {
      success: false,
      error: updateError.message,
    };
  }

  // revalidate
  revalidatePath(`/feedback/${feedbackId}`);
  revalidatePath("/");

  return {
    success: true,
    message: "Status updated successfully",
  };
};
