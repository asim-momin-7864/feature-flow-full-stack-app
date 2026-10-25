"use client";
// status update card

import { updateStatusAdminAction } from "@/actions/admin";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { statusEnumType } from "@/lib/validations";
import { useActionState, useRef, useState } from "react";

const items = [
  { label: "UNDER_REVIEW", value: "UNDER_REVIEW" },
  { label: "PLANNED", value: "PLANNED" },
  { label: "IN_PROGRESS", value: "IN_PROGRESS" },
  { label: "COMPLETED", value: "COMPLETED" },
];

const StatusUpdateButton = ({
  feedback_id,
  currentState,
}: {
  feedback_id: string;
  currentState: statusEnumType;
}) => {
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState(currentState as statusEnumType);

  const [state, formAction, isPending] = useActionState(
    updateStatusAdminAction,
    {
      success: false,
    },
  );

  return (
    <>
      <form action={formAction} ref={formRef}>
        <input type="hidden" name="feedback_id" value={feedback_id} />
        <Select
          disabled={isPending}
          name="status"
          value={status}
          onValueChange={(newStatus) => {
            if (newStatus) {
              setStatus(newStatus as statusEnumType);
              setTimeout(() => {
                formRef.current?.requestSubmit();
              }, 0);
            }
          }}
        >
          <SelectTrigger className="w-full sm:w-44 bg-background shadow-sm text-xs sm:text-sm">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {items.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </form>
    </>
  );
};

export default StatusUpdateButton;
