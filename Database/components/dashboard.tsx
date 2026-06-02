"use client";

import { useMemo, useState } from "react";
import type { ElementType, ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  CalendarClock,
  Clapperboard,
  Copy,
  Download,
  FilePenLine,
  FileText,
  Layers3,
  Plus,
  Search,
  Sparkles,
  Trash2,
  Tv
} from "lucide-react";
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

  const metrics = useMemo(() => {
    const inReview = projects.filter((project) => project.status === "Intern review").length;
    const active = projects.filter((project) => ["In ontwikkeling", "Intern review", "In productie"].includes(project.status)).length;
    const approved = projects.filter((project) => project.status === "Goedgekeurd").length;
    return [
      { label: "Projecten", value: projects.length, helper: "Totale slate", icon: Layers3 },
      { label: "Actief", value: active, helper: "In ontwikkeling", icon: Sparkles },
      { label: "Review", value: inReview, helper: "Wacht op feedback", icon: CalendarClock },
      { label: "Goedgekeurd", value: approved, helper: "Klaar voor productie", icon: Clapperboard }
    ];
  }, [projects]);

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
      <section className="mb-10 grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-champagne/30 bg-champagne/[0.10] px-4 py-2 text-xs font-black uppercase tracking-[0.24em] text-champagne">
            <Tv size={15} /> Broadcast development suite
          </div>
          <h1 className="mt-5 max-w-4xl text-5xl font-black leading-[0.98] text-white md:text-6xl">
            CMedia slate control voor formats, scripts en pitchdecks.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300">
            Beheer formats, draaiboeken, scripts en deckmateriaal vanuit een centrale redactieomgeving met snelle exports en heldere statuscontrole.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/projects/new">
              <Button className="h-11 px-5"><Plus size={17} /> Nieuw project</Button>
            </Link>
            <a href="#project-slate">
              <Button className="h-11 px-5" variant="secondary"><Search size={17} /> Bekijk slate</Button>
            </a>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {metrics.map((metric) => (
            <Metric key={metric.label} {...metric} />
          ))}
        </div>
      </section>

      <section id="project-slate" className="mb-6 rounded-md border border-white/10 bg-navy-900/90 p-4 shadow-broadcast">
        <div className="mb-4 flex flex-col justify-between gap-3 md:flex-row md:items-center">
          <div>
            <h2 className="text-2xl font-black text-white">Project slate</h2>
            <p className="mt-1 text-sm text-slate-400">{filtered.length} van {projects.length} projecten zichtbaar</p>
          </div>
          <Link href="/projects/new">
            <Button className="w-full md:w-auto"><Plus size={16} /> Nieuw project</Button>
          </Link>
        </div>
        <div className="grid gap-3 md:grid-cols-[1fr_210px_230px]">
          <div className="relative">
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
        </div>
      </section>

      {filtered.length ? (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((project) => (
            <article key={project.id} className="group overflow-hidden rounded-md border border-white/10 bg-white/[0.045] shadow-broadcast transition hover:-translate-y-0.5 hover:border-champagne/45 hover:bg-white/[0.065]">
              <div className="h-1.5 bg-gradient-to-r from-champagne via-white/60 to-transparent" />
              <div className="p-5">
                <div className="mb-5 flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-md border border-white/10 bg-navy-850 text-champagne">
                      <ProjectTypeIcon type={project.type} />
                    </span>
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">{project.type}</p>
                      <p className="mt-1 text-xs text-slate-400">{project.owner_name ?? "CMedia"}</p>
                    </div>
                  </div>
                  <StatusBadge status={project.status} />
                </div>
                <Link href={`/projects/${project.id}`} className="block text-2xl font-black leading-tight text-white transition group-hover:text-champagne">
                  {project.title}
                </Link>
                <div className="mt-5 flex items-center gap-2 text-xs text-slate-500">
                  <CalendarClock size={14} />
                  Laatst gewijzigd: {formatDate(project.updated_at)}
                </div>
                <div className="mt-5 grid grid-cols-4 gap-2 border-t border-white/10 pt-4">
                  <IconLink href={`/projects/${project.id}`} title="Bewerken"><FilePenLine size={16} /></IconLink>
                  <IconButton title="Dupliceren" onClick={() => duplicateProject(project.id)}><Copy size={16} /></IconButton>
                  <IconLink href={`/api/projects/${project.id}/export?type=pdf`} title="PDF export"><Download size={16} /></IconLink>
                  <IconButton title="Verwijderen" danger onClick={() => deleteProject(project.id)}><Trash2 size={16} /></IconButton>
                </div>
              </div>
            </article>
          ))}
        </section>
      ) : (
        <section className="rounded-md border border-dashed border-white/15 bg-white/[0.035] px-6 py-14 text-center">
          <Sparkles className="mx-auto text-champagne" size={34} />
          <h2 className="mt-4 text-2xl font-black text-white">Geen projecten gevonden</h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-400">
            Pas je zoekterm of filters aan, of start een nieuw project voor de CMedia development slate.
          </p>
          <Link href="/projects/new" className="mt-6 inline-flex">
            <Button><Plus size={16} /> Nieuw project</Button>
          </Link>
        </section>
      )}
    </div>
  );
}

function Metric({ label, value, helper, icon: Icon }: { label: string; value: number; helper: string; icon: ElementType }) {
  return (
    <div className="rounded-md border border-white/10 bg-white/[0.055] p-5">
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">{label}</span>
        <Icon className="text-champagne" size={18} />
      </div>
      <div className="mt-5 text-4xl font-black text-white">{value}</div>
      <div className="mt-1 text-sm text-slate-500">{helper}</div>
    </div>
  );
}

function ProjectTypeIcon({ type }: { type: ProjectType }) {
  const Icon = type === "TV Format" ? Tv : type === "Script" ? FileText : type === "Draaiboek" ? BookOpen : Clapperboard;
  return <Icon size={20} />;
}

function IconButton({ children, title, danger, onClick }: { children: ReactNode; title: string; danger?: boolean; onClick: () => void }) {
  return <button title={title} onClick={onClick} className={`flex h-10 w-full items-center justify-center rounded-md border border-white/10 bg-navy-900/80 transition hover:bg-white/10 ${danger ? "text-red-200" : "text-slate-300"}`}>{children}</button>;
}

function IconLink({ children, href, title }: { children: ReactNode; href: string; title: string }) {
  return <Link title={title} href={href} className="flex h-10 w-full items-center justify-center rounded-md border border-white/10 bg-navy-900/80 text-slate-300 transition hover:bg-white/10">{children}</Link>;
}
