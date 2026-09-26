// maybe we need to make it client component as we add upvote interactivity
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare } from "lucide-react";
import type { FeedbackType } from "@/lib/validations";

// feedback card props
export type FeedbackCardProps = {
  feedbackData: FeedbackType;
};

export function FeedbackCard({ feedbackData }: FeedbackCardProps) {
  return (
    <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start gap-4">
          <div className="space-y-1">
            <CardTitle className="text-xl">{feedbackData.title}</CardTitle>
            <CardDescription className="line-clamp-2">
              {feedbackData.description}
            </CardDescription>
          </div>
          <Badge variant="secondary">{feedbackData.category}</Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>{feedbackData.profile?.full_name || "Anonymous"}</span>
          <span>•</span>
          <span>{new Date(feedbackData.created_at).toDateString()}</span>
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <MessageSquare className="w-4 h-4" suppressHydrationWarning />
          <span>{0} replies</span>
        </div>
      </CardFooter>
    </Card>
  );
}
