export type Role = "admin" | "editor" | "viewer";

export type ProjectStatus =
  | "Concept"
  | "In ontwikkeling"
  | "Intern review"
  | "Verstuurd"
  | "Goedgekeurd"
  | "In productie";

export type ProjectType = "TV Format" | "Script" | "Draaiboek" | "Pitchdeck";

export type Scene = {
  id: string;
  scene_number: number;
  title: string;
  location: string;
  day_night: "Dag" | "Nacht";
  interior_exterior: "Binnen" | "Buiten";
  cast: string;
  voice_over: string;
  interview_questions: string;
  directing_notes: string;
  camera_angles: string;
  audio: string;
  music: string;
  notes: string;
};

export type ProjectImage = {
  id: string;
  url: string;
  alt: string;
  sort_order: number;
};

export type Project = {
  id: string;
  title: string;
  type: ProjectType;
  status: ProjectStatus;
  updated_at: string;
  owner_name?: string;
  data: Record<string, string>;
  scenes?: Scene[];
  images?: ProjectImage[];
};

export type DashboardProject = Pick<Project, "id" | "title" | "type" | "status" | "updated_at"> & {
  owner_name?: string;
};
