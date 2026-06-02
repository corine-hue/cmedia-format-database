import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export async function POST(request: Request) {
  const body = await request.json();

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return NextResponse.json({ id: crypto.randomUUID(), ...body });
  }

  const supabase = await createSupabaseServerClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });

  const { data, error } = await supabase
    .from("projects")
    .insert({
      owner_id: auth.user.id,
      title: body.title,
      type: body.type,
      status: body.status,
      content: body.data
    })
    .select("id")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  if (body.type === "Script" && body.scenes?.length) {
    await supabase.from("scenes").insert(
      body.scenes.map((scene: any) => ({
        project_id: data.id,
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
  }
  if (body.images?.length) {
    await supabase.from("images").insert(
      body.images.map((image: any) => ({
        project_id: data.id,
        storage_path: image.storage_path ?? image.url,
        url: image.url,
        alt: image.alt,
        sort_order: image.sort_order
      }))
    );
  }
  return NextResponse.json(data);
}
