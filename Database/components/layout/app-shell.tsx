import Link from "next/link";
import Image from "next/image";
import { Database, FilePlus2, Search } from "lucide-react";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-navy-950">
      <div className="broadcast-grid border-b border-white/10 bg-navy-900">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link href="/dashboard" className="flex items-center gap-3">
            <Image src="/brand/cmedia-logo-white.png" alt="CMedia Productions" width={140} height={42} className="h-10 w-auto" priority />
            <span>
              <span className="block text-xs text-slate-300">Format & Script Database</span>
            </span>
          </Link>
          <nav className="flex items-center gap-2">
            <Link className="flex h-10 items-center gap-2 rounded-md px-3 text-sm text-slate-200 hover:bg-white/[0.08]" href="/dashboard">
              <Database size={16} /> Dashboard
            </Link>
            <Link className="flex h-10 items-center gap-2 rounded-md px-3 text-sm text-slate-200 hover:bg-white/[0.08]" href="/projects/new">
              <FilePlus2 size={16} /> Nieuw project
            </Link>
            <Link className="hidden h-10 items-center gap-2 rounded-md px-3 text-sm text-slate-200 hover:bg-white/[0.08] sm:flex" href="/dashboard">
              <Search size={16} /> Zoeken
            </Link>
          </nav>
        </div>
      </div>
      {children}
    </main>
  );
}
