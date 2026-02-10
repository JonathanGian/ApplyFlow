/*
  Migration: 20260210115137_User_Profiles.sql
  Purpose: Create a public profiles table to store user metadata
  that corresponds to entries in auth.users.
*/

/*
  1) Create the profiles table
*/
CREATE TABLE IF NOT EXISTS profiles (
    id uuid NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name text,
    avatar_url text,
    role text,
    created_at timestamptz NOT NULL DEFAULT now()
);

/*
  2) Enable Row Level Security (RLS)
  Profiles should be visible/editable only by the owning user.
*/
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

/*
  3) RLS policies
  Users may select and update their own profile, nothing else.
*/

/* SELECT — Users can read their own profile */
CREATE POLICY "Users can select their own profile"
  ON profiles
  FOR SELECT
  USING (auth.uid() = id);

/* UPDATE — Users can update their own profile */
CREATE POLICY "Users can update their own profile"
  ON profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

  /* TODO: Add docs for profiles table and RLS policies */