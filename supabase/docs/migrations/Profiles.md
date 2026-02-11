# Profiles Table Documentation

## Purpose

The **profiles** table represents user metadata for authenticated users of ApplyFlow.  
Supabase Auth stores basic identity information in `auth.users`, but that table is intended for authentication only and does not include fields like display name, avatar URL, or application-specific roles.

The `profiles` table provides a place for application logic to store and retrieve additional user data that is not part of Supabase’s core Auth schema.

Each row in `profiles` corresponds directly to an entry in `auth.users` (same UUID).

---

## Table: `profiles`

| Column      | Type          | Description                                               |
|-------------|---------------|-----------------------------------------------------------|
| `id`        | `uuid`        | Primary key; matches the user’s ID in `auth.users`        |
| `full_name` | `text`        | The user’s display name                                   |
| `avatar_url`| `text`        | URL to the user’s avatar/profile picture                  |
| `role`      | `text`        | A simple application role (e.g., “Engineer”, “Recruiter”) |
| `created_at`| `timestamptz` | When the profile was created                              |

---

## Relationships

- The `id` field is a **foreign key** referencing `auth.users.id`, enforcing a 1:1 relationship.
- Because the profile ID matches the auth user ID, it is straightforward to join user metadata with application-specific data.

Example join:

```sql
SELECT
  profiles.full_name,
  profiles.avatar_url,
  applications.company,
  applications.role_title
FROM applications
JOIN profiles ON profiles.id = applications.created_by;
