# EmanBakery-HR-Alerts
Centralized HR alerts and staff communication platform for Eman Bakery's workforce.

# EmanBakery-HR-Alerts

## Project Objective
A modern, highly dynamic internal HR dashboard and automated notification system for Eman Bakery. The app processes raw employee data exported directly from the "Muqeem" portal, manages automated expiry alerts (like Iqama validity), and sends customized notifications via Email and WhatsApp. 

Currently designed for a Single Admin User.

## Tech Stack
* **Frontend:** Next.js (App Router), Tailwind CSS
* **UI Components:** Shadcn UI + Supabase UI (Native) for a premium, clean, and highly responsive dashboard experience.
* **Backend/Database:** Supabase (PostgreSQL)
* **Automation & Logic:** Supabase Edge Functions + Supabase pg_cron (for scheduled tasks)
* **Integrations:** Nodemailer/SMTP (Outlook integration for Emails), WhatsApp Cloud API/Twilio (for WhatsApp alerts), Excel parser (e.g., `xlsx` or `papaparse`).

## Core Features & AI Development Instructions

### 1. Dynamic Data Ingestion (Muqeem Excel Sync)
* **No Direct API:** Since there is no API connection to Muqeem, the admin will periodically upload the raw `.xlsx` or `.csv` file downloaded from Muqeem directly into the app.
* **AI Task:** Build an upload interface in the app. The backend must parse this uploaded file, read the headers, and automatically map them to the Supabase database. It should perform an `UPSERT` operation—updating existing employees and adding new ones without duplicating data. The database schema must be derived directly from the headers of the Muqeem file.

### 2. Interactive Dashboard
* **AI Task:** Build a comprehensive Next.js dashboard using Shadcn UI. It must instantly reflect the database updates once a new Muqeem file is uploaded. It should highlight critical alerts (e.g., Iqamas expiring in < 30 days, < 7 days, etc.) using dynamic charts and data tables with sorting/filtering capabilities.

### 3. Automated Notification Engine (Settings Panel)
This is the core functional engine of the app. The admin must be able to create completely custom alert rules from the settings UI.
* **Rule Creation:** Select criteria (e.g., "Iqama validity < 30 days").
* **Frequency:** Set how often the alert should trigger (e.g., daily, every 2 days, weekly).
* **Channels & Destinations:** * Choose Email: Input multiple destination email addresses.
    * Choose WhatsApp: Input multiple destination WhatsApp numbers.
* **AI Task:** Build a robust settings UI to save these preferences into a specific Supabase configuration table.

### 4. Integration & Testing Mechanism
* **Email Sync:** Provide settings fields for the Admin to input their Outlook SMTP credentials to route emails securely.
* **WhatsApp Sync:** Provide settings fields for WhatsApp API credentials.
* **The "Test" Button:** Every created notification rule must have a "Test Now" button in the UI. When clicked, it should instantly trigger the Supabase Edge Function to send a sample payload to the configured Email/WhatsApp, allowing the admin to verify the setup without waiting for the scheduled cron job.

## Strict Architectural Guardrails for AI
* Strictly use **Supabase Edge Functions** for processing the automated cron jobs (e.g., checking the database every morning against the custom rules and sending emails/messages). Do not run heavy scheduled tasks on the Next.js client.
* Ensure the Excel parsing logic handles edge cases (empty rows, missing data in columns) gracefully without crashing.
* Maintain strict TypeScript typing across all components.

## Setup Instructions
[AI: Please populate necessary environment variables (Supabase URL, Anon Key, SMTP, WhatsApp keys) and local running instructions here as the project develops]
