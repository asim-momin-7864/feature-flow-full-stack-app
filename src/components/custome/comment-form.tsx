"use client";
import { createCommentAction } from "@/actions/comment";
import { useActionState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const CommentForm = ({ feedback_id }: { feedback_id: string }) => {
  // state
  const [state, formAction, isPending] = useActionState(createCommentAction, {
    success: false,
    message: "",
  });
  return (
    <Card className="sticky top-6 border-muted/60 shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-bold">Leave a comment</CardTitle>
      </CardHeader>
      <form action={formAction}>
        <input type="hidden" name="feedback_id" value={feedback_id} />
        <CardContent>
          <div className="space-y-4">
            <Textarea
              placeholder="Share your thoughts or suggest an idea..."
              className="min-h-30 resize-y focus-visible:ring-primary/50"
              name="content"
            />
            <Button type="submit" className="w-full font-semibold">
              Post Comment
            </Button>
          </div>
        </CardContent>
      </form>
    </Card>
  );
};

export default CommentForm;
