// server actions for comments
"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/get-current-user";
import { createClient } from "@/lib/supabase/server";

// input schema type
const CommentSchema = z.object({
  content: z.string().min(5, "Comment is too short"),
});

// What this action returns to the form
type ActionState = {
  success: boolean;
  message?: string;
  errors?: {
    content?: string[];
  };
};

// create new comment
export const createCommentAction = async (
  prevState: ActionState,
  formData: FormData,
): Promise<ActionState> => {
  const { userData, errorMessage } = await getCurrentUser();

  if (!userData || errorMessage) {
    return {
      success: false,
      message: errorMessage || "User not authenticated",
    };
  }

  // raw data
  const rawData = Object.fromEntries(formData.entries());
  // validate
  const validatedData = CommentSchema.safeParse(rawData);

  // check
  if (!validatedData.success) {
    return {
      success: false,
      errors: z.flattenError(validatedData.error).fieldErrors,
    };
  }

  // validated data
  const { content } = validatedData.data;
  const feedbackId = String(formData.get("feedback_id"));

  // insatnce
  const supabase = await createClient();

  // insert
  const { error } = await supabase.from("comment").insert({
    content,
    user_id: userData.id,
    feedback_id: feedbackId,
  });

  // check error
  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  // revalidate
  revalidatePath(`/feedback/${feedbackId}`);

  return {
    success: true,
    message: "Comment created successfully!",
  };
};

// soft delete comment
export const deleteCommentAction = async (
  prevState: ActionState,
  formData: FormData,
): Promise<ActionState> => {
  // check user

  const { isAdmin, userData, errorMessage } = await getCurrentUser();

  if (!userData || errorMessage) {
    return {
      success: false,
      message: errorMessage || "User not authenticated",
    };
  }

  const commentId = String(formData.get("comment_id"));
  const feedbackId = String(formData.get("feedback_id"));

  const supabase = await createClient();

  // delete (soft delete)
  const { error } = await supabase
    .from("comment")
    .update({
      is_deleted: true,
      deleted_by_admin: isAdmin,
      deleted_at: new Date(),
    })
    .eq("id", commentId);

  // check error
  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  // revalidate
  revalidatePath(`/feedback/${feedbackId}`);

  return {
    success: true,
    message: "Comment deleted successfully!",
  };
};
