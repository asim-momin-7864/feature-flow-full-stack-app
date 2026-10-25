// admin server action

"use server";

import { requireAdmin } from "@/lib/require-admin";
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
  // check admin first
  await requireAdmin();

  // data from form
  const feedbackId = formData.get("feedback_id") as string;
  const updatedStatus = formData.get("status") as statusEnumType;

  const supabase = await createClient();

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
