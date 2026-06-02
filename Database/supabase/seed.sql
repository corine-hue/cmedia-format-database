insert into auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin
)
values
  (
    '00000000-0000-0000-0000-000000000000',
    '00000000-0000-0000-0000-000000000001',
    'authenticated',
    'authenticated',
    'admin@cmedia.local',
    crypt('CMedia2026!', gen_salt('bf')),
    now(),
    now(),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"full_name":"CMedia Admin"}'::jsonb,
    false
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    '00000000-0000-0000-0000-000000000002',
    'authenticated',
    'authenticated',
    'editor@cmedia.local',
    crypt('CMedia2026!', gen_salt('bf')),
    now(),
    now(),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"full_name":"CMedia Editor"}'::jsonb,
    false
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    '00000000-0000-0000-0000-000000000003',
    'authenticated',
    'authenticated',
    'viewer@cmedia.local',
    crypt('CMedia2026!', gen_salt('bf')),
    now(),
    now(),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"full_name":"CMedia Viewer"}'::jsonb,
    false
  )
on conflict (id) do nothing;

insert into public.profiles (id, full_name, role)
values
  ('00000000-0000-0000-0000-000000000001', 'CMedia Admin', 'admin'),
  ('00000000-0000-0000-0000-000000000002', 'CMedia Editor', 'editor'),
  ('00000000-0000-0000-0000-000000000003', 'CMedia Viewer', 'viewer')
on conflict (id) do nothing;

insert into public.projects (id, owner_id, title, type, status, content)
values
  (
    '10000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000001',
    'De Laatste Draaidag',
    'TV Format',
    'In ontwikkeling',
    '{
      "Titel":"De Laatste Draaidag",
      "Werknaam":"Final Cut",
      "Genre":"Factual entertainment",
      "Doelgroep":"25-54",
      "Platform / Zender":"RTL / Videoland",
      "Duur":"45 minuten",
      "Aantal afleveringen":"8",
      "Logline":"Bekende makers reconstrueren de draaidag die hun carriere voorgoed veranderde.",
      "Format DNA":"Cinematic, persoonlijk en onthullend.",
      "Commerciële kansen":"Branded specials, festival-edities en streaming extras."
    }'::jsonb
  ),
  (
    '10000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000002',
    'Stad Onder Spanning',
    'Pitchdeck',
    'Intern review',
    '{"Cover":"Stad Onder Spanning","Logline":"Een documentairereeks over steden op kantelpunten.","Waarom nu":"Stedelijke druk is zichtbaar, urgent en internationaal verkoopbaar."}'::jsonb
  )
on conflict (id) do nothing;

insert into public.scenes (project_id, scene_number, title, location, day_night, interior_exterior, cast, directing_notes, camera_angles)
values
  ('10000000-0000-0000-0000-000000000002', 1, 'Opening stad', 'Rotterdam centrum', 'Nacht', 'Buiten', 'Host, bewoners', 'Langzame opbouw met urgent voice-over ritme.', 'Drone, steadicam, close-ups')
on conflict do nothing;
