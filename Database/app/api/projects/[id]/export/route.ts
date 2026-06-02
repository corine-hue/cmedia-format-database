import { NextRequest } from "next/server";
import { createProjectDocx, createProjectPdf } from "@/lib/exporters";
import { getProject } from "@/lib/projects";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const type = request.nextUrl.searchParams.get("type") === "docx" ? "docx" : "pdf";
  const project = await getProject(id);

  if (type === "docx") {
    const buffer = await createProjectDocx(project);
    return new Response(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="${project.title}.docx"`
      }
    });
  }

  const buffer = await createProjectPdf(project);
  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${project.title}.pdf"`
    }
  });
}
