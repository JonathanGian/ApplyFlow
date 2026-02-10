# ApplyFlow

ApplyFlow is a personal job application tracker and CRM designed to help you stay organized and productive during your job search.  
It provides a unified interface to record, track, and manage job applications, contacts, interactions, and follow-ups so no opportunity slips through the cracks.

## 🚀 What the App Will Do

ApplyFlow enables you to:

### 🧾 Track Applications

- Record every job application you submit
- Attach relevant metadata such as:
  - Company name
  - Role title
  - Job posting link
  - Location / remote type
  - Salary range (optional)
  - Notes

### 📊 Monitor Application Progress

View your applications in a pipeline with multiple stages, such as:

- Applied
- Phone Screen
- Technical Interview
- Onsite
- Offer
- Rejected

This makes it easy to see where each application currently stands.

### 📅 Manage Follow-Ups

- Set follow-up dates with each application
- See what actions are due *today* or *soon*
- Avoid missing important outreach windows

### 👥 Store Contacts

Track relevant people associated with each position such as:

- Recruiters
- Hiring managers
- Referrals

Each contact can include email, LinkedIn, phone, or role notes.

### 🗓 Log Interactions

Record all meaningful interactions related to an application, such as:

- Emails
- Calls
- Interviews
- Meeting notes

Each interaction can also set its own future follow-up.

### 🔐 Secure Multi-User Support

- Each user only sees their own data
- Future support for workspaces and sharing

Data security is enforced through strict database policies so only you — or people you explicitly invite — can access your information.

---

## 🛠 Tech Stack

| Layer            | Technology                                     |
|------------------|------------------------------------------------|
| Frontend         | Next.js (App Router + React + TypeScript).     |
| Backend          | Next.js API Route Handlers + Server Components |
| Database & Auth  | Supabase (Postgres + Auth)                     |
| Styling          | Material UI (MUI)                              |

---

## 🏁 Project Structure

applyflow/
backend/                # Next.js application with pages, API, and server logic
supabase/               # Supabase CLI migrations + config
README.md               # This file
.env.local              # Local environment variables

---

## ✅ Where We Are Today

- Supabase auth is working locally
- Login / logout UI is functional
- Local Supabase stack running via CLI
- The homepage confirms user session

---

## ⏭ Next Steps

The next development steps include:

1. **Database migrations** — create tables for:
   - Applications
   - Contacts
   - Interactions

2. **Row-Level Security (RLS)** — enforce user isolation

3. **API Routes** — CRUD endpoints for applications and associated data

4. **Frontend pages** — pipeline view, today’s follow-ups, application details

## 📚 Documentation

To help you understand and maintain the database schema, detailed documentation is provided for each major table in the Supabase schema.  
These files live in the `supabase/docs` folder and explain the structure, relationships, and security policies for each table.

- **[Contacts Documentation](supabase/docs/migrations/Contacts.md)**  
  Describes the `contacts` table, how it relates to applications, and the RLS policies protecting it.

- **[Applications Documentation](supabase/docs/migrations/Applications.md)**  
  Describes the `applications` table, its fields, and how it is secured per user.

- **[Interactions Documentation](supabase/docs/migrations/Interactions.md)**  
  Describes the `interactions` table for logging events, follow-ups, and interaction details.

---

## 🤝 Contributing

This project is open for improvement.  
Feel free to fork, open issues, or submit pull requests.

---

## 📌 License

MIT
