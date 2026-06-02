import { AppShell } from "@/components/layout/app-shell";
import { ProjectEditor } from "@/components/editor/project-editor";
import { getProject } from "@/lib/projects";

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await getProject(id);
  return (
    <AppShell>
      <ProjectEditor initialProject={project} />
    </AppShell>
  );
}
