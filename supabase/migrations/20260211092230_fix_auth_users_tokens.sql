/*
  Migration: fix_auth_users_tokens
  Purpose: Supabase Auth (GoTrue) expects certain token columns to be non-null
  strings. When these are NULL (e.g. from manual/seed inserts), password login
  can fail with 500: "Database error querying schema" / "converting NULL to string".
*/

/*
  1) Backfill NULLs to empty strings
*/
UPDATE auth.users
SET
  confirmation_token = COALESCE(confirmation_token, ''),
  recovery_token = COALESCE(recovery_token, ''),
  email_change_token_new = COALESCE(email_change_token_new, '');
