// feedback deatils page - using PPR

import { createClient } from "@/lib/supabase/server";
import { Suspense } from "react";
import { FeedbackType } from "@/lib/validations";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
// helper component
const FeedbackDetailsHelper = async ({
  idPromise,
}: {
  idPromise: Promise<{ id: string }>;
}) => {
  // id
  const id = (await idPromise).id;

  // fetch data
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("feedback")
    .select(
      `id, created_at, user_id, title, description, category, status, is_deleted, deleted_by_admin, deleted_at,
      profile( full_name, avatar_url )`,
    )
    .eq("id", id)
    .single();

  // error
  if (error || !data) {
    return (
      <p className="text-center text-destructive py-10">
        {error?.message || "Some error in fetching"}
      </p>
    );
  }

  // type casting
  const feedbackData = data as unknown as FeedbackType;
  console.log(feedbackData);

  // render
  return (
    <div className="w-full space-y-8 animate-in fade-in duration-500">
      {/* Header Area */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Badge
            variant="secondary"
            className="px-3 py-1 text-sm font-semibold rounded-md"
          >
            {feedbackData.category}
          </Badge>
          <Badge
            variant="outline"
            className="capitalize px-3 py-1 text-sm rounded-md"
          >
            {feedbackData.status.toLowerCase().replace("_", " ")}
          </Badge>
        </div>

        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground leading-tight">
          {feedbackData.title}
        </h1>

        <div className="flex items-center gap-3 text-base text-muted-foreground pt-2">
          <span className="font-medium text-foreground">
            {feedbackData.profile?.full_name || "Anonymous"}
          </span>
          <span>•</span>
          <span>
            {new Date(feedbackData.created_at).toLocaleDateString(undefined, {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>
      </div>

      {/* Description Content */}
      <Card className="w-full border-muted/60 shadow-sm bg-card/50">
        <CardContent className="p-6 md:p-10">
          <p className="whitespace-pre-wrap leading-loose text-lg text-foreground/90">
            {feedbackData.description}
          </p>
        </CardContent>
      </Card>

      {/* Spacer for future components (upvotes, comments) */}
      <div className="h-10"></div>
    </div>
  );
};

// main componenet
const FeedbackDetailsPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  return (
    <div className="min-h-screen max-w-4xl mx-auto w-full px-4 py-12 md:py-20 flex flex-col items-start">
      <Suspense
        fallback={<p className="text-muted-foreground">Loading details...</p>}
      >
        <FeedbackDetailsHelper idPromise={params} />
      </Suspense>
    </div>
  );
};

export default FeedbackDetailsPage;
