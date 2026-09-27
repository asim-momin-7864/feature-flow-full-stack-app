"use client";
import { FeedbackType } from "@/lib/validations";
import { ArrowBigUp } from "lucide-react";
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
    (feedbackData.votes as [{ count: number }])?.[0]?.count || 0;

  // form
  const [state, formAction, isPending] = useActionState(toggleVoteAction, {
    success: false,
    message: "",
    error: "",
  });

  return (
    <form action={formAction}>
      <input type="hidden" name="feedback_id" value={feedbackData.id} />
      <input type="hidden" name="isVoted" value={String(isVoted)} />
      <button
        disabled={isPending}
        className={`group flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all font-bold bg-primary/10 shadow-sm hover:bg-primary/20 ${
          isVoted
            ? "text-primary"
            : "text-muted-foreground"
        }`}
      >
        <ArrowBigUp
          className={`w-5 h-5 transition-transform duration-300 ${
            isVoted ? "scale-110" : "group-hover:-translate-y-0.5"
          }`}
          fill={isVoted ? "currentColor" : "none"}
        />
        <span className="text-sm">{voteCount}</span>
      </button>
    </form>
  );
};

export default Upvote;
