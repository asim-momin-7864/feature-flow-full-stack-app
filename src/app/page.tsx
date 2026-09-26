// it is server component
import { FeedbackCard } from "@/components/custome/feedback-card";
import { createClient } from "@/lib/supabase/server";
import type { FeedbackType } from "@/lib/validations";
import { Suspense } from "react";
import Link from "next/link";
import { log } from "console";

async function FeedbackList() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("feedback")
    .select(
      `id, created_at, user_id, title, description, category, status, is_deleted, deleted_by_admin, deleted_at,
      profile( full_name, avatar_url )`, //TODO later we can add user profile pic aslo at side
    )
    .order("created_at", { ascending: false });

  const feedbacksArray = data as unknown as FeedbackType[];

  console.log(feedbacksArray);

  if (!feedbacksArray || feedbacksArray.length === 0 || error) {
    return (
      <p className="text-muted-foreground text-center py-10">
        No feedback yet. Be the first to suggest something!
      </p>
    );
  }

  return (
    <>
      {feedbacksArray.map((feedback) => (
        <Link href={`/feedback/${feedback.id}`} key={feedback.id}>
          <FeedbackCard feedbackData={feedback} />
        </Link>
      ))}
    </>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center">
      <div className="flex-1 w-full flex flex-col items-center">
        <div className="flex-1 flex flex-col gap-10 w-full max-w-3xl p-5">
          <div className="mt-10">
            <h1 className="text-3xl font-bold">Feedback Board</h1>
            <p className="text-muted-foreground mt-2">
              Vote on features or submit your own ideas!
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <Suspense
              fallback={
                <p className="text-muted-foreground animate-pulse">
                  Loading feedback...
                </p>
              }
            >
              <FeedbackList />
            </Suspense>
          </div>
        </div>
      </div>
    </main>
  );
}
