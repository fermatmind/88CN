import { cn } from "@/lib/utils";

export function ScoutedProfileStatus({
  status,
  indexStatus,
}: {
  status: string;
  indexStatus: string;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className={cn("rounded-md border border-terminal-border px-2 py-0.5 text-[10px] font-medium text-terminal-muted")}>
        {status}
      </span>
      <span className="rounded-md border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[10px] font-medium text-amber-300">
        {indexStatus}
      </span>
    </div>
  );
}
