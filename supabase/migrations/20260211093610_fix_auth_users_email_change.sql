/*
  Migration: fix_auth_users_email_change
  Purpose: Avoid GoTrue 500s when reading users if email_change is NULL.
  Some setups (e.g. seeded users) can end up with NULL email_change, and GoTrue
  may scan it into a non-nullable string.
*/

UPDATE auth.users
SET email_change = COALESCE(email_change, '');

