/*
  Migration: init_applications
  Purpose: Create the applications table to store job application records,
  and enforce access control per user via Row Level Security (RLS).
*/

/*
  0) Create enum type for application stages
  This enum ensures only valid stage values can be stored.
*/
CREATE TYPE application_stage AS ENUM (
  'Interested',
  'Applied',
  'Phone Screen',
  'Technical Interview',
  'Onsite Interview',
  'Offer',
  'Rejected',
  'Withdrawn',
  'Accepted'
);

/*
  1) Create the applications table
*/
CREATE TABLE IF NOT EXISTS applications (
    id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- The user who owns this application
    created_by uuid NOT NULL,
    
    company text NOT NULL,
    role_title text NOT NULL,
    job_url text,
    
    -- The current stage of this application process using enum
    stage application_stage NOT NULL DEFAULT 'Applied',
    
    -- Dates
    applied_at date,
    next_follow_up_at date,
    
    -- Optional metadata
    salary_min int,
    salary_max int,
    location text,
    remote_type text,
    
    notes text,
    
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

/*
  2) Enable Row Level Security (RLS)
  This ensures that, by default, no one can access application data until policies are defined.
*/
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

/*
  3) RLS policies
  Enforce that each user can only read, insert, update, or delete rows where they are the owner.
*/

/*
  SELECT
  Users can read their own applications
*/
CREATE POLICY "Users can select their own applications"
  ON applications
  FOR SELECT
  USING (created_by = auth.uid());

/*
  INSERT
  Users can create applications where created_by must be equal to their own auth.uid()
*/
CREATE POLICY "Users can insert their own applications"
  ON applications
  FOR INSERT
  WITH CHECK (created_by = auth.uid());

/*
  UPDATE
  Users can update only their own applications
*/
CREATE POLICY "Users can update their own applications"
  ON applications
  FOR UPDATE
  USING (created_by = auth.uid())
  WITH CHECK (created_by = auth.uid());

/*
  DELETE
  Users can delete only their own applications
*/
CREATE POLICY "Users can delete their own applications"
  ON applications
  FOR DELETE
  USING (created_by = auth.uid());