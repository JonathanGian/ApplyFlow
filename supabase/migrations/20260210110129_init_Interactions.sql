/*
  Migration: init_Interactions
  Purpose: Create the interactions table and add security policies.
  Each interaction is linked to an application and logs a meaningful
  event (email, call, interview, etc.).
*/
CREATE TYPE application_interaction_type AS ENUM (
  'email',
  'call',
  'interview',
  'message',
  'networking'
);
/*
  1) Create the interactions table
*/
CREATE TABLE IF NOT EXISTS interactions (
    id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Link to the parent job application
    application_id uuid NOT NULL
      REFERENCES applications(id)
      ON DELETE CASCADE,

    -- Interaction details
    type application_interaction_type NOT NULL,  -- e.g., 'email', 'call', 'interview'
    occurred_at timestamptz NOT NULL DEFAULT now(),
    summary text,  -- Brief summary of the interaction
    next_follow_up_at date,  -- Optional follow-up date

    created_at timestamptz NOT NULL DEFAULT now()
);

/*
  2) Enable Row Level Security (RLS)
  Ensures only authorized users can access this table's rows.
*/
ALTER TABLE interactions ENABLE ROW LEVEL SECURITY;

/*
  3) RLS policies
  Only allow users to operate on interactions if they belong to
  applications that the user owns (based on applications.created_by = auth.uid()).
*/

/*
  SELECT: Users can read interactions for their own applications
*/
CREATE POLICY "Users can select interactions for their applications"
  ON interactions
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1
      FROM applications
      WHERE applications.id = interactions.application_id
        AND applications.created_by = auth.uid()
    )
  );

/*
  INSERT: Users can insert interactions linked to their own applications
*/
CREATE POLICY "Users can insert interactions for their applications"
  ON interactions
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM applications
      WHERE applications.id = interactions.application_id
        AND applications.created_by = auth.uid()
    )
  );

/*
  UPDATE: Users can update interactions for their own applications
*/
CREATE POLICY "Users can update interactions for their applications"
  ON interactions
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1
      FROM applications
      WHERE applications.id = interactions.application_id
        AND applications.created_by = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM applications
      WHERE applications.id = interactions.application_id
        AND applications.created_by = auth.uid()
    )
  );

/*
  DELETE: Users can delete interactions for their own applications
*/
CREATE POLICY "Users can delete interactions for their applications"
  ON interactions
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1
      FROM applications
      WHERE applications.id = interactions.application_id
        AND applications.created_by = auth.uid()
    )
  );