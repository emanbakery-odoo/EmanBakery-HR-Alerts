Employee Monitor

## Objective

Build a production-grade internal web application for Eman Bakery using Next.js, Supabase, Supabase Edge Functions, and Vercel.

This system is for managing active employee residency-related data imported manually from the Muqeem platform export file.

There is no live sync with Muqeem.

So the app must support repeat uploads at any time and must update the database automatically based on the employee's Iqama number / resident ID without changing the original exported column headers.

The system must provide:

- A modern admin dashboard.
- Full employee list management.
- Advanced filtering and sorting.
- Configurable automation rules.
- Scheduled alerts.
- One-time manual alert triggers.
- Email and WhatsApp notification support.
- Audit logs for imports and automation runs.

***

## Non-Negotiable Rules

- Use Next.js App Router.
- Use Supabase for database, auth, storage, and edge functions.
- Host the frontend on Vercel.
- Build the project to be production-ready from the beginning.
- Keep architecture modular and scalable.
- Use strict TypeScript everywhere.
- Use responsive design for desktop and mobile.
- Prefer server-first architecture where practical.
- All sensitive secrets must be stored in environment variables or Supabase secrets, never hardcoded.
- The system must work autonomously as much as possible.

***

## Repository Rules

These rules are mandatory for the coding agent / Gemini CLI:

- Work only on the `main` branch.
- Do not create feature branches.
- Do not ask me to merge branches.
- Do not ask me to pull and merge manually.
- Make changes directly on `main`.
- Keep the repository always in a runnable state.
- After completing the work, commit directly to `main` and push to `origin/main`.
- If a task is large, still continue on `main`; do not switch workflow.
- Do not leave half-finished setup steps undocumented.
- Update README and setup documentation whenever architecture changes.
- Generate migrations, schema, seed data, and environment documentation as part of the project.
- If something is unclear, ask one precise question; otherwise proceed autonomously.

***

## Product Scope

This app manages employee document validity and compliance alerts based on manually uploaded Muqeem export files.

Core use cases:

- Upload the Muqeem active employees export file exactly as downloaded.
- Do not require column header changes.
- Parse and map the uploaded data as-is.
- Identify each employee primarily by Iqama number / unique resident identifier.
- Upsert employee records into Supabase.
- Update changed fields from the latest upload.
- Preserve import history and change logs.
- Show dashboard metrics and employee status summaries.
- Trigger automation based on configurable date rules.
- Send alerts through email and WhatsApp.
- Support both recurring automation and one-time manual run buttons.

***

## Main Modules

### 1. Dashboard

Create a highly modern admin dashboard.

Dashboard must show:

- Total active employees.
- Employees grouped by nationality.
- Employees with Iqama expiring soon.
- Employees with passport expiring soon.
- Employees already expired.
- Recent imports.
- Recent automation runs.
- Alert counts by channel.
- Trend widgets if useful.
- Quick action buttons.

Dashboard filters must support:

- Nationality.
- Expiry window.
- Document type.
- Active / inactive state.
- Search by employee name.
- Search by Iqama number.
- Sort by nearest expiry.
- Sort by nationality.
- Sort by employee name.
- Sort by latest updated.

***

### 2. Employee List

Create a dedicated employee list page with a powerful data table.

Requirements:

- Global search.
- Column filters.
- Sorting.
- Pagination or virtualized list.
- Export filtered results if needed.
- Click row to open employee detail page.
- Show document statuses clearly.
- Highlight expiring items visually but cleanly.
- Show last sync / import timestamp.

Each employee detail page should show:

- Core identity fields from Muqeem file.
- Iqama details.
- Passport details.
- Any other document fields available in the file.
- Current validity status.
- History of updates from imports.
- Automation eligibility preview.
- Manual action buttons where relevant.

***

### 3. Import System

The app must support repeated manual data uploads from Muqeem.

Important:

- I will always upload the file in the same raw format as downloaded from Muqeem.
- I will not rename headers.
- I will not modify columns.
- The app must adapt to the export structure as provided.

Import workflow:

