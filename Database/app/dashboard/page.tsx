import { AppShell } from "@/components/layout/app-shell";
import { Dashboard } from "@/components/dashboard";
import { getProjects } from "@/lib/projects";

export default async function DashboardPage() {
  const projects = await getProjects();
  return (
    <AppShell>
      <Dashboard projects={projects} />
    </AppShell>
  );
}
