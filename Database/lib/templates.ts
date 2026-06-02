import type { ProjectStatus, ProjectType, Scene } from "@/lib/types";

export const projectTypes: ProjectType[] = ["TV Format", "Script", "Draaiboek", "Pitchdeck"];

export const statuses: ProjectStatus[] = [
  "Concept",
  "In ontwikkeling",
  "Intern review",
  "Verstuurd",
  "Goedgekeurd",
  "In productie"
];

export const formatFields = [
  "Titel",
  "Werknaam",
  "Genre",
  "Doelgroep",
  "Platform / Zender",
  "Duur",
  "Aantal afleveringen",
  "Logline",
  "Korte omschrijving",
  "Format DNA",
  "Hoofdpersonen",
  "Setting",
  "Afleverstructuur",
  "Rubrieken",
  "Visuele stijl",
  "Tone of voice",
  "Waarom werkt dit format",
  "Commerciële kansen",
  "Productie-aanpak",
  "Toekomstige seizoenen"
];

export const runOfShowFields = [
  "Tijd",
  "Onderdeel",
  "Locatie",
  "Verantwoordelijke",
  "Techniek",
  "Opmerkingen"
];

export const pitchdeckPages = [
  "Cover",
  "Logline",
  "Programma omschrijving",
  "Cast",
  "Afleveropbouw",
  "Visuele stijl",
  "Waarom nu",
  "Commerciële kansen",
  "Productie",
  "Contact"
];

export function emptyDataForType(type: ProjectType) {
  const fields = type === "TV Format" ? formatFields : type === "Draaiboek" ? runOfShowFields : pitchdeckPages;
  return Object.fromEntries(fields.map((field) => [field, ""]));
}

export function newScene(scene_number = 1): Scene {
  return {
    id: crypto.randomUUID(),
    scene_number,
    title: "",
    location: "",
    day_night: "Dag",
    interior_exterior: "Binnen",
    cast: "",
    voice_over: "",
    interview_questions: "",
    directing_notes: "",
    camera_angles: "",
    audio: "",
    music: "",
    notes: ""
  };
}
