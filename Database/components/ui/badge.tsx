import { cn } from "@/lib/utils";
import type { ProjectStatus } from "@/lib/types";

const statusTone: Record<ProjectStatus, string> = {
  Concept: "bg-slate-500/15 text-slate-200",
  "In ontwikkeling": "bg-blue-500/15 text-blue-100",
  "Intern review": "bg-amber-500/15 text-amber-100",
  Verstuurd: "bg-purple-500/15 text-purple-100",
  Goedgekeurd: "bg-emerald-500/15 text-emerald-100",
  "In productie": "bg-champagne/[0.20] text-champagne"
};

export function StatusBadge({ status }: { status: ProjectStatus }) {
  return <span className={cn("rounded-full px-3 py-1 text-xs font-semibold", statusTone[status])}>{status}</span>;
}