1. Admin uploads the Muqeem file.
2. File is stored in Supabase Storage for audit purposes.
3. System reads the raw file.
4. System validates required identifier columns.
5. System maps records using Iqama number / resident ID.
6. Existing employee rows are updated.
7. New employee rows are inserted.
8. Employees missing from latest upload can be marked for review or inactive logic if needed.
9. Import summary is shown:
   - total rows
   - inserted
   - updated
   - unchanged
   - failed
10. A detailed import log must be saved.

The import process must be idempotent and safe to run repeatedly.

***

### 4. Automation Builder

This is one of the most important modules.

I do not want hardcoded automation rules only in backend code.

I want a proper UI inside the app where admin users can create and manage automation rules.

Automation rule builder must allow:

- Choose channel:
  - Email
  - WhatsApp
- Add multiple recipients:
  - multiple email addresses
  - multiple phone numbers
- Choose trigger basis:
  - Iqama expiry
  - Passport expiry
  - future document types should be extensible
- Choose threshold:
  - for example 15 days, 30 days, 60 days, 90 days, 3 months, etc.
- Choose run type:
  - scheduled recurring
  - one-time manual execution
- Choose schedule:
  - daily at a selected time
  - timezone aware
- Enable / disable rule.
- Name the rule.
- Add notes / description.
- Preview matching employees before saving or running.
- Save templates / preconfigured rules.
- Duplicate an existing rule.
- View run history for each rule.

Rule examples:

- Send email to selected HR emails when Iqama expiry is within 30 days.
- Send email to multiple recipients when passport expiry is within 90 days.
- Send WhatsApp to selected numbers for employees whose Iqama expires within 15 days.
- Save multiple automation rules simultaneously.

***

### 5. One-Time Manual Runs

In addition to recurring automations, I need one-click manual runs.

This means:

- I can preconfigure a rule in advance.
- Later, when needed, I can click one button and run it immediately.
- The app must use the saved rule configuration.
- It should evaluate all matching employees at that moment.
- It should send the configured email or WhatsApp alerts immediately.

Manual run screen must support:

- Preview count of matching employees.
- Preview list of matching employees.
- Confirm and run now.
- Show success / failed counts.
- Save run logs.
- Prevent accidental duplicate dispatch if clicked repeatedly.

***

## Notification Logic

Notifications must be generated from automation rules, not fixed hardcoded thresholds.

Each rule should define:

- channel
- recipients
- document type
- threshold
- schedule
- active state
- template / subject / message body
- deduplication behavior
- run history

Recommended behavior:

- Scheduled rules run automatically at the chosen time.
- Manual rules run only when admin clicks.
- Deduplicate sends per employee + rule + threshold window + run context.
- Allow rerun only with explicit force option or new run context.
- Keep full delivery logs.

***

## Channels

### Email

Email notifications will use SMTP credentials provided by me.

Use SMTP configuration for:

- SMTP host
- SMTP port
- SMTP username
- SMTP password
- from email
- from name
- optional reply-to

The app must clearly document where to store these secrets.

Recommended implementation:

- Store email secrets in Supabase Edge Function secrets if mail dispatch is performed from Edge Functions.
- Do not expose SMTP credentials to the client.
- Provide a settings page for non-secret metadata only, while real secrets stay in secure environment/secrets storage.

### WhatsApp

WhatsApp notifications must also be supported through configurable provider integration.

Design this as a provider-based module so that the app can later connect to:

- WhatsApp Business API
- Meta Cloud API
- third-party WhatsApp gateway
- custom webhook-based sender

WhatsApp configuration should support:

- API base URL
- access token / secret
- sender ID or phone number ID
- template name if template-based
- fallback plain text mode if supported

All WhatsApp secrets must remain server-side only.

***

## Suggested Architecture

### Frontend

Use Next.js App Router with:

- Server Components by default.
- Client Components only where needed.
- Server Actions for admin workflows where suitable.
- Route groups for dashboard and auth sections.
- Clean modular component structure.
- Reusable table, filter, chart, and form components.

### Backend

Use Supabase for:

- Postgres database
- Auth
- Storage
- Row-level security
- Edge Functions
- Scheduled jobs integration

