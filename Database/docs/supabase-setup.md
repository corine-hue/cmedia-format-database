# Supabase Setup

1. Maak een Supabase-project aan.
2. Kopieer `.env.example` naar `.env.local` en vul de Supabase URL en anon key in.
3. Voer `supabase/migrations/001_initial_schema.sql` uit in de Supabase SQL editor.
4. Maak in Authentication de CMedia-gebruikers aan.
5. Voeg voor elke gebruiker een rij toe in `profiles` met rol `admin`, `editor` of `viewer`.
6. Gebruik bucket `project-assets` voor foto's, documenten en exportbestanden.
7. Optioneel: voer `supabase/seed.sql` uit voor voorbeeldprojecten en demo-accounts.

Demo-accounts uit de seed:

- `admin@cmedia.local` / `CMedia2026!`
- `editor@cmedia.local` / `CMedia2026!`
- `viewer@cmedia.local` / `CMedia2026!`

Rollen:

- `admin`: volledig beheer, inclusief gebruikersrollen en verwijderen.
- `editor`: projecten maken, aanpassen, dupliceren, exporteren en assets uploaden.
- `viewer`: projecten lezen en exports downloaden.
