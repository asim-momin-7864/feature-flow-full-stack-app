"use client";

import React, { useActionState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { createFeedbackAction, type ActionState } from "@/actions/feedback";

const initialState: ActionState = {
  success: false,
  errors: {},
  message: "",
};

export default function NewFeedbackPage() {
  // state
  const [state, formAction, isPending] = useActionState(
    createFeedbackAction,
    initialState,
  );

  return (
    <div className="container max-w-2xl py-12 mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Submit Feedback</CardTitle>
          <CardDescription>
            Have an idea or found a bug? Let us know so we can improve!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-6" action={formAction}>
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                placeholder="E.g. Add dark mode support"
                required
              />
              {state?.errors?.title && (
                <p className="text-destructive text-sm font-medium">
                  {state.errors.title[0]}
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Select name="category" defaultValue="FEATURE" required>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="FEATURE">Feature Request</SelectItem>
                  <SelectItem value="BUG">Bug Report</SelectItem>
                  <SelectItem value="UI">UI / Design</SelectItem>
                </SelectContent>
              </Select>
              {state?.errors?.category && (
                <p className="text-destructive text-sm font-medium">
                  {state.errors.category[0]}
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Please describe your feedback in detail..."
                rows={5}
                required
              />
              {state?.errors?.description && (
                <p className="text-destructive text-sm font-medium">
                  {state.errors.description[0]}
                </p>
              )}
            </div>

            <div className="flex items-center gap-4 mt-4">
              <Button type="submit" disabled={isPending}>
                {isPending ? "Submitting..." : "Submit Feedback"}
              </Button>
              <Link
                href="/"
                className={buttonVariants({
                  variant: "outline",
                })}
              >
                Cancel
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
