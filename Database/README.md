# CMedia Format & Script Database

Complete SaaS-webapplicatie voor CMedia Productions om TV-formats, scripts, draaiboeken, pitchdecks en documentaireconcepten centraal te maken, beheren, opslaan en exporteren.

## Functionaliteit

- Dashboard met zoeken, filters, statussen en projectacties.
- Projecttypes: TV Format, Script, Draaiboek en Pitchdeck.
- Script-editor met losse scènes, dupliceren, verwijderen, drag-and-drop en automatische nummering.
- Premium broadcaster-interface met donkerblauw, wit en goud/beige accenten.
- Supabase Auth, PostgreSQL, rollen en Storage.
- Middleware voor Supabase sessies en routebescherming.
- Export naar professioneel vormgegeven PDF en volledig bewerkbare Word `.docx`.
- Database schema met `users/profiles`, `projects`, `formats`, `scripts`, `scenes`, `pitchdecks`, `images` en `exports`.
- Voorbeelddata en Supabase setupdocumentatie.

## Installatie

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open daarna `http://localhost:3000/dashboard`.

## Supabase

Zie [docs/supabase-setup.md](/Users/cmedia/Documents/Database/docs/supabase-setup.md) voor de volledige setup.

## Folderstructuur

```text
app/                      Next.js routes en API endpoints
components/               UI, dashboard, editor en layout
lib/                      Types, templates, Supabase clients, data en exporters
supabase/migrations/      PostgreSQL schema, relaties, RLS en storage policies
supabase/seed.sql         Voorbeelddata
docs/                     Installatiehandleiding
```

## Productie

Gebruik Supabase als productiebackend, zet de omgevingsvariabelen in de hostingomgeving en draai:

```bash
npm run build
npm run start
```
