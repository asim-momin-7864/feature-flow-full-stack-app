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

// feedback input
export const CreateFeedbackSchema = z.object({
  title: z.string().min(5, "Title is required"),
  description: z.string().min(5, "Description is required"),
  category: categoryEnum,
});

export type FeedbackType = z.infer<typeof CreateFeedbackSchema>;
