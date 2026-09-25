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

// feedback data type
export type FeedbackCardType = FeedbackType & {
  id: string;
  full_name: string;
  created_at: string | Date;
  comment_count: number;
};

// feedback card props
export type FeedbackCardProps = {
  feedbackData: FeedbackCardType;
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
          <span>{feedbackData.full_name}</span>
          <span>•</span>
          <span>Oct 24, 2026</span>
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <MessageSquare className="w-4 h-4" suppressHydrationWarning />
          <span>{feedbackData.comment_count} replies</span>
        </div>
      </CardFooter>
    </Card>
  );
}
