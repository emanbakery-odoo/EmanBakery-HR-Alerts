# EmanBakery-HR-Alerts Master Architecture

## Tech Stack
- **Framework:** Next.js App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS, Shadcn UI
- **Database:** Supabase PostgreSQL

## Database Schema Reference
- `public.employees`: Stores employee roster details.
  - `id` (UUID)
  - `name` (Text)
  - `iqama_number` (Text, Unique)
  - `iqama_expiry` (Date)
  - `nationality` (Text)
  - `job_title` (Text)
  - `department` (Text)
  - `status` (Text)
- `public.notification_settings`: Admin-configured alert criteria.

## Workflows
- **Phase 3 Data Ingestion:** Parse raw Excel files from Muqeem using `xlsx`. Execute atomic `UPSERT` via Supabase server actions matching strictly on `iqama_number` to prevent duplicate records.

## Instructions
- You can copy the `readme.md` file for project documentation.
