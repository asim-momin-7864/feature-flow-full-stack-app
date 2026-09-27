// admin server action

"use server";

import { createClient } from "@/lib/supabase/server";
// enum type
import { type statusEnumType } from "@/lib/validations";
import { profile } from "console";
import { revalidatePath } from "next/cache";
import { fromTheme } from "tailwind-merge";

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
  // check user
  const supabase = await createClient();

  const { data: user, error: authError } = await supabase.auth.getUser();

  // check auth error
  if (authError || !user) {
    return {
      success: false,
      error: authError?.message || "User not authenticated",
    };
  }

  // check role
  const { data: profile, error } = await supabase
    .from("profile")
    .select("role")
    .eq("id", user?.user?.id)
    .single();

  // check role
  if (error || !profile || profile.role !== "ADMIN") {
    return {
      success: false,
      error: "You are not authorized to perform this action",
    };
  }

  // feedback id
  const feedback_id = formData.get("feedback_id") as string;
  const updatedStatus = formData.get("status") as statusEnumType;

  // update
  await supabase
    .from("feedback")
    .update({
      status: updatedStatus,
    })
    .eq("id", feedback_id);

  //   revalidate

  revalidatePath(`/feedback/${feedback_id}`);
  revalidatePath("/");

  //
  return {
    success: true,
    message: "Status updated successfully",
  };
};
