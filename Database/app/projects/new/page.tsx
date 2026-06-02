import { AppShell } from "@/components/layout/app-shell";
import { ProjectEditor } from "@/components/editor/project-editor";
import { emptyDataForType } from "@/lib/templates";
import type { Project } from "@/lib/types";

export default function NewProjectPage() {
  const project: Project = {
    id: "new",
    title: "Nieuw CMedia project",
    type: "TV Format",
    status: "Concept",
    updated_at: new Date().toISOString(),
    data: emptyDataForType("TV Format"),
    scenes: [],
    images: []
  };

  return (
    <AppShell>
      <ProjectEditor initialProject={project} />
    </AppShell>
  );
}
