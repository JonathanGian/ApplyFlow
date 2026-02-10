# Interactions Table Documentation

## Purpose

The **interactions** table represents logged events or communications related to a job application.  
This could include emails, phone calls, interviews, messages, meetings, or other significant interactions that help you track your progress.

Each interaction will have a type, summary, timestamp, and an optional follow-up date.  
Interactions are tied to an application via a foreign key reference.

---

## Columns

| Column               | Type             | Description                                            |
|----------------------|------------------|--------------------------------------------------------|
| `id`                 | `uuid`           | Primary key — unique identifier                        |
| `application_id`     | `uuid`           | Foreign key pointing to the parent application         |
| `type`               | `text`           | Category of interaction (e.g., email, call, interview) |
| `occurred_at`        | `timestamptz`    | When the interaction occurred                          |
| `summary`            | `text`           | Brief summary of what happened                         |
| `next_follow_up_at`  | `date`           | Optional date for your next action                     |
| `created_at`         | `timestamptz`    | When the record was created                            |

---

## Relationships

- Each interaction **belongs to** one application.
- A single application can have many interactions.
- The foreign key (`application_id`) references `applications.id` with cascading delete — if an application is deleted, its interactions are removed automatically.

---

## Security: Row Level Security (RLS)

To protect user data and prevent unauthorized access, RLS is enabled on this table.

RLS policies enforce that:

- Users can **read** interactions only if the interaction belongs to one of their applications
- Users can **insert**, **update**, and **delete** interactions only if the interaction is tied to an application they own

These relationships and policies are enforced at the database level using `auth.uid()` from Supabase.

---

## Usage Notes

- The `type` field is free-form text for flexibility; consider normalizing this into an enum in future for stricter schema validation.
- `next_follow_up_at` enables the creation of “Today” dashboards and follow-up reminders in the UI.
- Summary and timestamps help with activity logging and historical review.

---

## Best Practices/Reminders

- Keep documentation updated when schema changes.
