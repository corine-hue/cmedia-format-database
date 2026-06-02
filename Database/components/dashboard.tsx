"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Copy, Download, FilePenLine, Plus, Search, Trash2 } from "lucide-react";
import type { DashboardProject, ProjectStatus, ProjectType } from "@/lib/types";
import { projectTypes, statuses } from "@/lib/templates";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { StatusBadge } from "@/components/ui/badge";

export function Dashboard({ projects }: { projects: DashboardProject[] }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [type, setType] = useState<ProjectType | "Alle types">("Alle types");
  const [status, setStatus] = useState<ProjectStatus | "Alle statussen">("Alle statussen");

  const filtered = useMemo(() => {
    return projects.filter((project) => {
      const matchesQuery = project.title.toLowerCase().includes(query.toLowerCase());
      const matchesType = type === "Alle types" || project.type === type;
      const matchesStatus = status === "Alle statussen" || project.status === status;
      return matchesQuery && matchesType && matchesStatus;
    });
  }, [projects, query, status, type]);

  async function duplicateProject(id: string) {
    const response = await fetch(`/api/projects/${id}/duplicate`, { method: "POST" });
    const result = await response.json();
    if (result.id) router.push(`/projects/${result.id}`);
  }

  async function deleteProject(id: string) {
    await fetch(`/api/projects/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <section className="mb-10 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.26em] text-champagne">Development slate</p>
          <h1 className="mt-4 max-w-4xl text-5xl font-black leading-tight text-white md:text-6xl">
            Centrale database voor formats, scripts, draaiboeken en pitchdecks.
          </h1>
        </div>
        <div className="self-end rounded-md border border-white/10 bg-white/[0.06] p-5 shadow-broadcast">
          <div className="grid grid-cols-3 gap-4">
            <Metric label="Projecten" value={projects.length} />
            <Metric label="Review" value={projects.filter((project) => project.status === "Intern review").length} />
            <Metric label="Productie" value={projects.filter((project) => project.status === "In productie").length} />
          </div>
        </div>
      </section>

      <section className="mb-5 flex flex-col gap-3 rounded-md border border-white/10 bg-navy-900/80 p-4 md:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-2.5 text-slate-500" size={18} />
          <Input className="pl-10" placeholder="Zoek op titel, format of script..." value={query} onChange={(event) => setQuery(event.target.value)} />
        </div>
        <Select value={type} onChange={(event) => setType(event.target.value as ProjectType | "Alle types")}>
          <option>Alle types</option>
          {projectTypes.map((item) => <option key={item}>{item}</option>)}
        </Select>
        <Select value={status} onChange={(event) => setStatus(event.target.value as ProjectStatus | "Alle statussen")}>
          <option>Alle statussen</option>
          {statuses.map((item) => <option key={item}>{item}</option>)}
        </Select>
        <Link href="/projects/new">
          <Button className="w-full md:w-auto"><Plus size={16} /> Nieuw project</Button>
        </Link>
      </section>

      <section className="overflow-x-auto rounded-md border border-white/10 bg-white/[0.04]">
        <div className="min-w-[920px]">
          <div className="grid grid-cols-[1fr_150px_150px_180px_230px] border-b border-white/10 px-5 py-3 text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
            <span>Titel</span><span>Type</span><span>Status</span><span>Gewijzigd</span><span>Acties</span>
          </div>
          {filtered.map((project) => (
            <div key={project.id} className="grid grid-cols-[1fr_150px_150px_180px_230px] items-center border-b border-white/[0.08] px-5 py-4 last:border-b-0 hover:bg-white/[0.035]">
              <div>
                <Link href={`/projects/${project.id}`} className="font-semibold text-white hover:text-champagne">{project.title}</Link>
                <p className="mt-1 text-xs text-slate-500">{project.owner_name}</p>
              </div>
              <span className="text-sm text-slate-300">{project.type}</span>
              <StatusBadge status={project.status} />
              <span className="text-sm text-slate-400">{formatDate(project.updated_at)}</span>
              <div className="flex gap-1">
                <IconLink href={`/projects/${project.id}`} title="Bewerken"><FilePenLine size={16} /></IconLink>
                <IconButton title="Dupliceren" onClick={() => duplicateProject(project.id)}><Copy size={16} /></IconButton>
                <IconLink href={`/api/projects/${project.id}/export?type=pdf`} title="PDF"><Download size={16} /></IconLink>
                <IconButton title="Verwijderen" danger onClick={() => deleteProject(project.id)}><Trash2 size={16} /></IconButton>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="text-3xl font-black text-white">{value}</div>
      <div className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-400">{label}</div>
    </div>
  );
}

function IconButton({ children, title, danger, onClick }: { children: React.ReactNode; title: string; danger?: boolean; onClick: () => void }) {
  return <button title={title} onClick={onClick} className={`flex h-9 w-9 items-center justify-center rounded-md hover:bg-white/10 ${danger ? "text-red-200" : "text-slate-300"}`}>{children}</button>;
}

function IconLink({ children, href, title }: { children: React.ReactNode; href: string; title: string }) {
  return <Link title={title} href={href} className="flex h-9 w-9 items-center justify-center rounded-md text-slate-300 hover:bg-white/10">{children}</Link>;
}
