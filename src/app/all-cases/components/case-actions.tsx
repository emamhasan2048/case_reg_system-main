"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { CaseStatus } from "@/models/Case";

type Props = {
  id: string;
  initialStatus: CaseStatus;
};

export function CaseActions({ id, initialStatus }: Props) {
  const router = useRouter();
  const [status, setStatus] = useState(initialStatus);
  const [isDeleted, setIsDeleted] = useState(false);
  const [isPending, startTransition] = useTransition();

  if (isDeleted) return null;

  async function completeCase() {
    const previousStatus = status;
    setStatus("completed");

    try {
      const response = await fetch(`/api/cases/${id}`, { method: "PATCH" });

      if (!response.ok) {
        setStatus(previousStatus);
        return;
      }

      startTransition(() => router.refresh());
    } catch {
      setStatus(previousStatus);
    }
  }

  async function deleteCase() {
    setIsDeleted(true);

    try {
      const response = await fetch(`/api/cases/${id}`, { method: "DELETE" });

      if (!response.ok) {
        setIsDeleted(false);
        return;
      }

      startTransition(() => router.refresh());
    } catch {
      setIsDeleted(false);
    }
  }

  return (
    <>
      <div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-extrabold ${
            status === "completed" ? "bg-emerald-900/70 text-emerald-200" : "bg-amber-900/70 text-amber-200"
          }`}
        >
          {status === "completed" ? "Completed" : "Pending"}
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {status !== "completed" && (
          <button
            className="rounded-md border border-emerald-700 bg-emerald-950/40 px-3 py-1.5 text-xs font-extrabold text-emerald-200 hover:bg-emerald-900/50 disabled:opacity-60"
            disabled={isPending}
            onClick={completeCase}
            type="button"
          >
            Complete
          </button>
        )}
        <button
          className="rounded-md border border-red-800 bg-red-950/40 px-3 py-1.5 text-xs font-extrabold text-red-200 hover:bg-red-900/50 disabled:opacity-60"
          disabled={isPending}
          onClick={deleteCase}
          type="button"
        >
          Delete
        </button>
      </div>
    </>
  );
}
