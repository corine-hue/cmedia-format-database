import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { getProject } from "@/lib/projects";

export async function POST(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await getProject(id);

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return NextResponse.json({ id: "demo-copy", title: `${project.title} kopie` });
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("projects")
    .insert({
      title: `${project.title} kopie`,
      type: project.type,
      status: "Concept",
      content: project.data
    })
    .select("id,title")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data);
}
