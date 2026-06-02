"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Copy, GripVertical, Trash2 } from "lucide-react";
import type { Scene } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input, Select, Textarea } from "@/components/ui/input";

export function SceneCard({
  scene,
  onChange,
  onDuplicate,
  onDelete
}: {
  scene: Scene;
  onChange: (scene: Scene) => void;
  onDuplicate: (scene: Scene) => void;
  onDelete: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: scene.id });
  const style = { transform: CSS.Transform.toString(transform), transition };
  const set = (key: keyof Scene, value: string) => onChange({ ...scene, [key]: value });

  return (
    <article ref={setNodeRef} style={style} className="rounded-md border border-white/10 bg-navy-900 p-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <button className="flex h-9 w-9 items-center justify-center rounded-md text-slate-400 hover:bg-white/[0.08]" {...attributes} {...listeners}>
          <GripVertical size={18} />
        </button>
        <div className="grid flex-1 gap-3 md:grid-cols-[90px_1fr_160px_160px]">
          <Input value={`#${scene.scene_number}`} readOnly />
          <Input placeholder="Scènetitel" value={scene.title} onChange={(event) => set("title", event.target.value)} />
          <Select value={scene.day_night} onChange={(event) => set("day_night", event.target.value)}>
            <option>Dag</option><option>Nacht</option>
          </Select>
          <Select value={scene.interior_exterior} onChange={(event) => set("interior_exterior", event.target.value)}>
            <option>Binnen</option><option>Buiten</option>
          </Select>
        </div>
        <Button variant="ghost" onClick={() => onDuplicate(scene)}><Copy size={16} /></Button>
        <Button variant="danger" onClick={() => onDelete(scene.id)}><Trash2 size={16} /></Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Locatie" value={scene.location} onChange={(value) => set("location", value)} />
        <Field label="Cast" value={scene.cast} onChange={(value) => set("cast", value)} />
        <Field label="Voice-over" value={scene.voice_over} onChange={(value) => set("voice_over", value)} />
        <Field label="Interviewvragen" value={scene.interview_questions} onChange={(value) => set("interview_questions", value)} />
        <Field label="Regie aanwijzingen" value={scene.directing_notes} onChange={(value) => set("directing_notes", value)} />
        <Field label="Camerastandpunten" value={scene.camera_angles} onChange={(value) => set("camera_angles", value)} />
        <Field label="Audio" value={scene.audio} onChange={(value) => set("audio", value)} />
        <Field label="Muziek" value={scene.music} onChange={(value) => set("music", value)} />
        <div className="md:col-span-2"><Field label="Notities" value={scene.notes} onChange={(value) => set("notes", value)} /></div>
      </div>
    </article>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="text-sm font-semibold text-slate-300">
      {label}
      <Textarea className="mt-2 min-h-24" value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}
