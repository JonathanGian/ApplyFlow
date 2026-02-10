# Contacts Table Documentation

## Purpose

The **Contacts** table stores information about people associated with a job application.
Each contact belongs to one application and contains basic contact details, including name, email, phone, role, and notes.

This document explains the structure and security of the table so that developers can understand how the table is used and maintained.

---

## Table: `contacts`

### Description

Each row in `contacts` represents a person relevant to a job application.
Examples of contacts:

- A recruiter handling the application
- A hiring manager
- A referral or internal connection

Each contact record is tied to a job application via a foreign key relationship.

---

## Columns

| Column           | Type              | Description                                                            |
|------------------|-------------------|------------------------------------------------------------------------|
| `id`             | `uuid`            | Primary key — unique identifier for each contact                       |
| `application_id` | `uuid`            | Foreign key referencing the parent job application (`applications.id`) |
| `name`           | `text`            | Person’s full name                                                     |
| `email`          | `text`            | Contact’s email address (optional)                                     |
| `phone`          | `text`            | Contact’s phone number (optional)                                      |
| `linkedin_url`   | `text`            | Optional LinkedIn profile URL                                          |
| `role`           | `text`            | Role of the contact (e.g., Recruiter, Hiring Manager)                  |
| `notes`          | `text`            | Internal notes or context about the contact                            |
| `created_at`     | `timestamptz`     | Timestamp when the record was created                                  |

---

## Relationships

- A `contact` **belongs to** a single application.
- This is enforced by a foreign key constraint on `application_id` referencing `applications.id`.
- If an application is deleted, all its contacts are also deleted (`ON DELETE CASCADE`).

---

## Row Level Security (RLS)

To ensure that users only see and manage their own data, we enable **Row Level Security** on this table.

### RLS Policies

**SELECT**  
Users may read contacts only for applications they own.

**INSERT**  
Users may create contacts only for applications they own.

**UPDATE**  
Users may update contacts only for applications they own.

**DELETE**  
Users may delete contacts only for applications they own.

These policies reference the `applications.created_by` field, using `auth.uid()` from Supabase auth to enforce ownership.

> This security model helps keep data isolated per user and prevents unauthorized access.

---

## Notes/Reminders & Best Practices

- Be sure this documentation stays updated when you modify the table or its policies. Documentation should evolve with the schema changes.
- Consider linking this file from a centralized schema overview or README so other developers know where to look.
