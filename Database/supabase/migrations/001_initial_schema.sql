create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

create type app_role as enum ('admin', 'editor', 'viewer');
create type project_type as enum ('TV Format', 'Script', 'Draaiboek', 'Pitchdeck');
create type project_status as enum ('Concept', 'In ontwikkeling', 'Intern review', 'Verstuurd', 'Goedgekeurd', 'In productie');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  role app_role not null default 'editor',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.projects (
  id uuid primary key default uuid_generate_v4(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  type project_type not null,
  status project_status not null default 'Concept',
  content jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.formats (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid not null unique references public.projects(id) on delete cascade,
  logline text,
  short_description text,
  format_dna text,
  commercial_opportunities text,
  production_approach text,
  created_at timestamptz not null default now()
);

create table public.scripts (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid not null unique references public.projects(id) on delete cascade,
  synopsis text,
  created_at timestamptz not null default now()
);

create table public.scenes (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid not null references public.projects(id) on delete cascade,
  scene_number integer not null,
  title text not null default '',
  location text not null default '',
  day_night text not null default 'Dag',
  interior_exterior text not null default 'Binnen',
  cast text not null default '',
  voice_over text not null default '',
  interview_questions text not null default '',
  directing_notes text not null default '',
  camera_angles text not null default '',
  audio text not null default '',
  music text not null default '',
  notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(project_id, scene_number)
);

create table public.pitchdecks (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid not null unique references public.projects(id) on delete cascade,
  pages jsonb not null default '[]'::jsonb,
  theme jsonb not null default '{"primary":"#06111f","accent":"#d8bd7a"}'::jsonb,
  created_at timestamptz not null default now()
);

create table public.images (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid not null references public.projects(id) on delete cascade,
  storage_path text not null,
  url text not null,
  alt text not null default '',
  sort_order integer not null default 1,
  created_at timestamptz not null default now()
);

create table public.exports (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid not null references public.projects(id) on delete cascade,
  requested_by uuid not null references public.profiles(id) on delete cascade,
  export_type text not null check (export_type in ('pdf', 'docx')),
  storage_path text,
  status text not null default 'completed',
  created_at timestamptz not null default now()
);

create index projects_owner_idx on public.projects(owner_id);
create index projects_status_idx on public.projects(status);
create index projects_type_idx on public.projects(type);
create index scenes_project_idx on public.scenes(project_id);
create index images_project_idx on public.images(project_id);

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists(select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;

create or replace function public.can_edit_project(project uuid)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists(
    select 1
    from public.projects p
    join public.profiles pr on pr.id = auth.uid()
    where p.id = project
      and (p.owner_id = auth.uid() or pr.role in ('admin', 'editor'))
  );
$$;

alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.formats enable row level security;
alter table public.scripts enable row level security;
alter table public.scenes enable row level security;
alter table public.pitchdecks enable row level security;
alter table public.images enable row level security;
alter table public.exports enable row level security;

create policy "profiles are visible to authenticated users" on public.profiles for select to authenticated using (true);
create policy "admins can manage profiles" on public.profiles for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "projects can be read by authenticated users" on public.projects for select to authenticated using (true);
create policy "owners and editors create projects" on public.projects for insert to authenticated with check (
  owner_id = auth.uid() and exists(select 1 from public.profiles where id = auth.uid() and role in ('admin', 'editor'))
);
create policy "owners editors admins update projects" on public.projects for update to authenticated using (
  owner_id = auth.uid() or exists(select 1 from public.profiles where id = auth.uid() and role in ('admin', 'editor'))
);
create policy "owners admins delete projects" on public.projects for delete to authenticated using (owner_id = auth.uid() or public.is_admin());

create policy "project children readable" on public.formats for select to authenticated using (true);
create policy "project children editable" on public.formats for all to authenticated using (public.can_edit_project(project_id)) with check (public.can_edit_project(project_id));
create policy "scripts readable" on public.scripts for select to authenticated using (true);
create policy "scripts editable" on public.scripts for all to authenticated using (public.can_edit_project(project_id)) with check (public.can_edit_project(project_id));
create policy "scenes readable" on public.scenes for select to authenticated using (true);
create policy "scenes editable" on public.scenes for all to authenticated using (public.can_edit_project(project_id)) with check (public.can_edit_project(project_id));
create policy "pitchdecks readable" on public.pitchdecks for select to authenticated using (true);
create policy "pitchdecks editable" on public.pitchdecks for all to authenticated using (public.can_edit_project(project_id)) with check (public.can_edit_project(project_id));
create policy "images readable" on public.images for select to authenticated using (true);
create policy "images editable" on public.images for all to authenticated using (public.can_edit_project(project_id)) with check (public.can_edit_project(project_id));
create policy "exports readable" on public.exports for select to authenticated using (true);
create policy "exports insertable" on public.exports for insert to authenticated with check (requested_by = auth.uid());

insert into storage.buckets (id, name, public) values ('project-assets', 'project-assets', true)
on conflict (id) do nothing;

create policy "authenticated read project assets" on storage.objects for select to authenticated using (bucket_id = 'project-assets');
create policy "editors upload project assets" on storage.objects for insert to authenticated with check (
  bucket_id = 'project-assets'
  and exists(select 1 from public.profiles where id = auth.uid() and role in ('admin', 'editor'))
);
create policy "editors update project assets" on storage.objects for update to authenticated using (
  bucket_id = 'project-assets'
  and exists(select 1 from public.profiles where id = auth.uid() and role in ('admin', 'editor'))
);
