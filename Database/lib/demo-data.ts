import type { DashboardProject, Project } from "@/lib/types";

export const demoProjects: DashboardProject[] = [
  {
    id: "demo-format",
    title: "De Laatste Draaidag",
    type: "TV Format",
    status: "In ontwikkeling",
    updated_at: "2026-06-01T13:20:00.000Z",
    owner_name: "CMedia Editorial"
  },
  {
    id: "demo-pitchdeck",
    title: "Stad Onder Spanning",
    type: "Pitchdeck",
    status: "Intern review",
    updated_at: "2026-05-29T10:00:00.000Z",
    owner_name: "Development"
  },
  {
    id: "demo-script",
    title: "Pilot Script: De Reset",
    type: "Script",
    status: "Concept",
    updated_at: "2026-05-25T16:45:00.000Z",
    owner_name: "Script Room"
  }
];

export const demoProject: Project = {
  id: "demo-format",
  title: "De Laatste Draaidag",
  type: "TV Format",
  status: "In ontwikkeling",
  updated_at: "2026-06-01T13:20:00.000Z",
  data: {
    Titel: "De Laatste Draaidag",
    Werknaam: "Final Cut",
    Genre: "Factual entertainment",
    Doelgroep: "25-54, breed publiek",
    "Platform / Zender": "RTL / Videoland",
    Duur: "45 minuten",
    "Aantal afleveringen": "8",
    Logline: "Bekende makers reconstrueren de draaidag die hun carriere voorgoed veranderde.",
    "Korte omschrijving": "Een premium studio- en locatieformat waarin film, televisie en persoonlijke verhalen samenkomen.",
    "Format DNA": "Emotioneel, filmisch, herkenbaar en onthullend.",
    Hoofdpersonen: "Regisseurs, presentatoren, acteurs, crewleden en familie.",
    Setting: "Studio, archiefruimte en originele draailocaties.",
    Afleverstructuur: "Cold open, reconstructie, kantelpunt, reflectie en finale reveal.",
    Rubrieken: "De Call Sheet, Take Two, Het Moment, Final Word.",
    "Visuele stijl": "Donker, glossy, cinematic close-ups met gouden accenten.",
    "Tone of voice": "Intiem, urgent en professioneel.",
    "Waarom werkt dit format": "Het combineert nostalgie, vakmanschap en menselijk drama.",
    "Commerciële kansen": "Branded specials, festival-edities en streaming extensions.",
    "Productie-aanpak": "Compacte draaiblokken, archiefresearch en high-end postproductie.",
    "Toekomstige seizoenen": "Internationale makers, sportmomenten en muziekdocumentaires."
  },
  scenes: [],
  images: [
    {
      id: "img-1",
      url: "https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?q=80&w=1200&auto=format&fit=crop",
      alt: "Broadcast studio",
      sort_order: 1
    }
  ]
};
