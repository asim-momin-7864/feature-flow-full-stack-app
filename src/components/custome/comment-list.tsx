// fetch client list - PPR
import { createClient } from "@/lib/supabase/server";
import type { CommentType } from "@/lib/validations";
import { Suspense } from "react";

import DeleteCommentButton from "@/components/custome/delete-comment-button";
import { UserAvatar } from "@/components/custome/user-avatar";

// helper func
const CommentListFetch = async ({ feedbackId }: { feedbackId: string }) => {
  const supabase = await createClient();

  // Get current user and role to conditionally show the delete button
  const { data: authData } = await supabase.auth.getUser();
  const currentUserId = authData.user?.id;

  let isAdmin = false;

  // basic check even authenticated or not, if not then no need to run query
  if (currentUserId) {
    const { data: profile } = await supabase
      .from("profile")
      .select("role")
      .eq("id", currentUserId)
      .single();
    isAdmin = profile?.role === "ADMIN";
  }

  const { data, error } = await supabase
    .from("comment")
    .select("*, profile(full_name, avatar_url)")
    .eq("feedback_id", feedbackId)
    .order("created_at", { ascending: true }); // older comments first

  if (error || !data || data.length === 0) {
    return (
      <div className="text-muted-foreground italic p-8 border border-dashed rounded-xl bg-muted/20 text-center">
        No comments yet. Be the first to suggest something!
      </div>
    );
  }

  const commentsArray = data as unknown as CommentType[];

  return (
    <div className="space-y-6">
      {commentsArray.map((comment) => {
        const isOwner = currentUserId === comment.user_id;

        return (
          <div
            key={comment.id}
            className="flex gap-4 p-5 rounded-xl bg-card border shadow-sm"
          >
            {/* Avatar */}
            <div className="h-10 w-10 shrink-0 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm uppercase overflow-hidden border relative">
              <UserAvatar
                url={comment.profile?.avatar_url}
                fallbackText={comment.profile?.full_name?.charAt(0) || "U"}
              />
            </div>

            {/* Content */}
            <div className="flex-1 space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-sm text-foreground">
                    {comment.profile?.full_name || "Anonymous"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(comment.created_at).toLocaleDateString(
                      undefined,
                      {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      },
                    )}
                  </p>
                </div>
                {(isOwner || isAdmin) &&
                  !comment.is_deleted &&
                  !comment.deleted_at && (
                    <DeleteCommentButton
                      commentId={comment.id}
                      feedbackId={feedbackId}
                    />
                  )}
              </div>

              {comment.is_deleted || comment.deleted_at ? (
                <div className="text-sm text-muted-foreground italic border border-dashed rounded-md p-3 bg-muted/20 mt-1">
                  This comment was deleted by{" "}
                  {comment.deleted_by_admin ? "an admin" : "the author"}.
                </div>
              ) : (
                <p className="text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed">
                  {comment.content}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// main func
const CommentList = async ({ feedbackId }: { feedbackId: string }) => {
  return (
    <div>
      <Suspense>
        <CommentListFetch feedbackId={feedbackId} />
      </Suspense>
    </div>
  );
};

export default CommentList;
