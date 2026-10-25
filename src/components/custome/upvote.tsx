"use client";
import { FeedbackType } from "@/lib/validations";
import { ArrowBigUp, Loader2 } from "lucide-react";
import { toggleVoteAction } from "@/actions/feedback";
import { useActionState } from "react";

// props
const Upvote = ({
  feedbackData,
  isVoted,
}: {
  feedbackData: FeedbackType;
  isVoted: boolean;
}) => {
  const voteCount =
    feedbackData.vote_count ??
    feedbackData.upvote_count ??
    (feedbackData.votes as [{ count: number }])?.[0]?.count ??
    0;

  // form
  const [state, formAction, isPending] = useActionState(toggleVoteAction, {
    success: false,
    message: "",
    error: "",
  });

  return (
    <form action={formAction}>
      <input type="hidden" name="feedback_id" value={feedbackData.id} />
      <button
        type="submit"
        disabled={isPending}
        className={`group flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full transition-all font-bold bg-primary/10 shadow-sm hover:bg-primary/20 ${
          isPending ? "opacity-70 cursor-wait" : "cursor-pointer"
        } ${
          isVoted ? "text-primary bg-primary/20" : "text-muted-foreground"
        }`}
      >
        {isPending ? (
          <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin text-primary" />
        ) : (
          <ArrowBigUp
            className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 ${
              isVoted ? "scale-110 text-primary" : "group-hover:-translate-y-0.5"
            }`}
            fill={isVoted ? "currentColor" : "none"}
          />
        )}
        <span className="text-xs sm:text-sm">{voteCount}</span>
      </button>
    </form>
  );
};

export default Upvote;
