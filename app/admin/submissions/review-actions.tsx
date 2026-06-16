"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Check, X, HelpCircle, Loader2 } from "lucide-react";

interface ReviewActionsProps {
  submissionId?: string;
  claimId?: string;
  type: "submission" | "claim";
}

export default function ReviewActions({ submissionId, claimId, type }: ReviewActionsProps) {
  const [status, setStatus] = useState<"idle" | "loading">("idle");
  const [message, setMessage] = useState("");

  const id = submissionId ?? claimId;
  const endpoint =
    type === "submission"
      ? `/api/admin/submissions/${id}`
      : `/api/admin/claims/${id}`;

  async function doAction(action: "approve" | "reject" | "needs_info") {
    setStatus("loading");
    setMessage("");
    try {
      const res = await fetch(endpoint, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      const json = await res.json();
      if (res.ok) {
        setMessage(`${action}d`);
        if (type === "submission" && action === "approve" && json.data?.project_id) {
          setMessage(`Approved — project created`);
        }
      } else {
        setMessage(json?.error?.detail ?? "Action failed");
      }
    } catch {
      setMessage("Network error");
    }
    setStatus("idle");
  }

  return (
    <div className="flex items-center gap-1.5">
      <button
        onClick={() => doAction("approve")}
        disabled={status === "loading"}
        className={cn(
          "inline-flex items-center gap-1 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-medium text-emerald-400",
          "hover:bg-emerald-500/20 transition-colors disabled:opacity-50"
        )}
      >
        {status === "loading" ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check className="h-3 w-3" />}
        Approve
      </button>
      <button
        onClick={() => doAction("reject")}
        disabled={status === "loading"}
        className={cn(
          "inline-flex items-center gap-1 rounded-md border border-red-500/30 bg-red-500/10 px-2.5 py-1 text-[10px] font-medium text-red-400",
          "hover:bg-red-500/20 transition-colors disabled:opacity-50"
        )}
      >
        <X className="h-3 w-3" />
        Reject
      </button>
      <button
        onClick={() => doAction("needs_info")}
        disabled={status === "loading"}
        className={cn(
          "inline-flex items-center gap-1 rounded-md border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-[10px] font-medium text-amber-400",
          "hover:bg-amber-500/20 transition-colors disabled:opacity-50"
        )}
      >
        <HelpCircle className="h-3 w-3" />
        Info
      </button>
      {message && (
        <span className="text-[10px] text-terminal-dim ml-1">{message}</span>
      )}
    </div>
  );
}
