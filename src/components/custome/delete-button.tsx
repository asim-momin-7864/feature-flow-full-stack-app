"use client";

import { useActionState } from "react";
import { deleteFeedbackAction } from "@/actions/feedback";
import { Button } from "../ui/button";

const DeleteButton = ({ id }: { id: string }) => {
  // server action
  const [state, formAction, isPending] = useActionState(deleteFeedbackAction, {
    success: false,
    message: "",
  });

  // render
  return (
    <form action={formAction}>
      <input type="hidden" name="id" value={id} />
      <Button
        type="submit"
        disabled={isPending}
        variant="destructive"
        size="sm"
      >
        {isPending ? "Deleting..." : "Delete"}
      </Button>
    </form>
  );
};

export default DeleteButton;
