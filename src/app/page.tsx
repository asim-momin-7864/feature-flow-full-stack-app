// it is server component
import { FeedbackCard } from "@/components/custome/feedback-card";
import { createClient } from "@/lib/supabase/server";
import type { FeedbackType, TrendingFeedbackType } from "@/lib/validations";
import { Suspense } from "react";
import { UserAvatar } from "@/components/custome/user-avatar";
import { ArrowUp, TrendingUp } from "lucide-react";
import Link from "next/link";

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
      <div className="w-full text-center py-12 px-4 border border-dashed rounded-xl bg-muted/20">
        <p className="text-muted-foreground text-sm sm:text-base">
          No feedback yet. Be the first to suggest something!
        </p>
      </div>
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
              className="w-full p-4 sm:p-6 border border-dashed rounded-xl bg-muted/20 text-muted-foreground text-center text-xs sm:text-sm italic flex flex-col items-center gap-1"
            >
              <span>
                This feedback was deleted by{" "}
                {feedback.deleted_by_admin
                  ? "an admin"
                  : feedback.profile?.full_name || "the author"}
                .
              </span>
              {feedback.deleted_at && (
                <span className="text-[11px] sm:text-xs opacity-70">
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
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("vw_feedback_details")
    .select("id, title, vote_count, is_deleted, deleted_at, profile")
    .eq("is_deleted", false)
    .order("vote_count", { ascending: false })
    .limit(5);

  if (error) {
    console.error("TrendingSidebar error:", error.message);
    return null;
  }

  if (!data || data.length === 0) return null;

  return (
    <div className="w-full flex flex-col gap-3 sm:gap-4">
      <div className="flex items-center gap-2 text-foreground font-semibold">
        <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
        <h2 className="text-sm sm:text-base font-semibold">Trending Ideas</h2>
      </div>

      <div className="flex flex-col gap-2.5 sm:gap-3">
        {data.map((feedback: TrendingFeedbackType) => (
          <Link
            href={`/feedback/${feedback.id}`}
            key={feedback.id}
            className="group flex flex-col gap-2 p-3 sm:p-3.5 rounded-xl border bg-card shadow-xs hover:border-primary/30 hover:shadow-sm transition-all"
          >
            <h3 className="font-medium text-xs sm:text-sm leading-snug line-clamp-2 group-hover:text-primary transition-colors">
              {feedback.title}
            </h3>

            <div className="flex items-center justify-between mt-0.5">
              <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                <div className="h-5 w-5 shrink-0 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-[10px] uppercase overflow-hidden border relative">
                  <UserAvatar
                    url={feedback.profile?.avatar_url}
                    fallbackText={feedback.profile?.full_name?.charAt(0) || "U"}
                  />
                </div>
                <span className="text-[11px] sm:text-xs text-muted-foreground font-medium truncate max-w-[100px] sm:max-w-[120px]">
                  {feedback.profile?.full_name || "Anonymous"}
                </span>
              </div>

              <div className="flex items-center gap-1 text-[11px] sm:text-xs font-semibold text-muted-foreground bg-muted px-2 py-0.5 rounded-full shrink-0">
                <ArrowUp className="w-3 h-3 text-emerald-500" />
                <span>{feedback.vote_count ?? 0}</span>
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
      <div className="w-full max-w-[1100px] px-4 py-6 sm:px-6 sm:py-8 lg:p-8 flex flex-col lg:flex-row gap-8 lg:gap-12 pt-4 sm:pt-8 lg:pt-12">
        {/* Main Feed Column */}
        <div className="flex-1 flex flex-col gap-6 sm:gap-8 min-w-0">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Feedback Board
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1 sm:mt-2">
              Vote on features or submit your own ideas!
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:gap-4">
            <Suspense
              fallback={
                <div className="space-y-3">
                  <div className="h-28 rounded-xl bg-muted/40 animate-pulse" />
                  <div className="h-28 rounded-xl bg-muted/40 animate-pulse" />
                </div>
              }
            >
              <FeedbackList />
            </Suspense>
          </div>
        </div>

        {/* Sidebar Column */}
        <div className="w-full lg:w-80 shrink-0">
          <div className="lg:sticky lg:top-24">
            <Suspense
              fallback={
                <div className="animate-pulse bg-muted rounded-xl h-[280px] sm:h-[350px] w-full" />
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