### Hosting

- Frontend on Vercel.
- Database and backend services on Supabase.
- Edge Functions on Supabase.
- Environment-specific deployment ready for development and production.

***

## Suggested Pages

- `/login`
- `/dashboard`
- `/employees`
- `/employees/[id]`
- `/imports`
- `/automations`
- `/automations/[id]`
- `/automation-runs`
- `/settings/general`
- `/settings/notifications`
- `/settings/integrations`
- `/settings/users`

***

## Database Design

Create a normalized but practical schema.

Suggested tables:

### `employee_records`
Main canonical employee table.

Suggested fields:

- id
- iqama_number (unique)
- employee_name
- nationality
- passport_number
- passport_expiry_date
- iqama_expiry_date
- raw_status
- active_status
- source_last_import_id
- source_last_imported_at
- created_at
- updated_at

### `employee_imports`
Each file upload event.

Fields:

- id
- file_name
- storage_path
- uploaded_by
- imported_at
- total_rows
- inserted_count
- updated_count
- unchanged_count
- failed_count
- status
- notes

### `employee_import_rows`
Optional raw row audit table.

Fields:

- id
- import_id
- row_number
- raw_payload_json
- mapped_iqama_number
- processing_status
- error_message

### `employee_change_logs`
Track important field changes over time.

Fields:

- id
- employee_id
- import_id
- changed_fields_json
- previous_values_json
- new_values_json
- changed_at

### `automation_rules`
Configurable rules created in UI.

Fields:

- id
- name
- channel
- document_type
- threshold_value
- threshold_unit
- schedule_type
- schedule_time
- timezone
- active
- rule_config_json
- created_by
- created_at
- updated_at

### `automation_recipients`
Rule recipients.

Fields:

- id
- rule_id
- recipient_type
- recipient_value

### `automation_runs`
Each execution event.

Fields:

- id
- rule_id
- run_type
- triggered_by
- started_at
- finished_at
- matched_count
- sent_count
- failed_count
- status
- run_summary_json

### `automation_run_items`
Per employee dispatch log.

Fields:

- id
- run_id
- employee_id
- recipient
- channel
- status
- provider_message_id
- error_message
- payload_json
- created_at

### `notification_templates`
Reusable email / WhatsApp templates.

### `app_settings`
Non-secret system settings.

***

## Import Mapping Rules

The import parser must follow these rules:

- Accept the Muqeem export structure as-is.
- Preserve original headers.
- Build a mapping layer in code, not by asking the user to rename columns.
- Identify the canonical unique person record by Iqama number.
- Upsert records by Iqama number.
- Parse dates safely.
- Handle blank values gracefully.
- Keep raw import payload for traceability.
- Produce user-friendly validation errors if expected key columns are missing.

The app must be easy to maintain when the Muqeem export format remains stable.

If format changes in the future, the parser should be isolated enough to update in one place.

***

## Edge Functions

Create dedicated Supabase Edge Functions for secure server-side jobs.

Suggested functions:

- `import-muqeem-file`
- `process-import-batch`
- `evaluate-automation-rule`
- `run-automation-now`
- `dispatch-email`
- `dispatch-whatsapp`
- `daily-automation-scheduler`
- `generate-expiry-summary`
- `test-notification-channel`

Responsibilities:

- heavy parsing
- secure secret usage
- scheduled execution
- notification dispatch
- audit logging
- idempotent run protection

***

## Scheduling Strategy

Support two execution styles:

### Scheduled recurring
- Example: every day at 8:00 AM Asia/Riyadh.
- Evaluate all active rules.
- Find matching employees.
- Send notifications.
- Save logs.

### Manual one-time
- Admin clicks a saved rule.
- System evaluates current data instantly.
- Sends notifications immediately.
- Saves run details.

The scheduling system must be timezone aware and reliable.

***

## Settings Requirements

Settings area must support:

- general app settings
- notification preferences
- automation defaults
- SMTP metadata display
- WhatsApp integration metadata display
- admin user management
- template management
- test send tools
- system health indicators

