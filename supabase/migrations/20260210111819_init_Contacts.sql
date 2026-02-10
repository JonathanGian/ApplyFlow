/*
  Migration: 20260210102857_Contacts.sql
  Purpose: Create the contacts table and add RLS policies.
  Each contact belongs to a job application.
*/

/*
  1) Create the contacts table
*/
CREATE TABLE IF NOT EXISTS contacts (
    id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Reference to the parent application
    application_id uuid NOT NULL 
      REFERENCES applications(id) 
      ON DELETE CASCADE,
    
    -- Contact metadata
    name text NOT NULL,
    email text,
    phone text,
    linkedin_url text,
    role text,      -- e.g., "Recruiter", "Hiring Manager"
    notes text,      -- Internal notes about the contact
    
    created_at timestamptz NOT NULL DEFAULT now()
);

/*
  2) Enable Row Level Security (RLS)
  We enforce strict per-user access via policies below.
*/
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

/*
  3) RLS policies
  Only allow users to operate on contacts if they belong to an application
  that the same user owns (based on applications.created_by = auth.uid()).
*/

/*
  SELECT — allow reading contacts for your own applications
*/
CREATE POLICY "Users can select contacts for their applications"
  ON contacts
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1
      FROM applications
      WHERE applications.id = contacts.application_id
        AND applications.created_by = auth.uid()
    )
  );

/*
  INSERT — allow creating contacts only for your own applications
*/
CREATE POLICY "Users can insert contacts for their applications"
  ON contacts
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM applications
      WHERE applications.id = contacts.application_id
        AND applications.created_by = auth.uid()
    )
  );

/*
  UPDATE — restrict updates to contacts for your own applications
*/
CREATE POLICY "Users can update contacts for their applications"
  ON contacts
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1
      FROM applications
      WHERE applications.id = contacts.application_id
        AND applications.created_by = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM applications
      WHERE applications.id = contacts.application_id
        AND applications.created_by = auth.uid()
    )
  );

/*
  DELETE — restrict deletes to contacts for your own applications
*/
CREATE POLICY "Users can delete contacts for their applications"
  ON contacts
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1
      FROM applications
      WHERE applications.id = contacts.application_id
        AND applications.created_by = auth.uid()
    )
  );