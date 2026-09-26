// zod validations

import { z } from "zod";

// enums
export const categoryEnum = z.enum(["FEATURE", "BUG", "UI"]);
export const statusEnum = z.enum([
  "UNDER_REVIEW",
  "PLANNED",
  "IN_PROGRESS",
  "COMPLETED",
]);

export type statusEnumType = z.infer<typeof statusEnum>;

// comments input
export const CreateCommentSchema = z.object({
  content: z.string().min(3, "Comment must be at least 3 characters long"),
});

export type CommentType = z.infer<typeof CreateCommentSchema> & {
  id: string;
  user_id: string;
  feedback_id: string;
  is_deleted: boolean;
  deleted_by_admin: boolean;
  deleted_at: Date | null;
  created_at: Date;
  profile: {
    full_name: string;
    avatar_url: string;
  };
};

// feedback input
export const CreateFeedbackSchema = z.object({
  title: z.string().min(5, "Title is required"),
  description: z.string().min(5, "Description is required"),
  category: categoryEnum,
});

export type FeedbackType = z.infer<typeof CreateFeedbackSchema> & {
  id: string;
  created_at: string;
  user_id: string;
  status: statusEnumType;
  is_deleted: boolean;
  deleted_by_admin: boolean;
  deleted_at: Date | null;
  profile: {
    full_name: string;
    avatar_url: string;
  };
  comment?: CommentType[] | [{ count: number }];
};
