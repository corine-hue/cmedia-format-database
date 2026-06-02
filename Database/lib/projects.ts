import { createSupabaseServerClient } from "@/lib/supabase-server";
import { demoProject, demoProjects } from "@/lib/demo-data";
import type { DashboardProject, Project } from "@/lib/types";

export async function getProjects(): Promise<DashboardProject[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return demoProjects;

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("projects")
    .select("id,title,type,status,updated_at,profiles:owner_id(full_name)")
    .order("updated_at", { ascending: false });

  if (error || !data) return demoProjects;

  return data.map((project: any) => ({
    id: project.id,
    title: project.title,
    type: project.type,
    status: project.status,
    updated_at: project.updated_at,
    owner_name: project.profiles?.full_name ?? "CMedia"
  }));
}

export async function getProject(id: string): Promise<Project> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || id.startsWith("demo")) return demoProject;

  const supabase = await createSupabaseServerClient();
  const [{ data: project }, { data: scenes }, { data: images }] = await Promise.all([
    supabase.from("projects").select("*").eq("id", id).single(),
    supabase.from("scenes").select("*").eq("project_id", id).order("scene_number"),
    supabase.from("images").select("*").eq("project_id", id).order("sort_order")
  ]);

  return {
    id: project.id,
    title: project.title,
    type: project.type,
    status: project.status,
    updated_at: project.updated_at,
    data: project.content ?? {},
    scenes: scenes ?? [],
    images: images ?? []
  };
}
