import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || id === "new" || id.startsWith("demo")) {
    return NextResponse.json({ id, ...body, demo: true });
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("projects")
    .update({
      title: body.title,
      type: body.type,
      status: body.status,
      content: body.data,
      updated_at: new Date().toISOString()
    })
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  if (body.type === "Script") {
    await supabase.from("scenes").delete().eq("project_id", id);
    if (body.scenes?.length) {
      const { error: scenesError } = await supabase.from("scenes").insert(
        body.scenes.map((scene: any) => ({
          project_id: id,
          scene_number: scene.scene_number,
          title: scene.title,
          location: scene.location,
          day_night: scene.day_night,
          interior_exterior: scene.interior_exterior,
          cast: scene.cast,
          voice_over: scene.voice_over,
          interview_questions: scene.interview_questions,
          directing_notes: scene.directing_notes,
          camera_angles: scene.camera_angles,
          audio: scene.audio,
          music: scene.music,
          notes: scene.notes
        }))
      );
      if (scenesError) return NextResponse.json({ error: scenesError.message }, { status: 400 });
    }
  }

  await supabase.from("images").delete().eq("project_id", id);
  if (body.images?.length) {
    const { error: imagesError } = await supabase.from("images").insert(
      body.images.map((image: any) => ({
        project_id: id,
        storage_path: image.storage_path ?? image.url,
        url: image.url,
        alt: image.alt,
        sort_order: image.sort_order
      }))
    );
    if (imagesError) return NextResponse.json({ error: imagesError.message }, { status: 400 });
  }

  return NextResponse.json({ id });
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || id.startsWith("demo")) return NextResponse.json({ id });

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ id });
}
