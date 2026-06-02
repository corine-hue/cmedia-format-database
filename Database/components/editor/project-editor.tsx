"use client";

import { useMemo, useState } from "react";
import { DndContext, closestCenter, type DragEndEvent } from "@dnd-kit/core";
import { SortableContext, arrayMove, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Download, FileText, ImagePlus, Plus, Save } from "lucide-react";
import type { Project, ProjectImage, ProjectStatus, ProjectType, Scene } from "@/lib/types";
import { emptyDataForType, formatFields, newScene, pitchdeckPages, runOfShowFields, statuses } from "@/lib/templates";
import { Button } from "@/components/ui/button";
import { Input, Select, Textarea } from "@/components/ui/input";
import { SceneCard } from "@/components/editor/scene-card";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";

export function ProjectEditor({ initialProject }: { initialProject: Project }) {
  const [project, setProject] = useState<Project>(initialProject);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">("idle");
  const fields = useMemo(() => {
    if (project.type === "TV Format") return formatFields;
    if (project.type === "Draaiboek") return runOfShowFields;
    if (project.type === "Pitchdeck") return pitchdeckPages;
    return [];
  }, [project.type]);

  function setType(type: ProjectType) {
    setProject((current) => ({ ...current, type, data: emptyDataForType(type), scenes: type === "Script" ? [newScene()] : [] }));
  }

  function updateField(field: string, value: string) {
    setProject((current) => ({ ...current, data: { ...current.data, [field]: value }, title: field === "Titel" || field === "Cover" ? value || current.title : current.title }));
  }

  function addScene() {
    setProject((current) => ({ ...current, scenes: [...(current.scenes ?? []), newScene((current.scenes?.length ?? 0) + 1)] }));
  }

  function updateScene(scene: Scene) {
    setProject((current) => ({ ...current, scenes: current.scenes?.map((item) => (item.id === scene.id ? scene : item)) ?? [] }));
  }

  function duplicateScene(scene: Scene) {
    setProject((current) => {
      const scenes = [...(current.scenes ?? [])];
      const index = scenes.findIndex((item) => item.id === scene.id);
      scenes.splice(index + 1, 0, { ...scene, id: crypto.randomUUID(), title: `${scene.title} kopie` });
      return { ...current, scenes: renumber(scenes) };
    });
  }

  function deleteScene(id: string) {
    setProject((current) => ({ ...current, scenes: renumber((current.scenes ?? []).filter((scene) => scene.id !== id)) }));
  }

  function onDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setProject((current) => {
      const scenes = current.scenes ?? [];
      const oldIndex = scenes.findIndex((scene) => scene.id === active.id);
      const newIndex = scenes.findIndex((scene) => scene.id === over.id);
      return { ...current, scenes: renumber(arrayMove(scenes, oldIndex, newIndex)) };
    });
  }

  async function uploadImage(file: File) {
    const localImage: ProjectImage = {
      id: crypto.randomUUID(),
      url: URL.createObjectURL(file),
      alt: file.name,
      sort_order: (project.images?.length ?? 0) + 1
    };

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || project.id === "new" || project.id.startsWith("demo")) {
      setProject((current) => ({ ...current, images: [...(current.images ?? []), localImage] }));
      return;
    }

    const supabase = createSupabaseBrowserClient();
    const path = `${project.id}/${crypto.randomUUID()}-${file.name}`;
    const { error } = await supabase.storage.from("project-assets").upload(path, file);
    if (error) {
      setProject((current) => ({ ...current, images: [...(current.images ?? []), localImage] }));
      return;
    }
    const { data } = supabase.storage.from("project-assets").getPublicUrl(path);
    const image: ProjectImage = {
      id: crypto.randomUUID(),
      url: data.publicUrl,
      alt: file.name,
      sort_order: (project.images?.length ?? 0) + 1
    };
    setProject((current) => ({ ...current, images: [...(current.images ?? []), image] }));
  }

  async function saveProject() {
    setSaveState("saving");
    const isNew = project.id === "new";
    const response = await fetch(isNew ? "/api/projects" : `/api/projects/${project.id}`, {
      method: isNew ? "POST" : "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(project)
    });
    const result = await response.json();
    if (result.id && isNew) window.history.replaceState(null, "", `/projects/${result.id}`);
    setProject((current) => ({ ...current, id: result.id ?? current.id, updated_at: new Date().toISOString() }));
    setSaveState("saved");
    window.setTimeout(() => setSaveState("idle"), 1600);
  }

  function updateImageAlt(id: string, alt: string) {
    setProject((current) => ({
      ...current,
      images: current.images?.map((image) => (image.id === id ? { ...image, alt } : image)) ?? []
    }));
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="mb-8 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.26em] text-champagne">Project editor</p>
          <Input className="mt-4 h-auto border-0 bg-transparent px-0 text-5xl font-black leading-tight md:text-6xl" value={project.title} onChange={(event) => setProject({ ...project, title: event.target.value })} />
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={saveProject} disabled={saveState === "saving"}>
            <Save size={16} /> {saveState === "saving" ? "Opslaan..." : saveState === "saved" ? "Opgeslagen" : "Opslaan"}
          </Button>
          <a href={`/api/projects/${project.id}/export?type=pdf`}><Button><Download size={16} /> PDF</Button></a>
          <a href={`/api/projects/${project.id}/export?type=docx`}><Button variant="secondary"><FileText size={16} /> Word</Button></a>
        </div>
      </div>

      <section className="mb-8 grid gap-4 rounded-md border border-white/10 bg-navy-900/80 p-5 md:grid-cols-3">
        <label className="text-sm font-semibold text-slate-300">Type<Select className="mt-2" value={project.type} onChange={(event) => setType(event.target.value as ProjectType)}>
          <option>TV Format</option><option>Script</option><option>Draaiboek</option><option>Pitchdeck</option>
        </Select></label>
        <label className="text-sm font-semibold text-slate-300">Status<Select className="mt-2" value={project.status} onChange={(event) => setProject({ ...project, status: event.target.value as ProjectStatus })}>
          {statuses.map((status) => <option key={status}>{status}</option>)}
        </Select></label>
        <label className="text-sm font-semibold text-slate-300">Zender / label<Input className="mt-2" value={project.data["Platform / Zender"] ?? ""} onChange={(event) => updateField("Platform / Zender", event.target.value)} /></label>
      </section>

      {project.type === "Script" ? (
        <section className="rounded-md border border-white/10 bg-white/[0.04] p-5">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-2xl font-black">Scènes</h2>
            <Button onClick={addScene}><Plus size={16} /> Scène toevoegen</Button>
          </div>
          <DndContext collisionDetection={closestCenter} onDragEnd={onDragEnd}>
            <SortableContext items={(project.scenes ?? []).map((scene) => scene.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-4">
                {(project.scenes ?? []).map((scene) => (
                  <SceneCard key={scene.id} scene={scene} onChange={updateScene} onDuplicate={duplicateScene} onDelete={deleteScene} />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </section>
      ) : (
        <section className="grid gap-5 lg:grid-cols-2">
          {fields.map((field) => (
            <label key={field} className="block rounded-md border border-white/10 bg-white/[0.04] p-4 text-sm font-semibold text-slate-300">
              {field}
              <Textarea className="mt-3" value={project.data[field] ?? ""} onChange={(event) => updateField(field, event.target.value)} />
            </label>
          ))}
        </section>
      )}

      <section className="mt-8 rounded-md border border-white/10 bg-navy-900/80 p-5">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-2xl font-black">Afbeeldingen</h2>
          <label>
            <input className="sr-only" type="file" accept="image/*" onChange={(event) => event.target.files?.[0] && uploadImage(event.target.files[0])} />
            <span className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-md border border-white/[0.15] bg-white/[0.08] px-4 text-sm font-semibold text-white transition hover:bg-white/[0.12]">
              <ImagePlus size={16} /> Foto uploaden
            </span>
          </label>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {(project.images ?? []).map((image) => (
            <div key={image.id} className="overflow-hidden rounded-md border border-white/10 bg-white/[0.05]">
              <div className="aspect-video">
                <img src={image.url} alt={image.alt} className="h-full w-full object-cover" />
              </div>
              <Input className="rounded-none border-x-0 border-b-0" value={image.alt} onChange={(event) => updateImageAlt(image.id, event.target.value)} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function renumber(scenes: Scene[]) {
  return scenes.map((scene, index) => ({ ...scene, scene_number: index + 1 }));
}
