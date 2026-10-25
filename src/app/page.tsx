// it is server component
import { FeedbackCard } from "@/components/custome/feedback-card";
import { createClient } from "@/lib/supabase/server";
import type { FeedbackType, TrendingFeedbackType } from "@/lib/validations";
import { Suspense } from "react";
import { UserAvatar } from "@/components/custome/user-avatar";
import { ArrowUp, TrendingUp } from "lucide-react";
import Link from "next/link";
import { log } from "console";

async function FeedbackList() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("vw_feedback_details")
    .select("*")
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
      {feedbacksArray.map((feedback) => {
        // Check if the feedback is deleted
        if (feedback.is_deleted || feedback.deleted_at) {
          return (
            <div
              key={feedback.id}
              className="w-full p-6 border border-dashed rounded-xl bg-muted/20 text-muted-foreground text-center text-sm italic flex flex-col items-center gap-1"
            >
              <span>
                This feedback was deleted by{" "}
                {feedback.deleted_by_admin
                  ? "an admin"
                  : feedback.profile?.full_name || "the author"}
                .
              </span>
              {feedback.deleted_at && (
                <span className="text-xs opacity-70">
                  {new Date(feedback.deleted_at).toDateString()}
                </span>
              )}
            </div>
          );
        }

        // Normal render
        return <FeedbackCard key={feedback.id} feedbackData={feedback} />;
      })}
    </>
  );
}

async function TrendingSidebar() {
  // cacheComponents: true in next.config.ts handles caching automatically.
  // "use cache" cannot be used here because createClient() reads cookies().
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("vw_feedback_details")
    .select("id, title, vote_count, is_deleted, deleted_at, profile")
    .eq("is_deleted", false)
    .order("vote_count", { ascending: false })
    .limit(5);

  if (error) {
    console.error("TrendingSidebar error:", error.message);
  }

  if (!data || error || data.length === 0) return null;

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex items-center gap-2 text-foreground font-semibold">
        <TrendingUp className="w-5 h-5 text-primary" />
        <h2>Trending Ideas</h2>
      </div>

      <div className="flex flex-col gap-3">
        {data.map((feedback: TrendingFeedbackType) => (
          <Link
            href={`/feedback/${feedback.id}`}
            key={feedback.id}
            className="group flex flex-col gap-2 p-3 rounded-xl border bg-card shadow-xs hover:border-primary/30 hover:shadow-sm transition-all"
          >
            <h3 className="font-medium text-sm leading-tight line-clamp-2 group-hover:text-primary transition-colors">
              {feedback.title}
            </h3>

            <div className="flex items-center justify-between mt-1">
              <div className="flex items-center gap-2">
                <div className="h-5 w-5 shrink-0 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-[10px] uppercase overflow-hidden border relative">
                  <UserAvatar
                    url={feedback.profile?.avatar_url}
                    fallbackText={feedback.profile?.full_name?.charAt(0) || "U"}
                  />
                </div>
                <span className="text-xs text-muted-foreground font-medium truncate max-w-[100px]">
                  {feedback.profile?.full_name || "Anonymous"}
                </span>
              </div>

              <div className="flex items-center gap-1 text-xs font-semibold text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                <ArrowUp className="w-3 h-3 text-emerald-500" />
                <span>{feedback.vote_count ?? feedback.upvote_count ?? 0}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen flex justify-center w-full">
      <div className="w-full max-w-[1100px] p-5 flex flex-col lg:flex-row gap-10 lg:gap-16 pt-8 lg:pt-16">
        {/* Main Feed Column */}
        <div className="flex-1 flex flex-col gap-8 min-w-0">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Feedback Board
            </h1>
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

        {/* Sidebar Column */}
        <div className="w-full lg:w-80 shrink-0">
          <div className="sticky top-24">
            <Suspense
              fallback={
                <div className="animate-pulse bg-muted rounded-xl h-[400px] w-full" />
              }
            >
              <TrendingSidebar />
            </Suspense>
          </div>
        </div>
      </div>
    </main>
  );
}
