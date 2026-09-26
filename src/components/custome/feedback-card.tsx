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
import { UserAvatar } from "@/components/custome/user-avatar";

// feedback card props
export type FeedbackCardProps = {
  feedbackData: FeedbackType;
};

// color helper
export const getCategoryStyles = (category: string) => {
  switch (category?.toUpperCase()) {
    case "BUG":
      return {
        badge:
          "bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-300 border-transparent hover:bg-red-100 dark:hover:bg-red-500/20",
        cardBg:
          "bg-red-50/50 dark:bg-red-950/10 hover:bg-red-100/50 dark:hover:bg-red-950/20 border-red-100/50 dark:border-red-900/30",
      };
    case "UI":
      return {
        badge:
          "bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-300 border-transparent hover:bg-blue-100 dark:hover:bg-blue-500/20",
        cardBg:
          "bg-blue-50/50 dark:bg-blue-950/10 hover:bg-blue-100/50 dark:hover:bg-blue-950/20 border-blue-100/50 dark:border-blue-900/30",
      };
    case "FEATURE":
    default:
      return {
        badge:
          "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300 border-transparent hover:bg-emerald-100 dark:hover:bg-emerald-500/20",
        cardBg:
          "bg-emerald-50/50 dark:bg-emerald-950/10 hover:bg-emerald-100/50 dark:hover:bg-emerald-950/20 border-emerald-100/50 dark:border-emerald-900/30",
      };
  }
};

export function FeedbackCard({ feedbackData }: FeedbackCardProps) {
  const styles = getCategoryStyles(feedbackData.category);

  return (
    <Card
      className={`transition-colors cursor-pointer shadow-sm ${styles.cardBg}`}
    >
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start gap-4">
          <div className="space-y-1">
            <CardTitle className="text-xl">{feedbackData.title}</CardTitle>
            <CardDescription className="line-clamp-2">
              {feedbackData.description}
            </CardDescription>
          </div>
          <Badge variant="outline" className={styles.badge}>
            {feedbackData.category}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="h-6 w-6 shrink-0 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs uppercase overflow-hidden border relative">
            <UserAvatar 
              url={feedbackData.profile?.avatar_url} 
              fallbackText={feedbackData.profile?.full_name?.charAt(0) || "U"} 
            />
          </div>
          <span className="font-medium text-foreground/80">
            {feedbackData.profile?.full_name || "Anonymous"}
          </span>
          <span>•</span>
          <span>{new Date(feedbackData.created_at).toDateString()}</span>
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <MessageSquare className="w-4 h-4" suppressHydrationWarning />
          <span>{
            // @ts-ignore - The count exists based on our select query
            feedbackData.comment?.[0]?.count || 0
          } replies</span>
        </div>
      </CardFooter>
    </Card>
  );
}