Secret values must not be shown in plaintext after saving.

***

## Authentication

Implement secure admin authentication.

Phase 1 can start with admin-only access.

Suggested roles:

- super_admin
- admin
- viewer

Only admin roles should be able to:

- upload imports
- create or edit automations
- run manual alerts
- change settings
- manage integrations

***

## UI Direction

Design the application as a premium internal admin product, not a basic CRUD panel.

Requirements:

- modern clean dashboard
- compact, high-clarity layout
- dark mode support
- responsive mobile adaptation
- sticky filters where useful
- excellent table UX
- elegant charts
- fast perceived performance
- loading skeletons
- empty states
- error states
- audit visibility

For web app UI, keep page titles compact, use clear label-first controls, make primary navigation persistent, and keep dashboard hierarchy focused on metrics first and detailed tables after that .

***

## Vercel Readiness

This project will be hosted on Vercel.

So build with Vercel deployment in mind:

- proper environment variable separation
- no assumptions about local-only runtime
- production-safe Next.js config
- server/client env separation
- edge-compatible patterns where useful
- deployment documentation included
- health-check friendly setup
- easy rollback and redeploy flow

***

## Environment Variables

Document all required environment variables clearly.

### Vercel env examples
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (only if required in secure server context)
- `APP_BASE_URL`

### Supabase Edge Function secrets examples
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASS`
- `SMTP_FROM_EMAIL`
- `SMTP_FROM_NAME`
- `WHATSAPP_API_URL`
- `WHATSAPP_ACCESS_TOKEN`
- `WHATSAPP_SENDER_ID`
- `INTERNAL_WEBHOOK_SECRET`

Important rule:
- Frontend-safe values only in public env vars.
- All secrets for sending notifications must remain server-side only.

***

## Developer Experience

Set up the repository for autonomous development with:

- clear folder structure
- strict linting
- formatting
- type safety
- migration workflow
- seed data
- local setup steps
- staging/production notes
- example `.env` documentation
- reusable utility libraries
- service layer abstraction
- testable automation logic

***

## Recommended Structure

```text
/app
  /(auth)
  /(dashboard)
  /api
/components
  /dashboard
  /employees
  /automations
  /imports
  /settings
/lib
  /supabase
  /automation
  /notifications
  /parsers
  /validators
  /db
/supabase
  /migrations
  /functions
  /seed
/types
/docs
```

***

## Delivery Phases

### Phase 1
- Project setup
- Auth
- Base layout
- Employee upload/import pipeline
- Employee table
- Basic dashboard cards

### Phase 2
- Automation rules UI
- Email sending
- Manual run button
- Run logs
- Settings pages

### Phase 3
- WhatsApp sending
- Advanced filters
- Employee detail timeline
- Better charts
- Template management

### Phase 4
- Hardening
- audit improvements
- retry handling
- testing
- deployment polish
- production readiness review

***

## Acceptance Criteria

The system is complete only if all of the following work:

- I can upload the Muqeem file exactly as downloaded.
- I do not need to rename headers.
- Database updates by Iqama number correctly.
- New employees are inserted.
- Existing employees are updated.
- Dashboard reflects latest uploaded data.
- I can filter and sort employees easily.
- I can create multiple automation rules from the UI.
- I can choose email or WhatsApp per rule.
- I can enter multiple recipients.
- I can choose document type and threshold dynamically.
- I can schedule recurring runs.
- I can manually trigger one-time runs.
- Notifications are logged.
- Imports are logged.
- App is deployable on Vercel.
- Secrets are stored securely.
- Repository stays updated directly on `main`.

***

## Build Instruction

Build this project end-to-end autonomously.

Do not produce only a mock UI.

Implement real working flows, real database schema, real import logic, real automation storage, real execution logs, and real deployment-ready code.

At the end:

- ensure the app runs,
- ensure migrations are included,
- ensure README is updated,
- ensure environment variables are documented,
- ensure all work is committed on `main`,
- ensure all work is pushed to `origin/main`.

No branch workflow.
No PR workflow.
No “please merge this” workflow.
Directly complete the work on `main`.
