import { FeedbackCard } from "@/components/custome/feedback-card";
import { createClient } from "@/lib/supabase/server";
import type { FeedbackType } from "@/lib/validations";
import { Suspense } from "react";

// The 4 columns
const statuses = [
  { id: "UNDER_REVIEW", label: "Under Review", color: "bg-orange-500" },
  { id: "PLANNED", label: "Planned", color: "bg-blue-500" },
  { id: "IN_PROGRESS", label: "In Progress", color: "bg-purple-500" },
  { id: "COMPLETED", label: "Completed", color: "bg-emerald-500" },
];

async function RoadmapBoard() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("feedback")
    .select(
      `id, created_at, user_id, title, description, category, status, is_deleted, deleted_by_admin, deleted_at,
      profile( full_name, avatar_url ),
      comment(count),
      votes(count)
      `,
    )
    .order("created_at", { ascending: false });

  const feedbacksArray = data as unknown as FeedbackType[];

  if (!feedbacksArray || error) {
    return (
      <p className="text-destructive text-center py-10">
        Error loading roadmap.
      </p>
    );
  }

  // Filter out deleted feedback so they don't show on the roadmap
  const activeFeedbacks = feedbacksArray.filter(
    (f) => !f.is_deleted && !f.deleted_at
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 w-full items-start">
      {statuses.map((statusObj) => {
        const columnFeedbacks = activeFeedbacks.filter(
          (f) => f.status === statusObj.id
        );

        return (
          <div key={statusObj.id} className="flex flex-col gap-4 bg-muted/30 p-4 rounded-2xl border">
            <div className="flex items-center gap-2 mb-1">
              <div className={`w-2.5 h-2.5 rounded-full ${statusObj.color}`} />
              <h2 className="font-semibold text-sm uppercase tracking-wider">{statusObj.label}</h2>
              <span className="text-muted-foreground text-xs font-bold ml-auto bg-background border px-2 py-0.5 rounded-full">
                {columnFeedbacks.length}
              </span>
            </div>
            
            <div className="flex flex-col gap-3">
              {columnFeedbacks.length === 0 ? (
                <div className="p-6 border border-dashed rounded-xl bg-background/50 text-muted-foreground text-center text-sm">
                  No feedback in this stage.
                </div>
              ) : (
                columnFeedbacks.map((feedback) => (
                  <FeedbackCard key={feedback.id} feedbackData={feedback} variant="compact" />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function RoadmapPage() {
  return (
    <main className="min-h-screen flex flex-col items-center">
      <div className="flex-1 w-full flex flex-col items-center">
        <div className="flex-1 flex flex-col gap-10 w-full max-w-[1400px] p-5">
          <div className="mt-10">
            <h1 className="text-3xl font-bold tracking-tight">Roadmap</h1>
            <p className="text-muted-foreground mt-2">
              See what we are currently working on and what's coming next.
            </p>
          </div>

          <Suspense
            fallback={
              <div className="w-full text-center p-20 text-muted-foreground animate-pulse">
                Loading roadmap...
              </div>
            }
          >
            <RoadmapBoard />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
