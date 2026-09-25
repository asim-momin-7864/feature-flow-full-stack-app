// it is server component
import { FeedbackCard } from "@/components/feedback-card";
import { createClient } from "@/lib/supabase/server";
import { FeedbackCardType } from "@/components/feedback-card";
import { Suspense } from "react";

async function FeedbackList() {
  const supabase = await createClient();
  const { data: feedbacksArray } = await supabase
    .from("feedback")
    .select("*")
    .order("created_at", { ascending: false });

  if (!feedbacksArray || feedbacksArray.length === 0) {
    return (
      <p className="text-muted-foreground text-center py-10">
        No feedback yet. Be the first to suggest something!
      </p>
    );
  }

  return (
    <>
      {feedbacksArray.map((feedback) => (
        <FeedbackCard key={feedback.id} feedbackData={feedback} />
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
