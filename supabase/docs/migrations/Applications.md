# Applications Table Documentation

## Purpose

The **applications** table stores every job application created by a user.  
Each record includes company and role data, current status (stage), and optional metadata like job posting URL, salary range, job location, and next follow-up date.

This table is the central entity of ApplyFlow’s data model. Contacts and interactions are linked back to an application.

---

## Columns

| Column                      | Type               | Description                                                                 |
|-----------------------------|--------------------|-----------------------------------------------------------------------------|
| `id`                        | `uuid`             | Primary key — unique identifier for each application                        |
| `created_by`                | `uuid`             | References the Supabase Auth user who owns this application                 |
| `company`                   | `text`             | Company name                                                                |
| `role_title`                | `text`             | Job title                                                                   |
| `job_url`                   | `text`             | Optional link to the job posting                                            |
| `stage`                     | `application_stage`| Current stage of the application Enum below                                 |
| `applied_at`                | `date`             | When the application was submitted                                          |
| `next_follow_up_at`         | `date`             | Optional date for next follow-up                                            |
| `salary_min` / `salary_max` | `int`              | Optional salary range                                                       |
| `location`                  | `text`             | Job location                                                                |
| `remote_type`               | `text`             | e.g., Remote / Hybrid / On-site                                             |
| `notes`                     | `text`.            | Internal notes about the application                                        |
| `created_at`                | `timestamptz`      | Timestamp when created                                                      |
| `updated_at`                | `timestamptz`      | Timestamp when last updated                                                 |

Valid **stage** values: `Interested`, `Applied`, `Phone Screen`, `Technical Interview`, `Onsite Interview`, `Offer`, `Rejected`, `Withdrawn`, `Accepted`                                           |

---

## Relationships

- **One-to-many with contacts**: multiple Contacts can reference the same application.
- **One-to-many with interactions**: multiple Interactions can reference the same application.

---

## Security: Row Level Security (RLS)

To ensure data privacy, Row Level Security (RLS) policies are enabled on this table.  
These policies require that:

- Users can only **SELECT** their own applications
- Users can only **INSERT** or **UPDATE** applications where they are the owner
- No user can affect another user’s data even if they know the record’s ID

This is a key security layer and ensures unintentional data exposure cannot occur at the database level.  [oai_citation:1‡Supabase](https://supabase.com/docs/guides/database/postgres/row-level-security?utm_source=chatgpt.com)

---

## Notes

- Keeping application metadata structured enables analytics like conversion rates and pipeline dashboards in your UI.
