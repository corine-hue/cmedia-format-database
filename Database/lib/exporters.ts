import { Document, HeadingLevel, ImageRun, Packer, Paragraph, TextRun } from "docx";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import type { Project } from "@/lib/types";

function projectPairs(project: Project) {
  const content = Object.entries(project.data ?? {});
  const scenePairs =
    project.scenes?.flatMap((scene) => [
      [`Scene ${scene.scene_number}: ${scene.title || "Zonder titel"}`, scene.location],
      ["Cast", scene.cast],
      ["Voice-over", scene.voice_over],
      ["Regie", scene.directing_notes],
      ["Camera", scene.camera_angles],
      ["Audio", scene.audio],
      ["Muziek", scene.music],
      ["Notities", scene.notes]
    ]) ?? [];

  return [...content, ...scenePairs].filter(([, value]) => String(value ?? "").trim().length > 0);
}

export async function createProjectDocx(project: Project) {
  const imageParagraphs = await Promise.all(
    (project.images ?? []).map(async (image) => {
      const bytes = await fetchImageBytes(image.url);
      if (!bytes) return new Paragraph(`[Afbeelding niet bereikbaar: ${image.alt || image.url}]`);
      return new Paragraph({
        children: [
          new ImageRun({
            data: bytes,
            transformation: { width: 560, height: 315 },
            type: image.url.toLowerCase().includes(".png") ? "png" : "jpg"
          })
        ]
      });
    })
  );

  const children = [
    new Paragraph({ text: project.title, heading: HeadingLevel.TITLE }),
    new Paragraph({ children: [new TextRun({ text: `${project.type} - ${project.status}`, bold: true })] }),
    ...projectPairs(project).flatMap(([label, value]) => [
      new Paragraph({ text: label, heading: HeadingLevel.HEADING_2 }),
      new Paragraph(String(value))
    ]),
    ...(imageParagraphs.length ? [new Paragraph({ text: "Afbeeldingen", heading: HeadingLevel.HEADING_2 }), ...imageParagraphs] : [])
  ];

  const doc = new Document({ sections: [{ children }] });
  return Packer.toBuffer(doc);
}

export async function createProjectPdf(project: Project) {
  const pdf = await PDFDocument.create();
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const regular = await pdf.embedFont(StandardFonts.Helvetica);
  const gold = rgb(0.85, 0.72, 0.38);
  const navy = rgb(0.03, 0.07, 0.13);

  let page = pdf.addPage([1280, 720]);
  page.drawRectangle({ x: 0, y: 0, width: 1280, height: 720, color: navy });
  page.drawText("CMEDIA PRODUCTIONS", { x: 72, y: 612, size: 22, font: bold, color: gold });
  page.drawText(project.title, { x: 72, y: 420, size: 58, font: bold, color: rgb(1, 1, 1), maxWidth: 980 });
  page.drawText(`${project.type} / ${project.status}`, { x: 72, y: 360, size: 24, font: regular, color: gold });

  for (const [label, value] of projectPairs(project)) {
    page = pdf.addPage([1280, 720]);
    page.drawRectangle({ x: 0, y: 0, width: 1280, height: 720, color: navy });
    page.drawText(label.toUpperCase(), { x: 72, y: 612, size: 24, font: bold, color: gold });
    const text = String(value).replace(/\s+/g, " ");
    const lines = text.match(/.{1,88}(\s|$)/g) ?? [text];
    lines.slice(0, 10).forEach((line, index) => {
      page.drawText(line.trim(), {
        x: 72,
        y: 520 - index * 42,
        size: 28,
        font: regular,
        color: rgb(0.96, 0.97, 0.98)
      });
    });
  }

  for (const image of project.images ?? []) {
    const bytes = await fetchImageBytes(image.url);
    if (!bytes) continue;
    page = pdf.addPage([1280, 720]);
    page.drawRectangle({ x: 0, y: 0, width: 1280, height: 720, color: navy });
    page.drawText((image.alt || "AFBEELDING").toUpperCase(), { x: 72, y: 612, size: 24, font: bold, color: gold });
    const embedded = image.url.toLowerCase().includes(".png")
      ? await pdf.embedPng(bytes).catch(() => null)
      : await pdf.embedJpg(bytes).catch(() => null);
    if (!embedded) continue;
    const scaled = embedded.scaleToFit(1080, 500);
    page.drawImage(embedded, {
      x: 72,
      y: 90,
      width: scaled.width,
      height: scaled.height
    });
  }

  return Buffer.from(await pdf.save());
}

async function fetchImageBytes(url: string) {
  if (!url.startsWith("http")) return null;
  try {
    const response = await fetch(url);
    if (!response.ok) return null;
    return new Uint8Array(await response.arrayBuffer());
  } catch {
    return null;
  }
}
