-- ======================================
-- Supabase Local Seed for ApplyFlow
-- ======================================

-- Enable the pgcrypto extension for password hashing (if not already)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- --------------------------------------
-- AUTH USERS
-- --------------------------------------

-- Insert test users into auth.users
INSERT INTO auth.users (
  id,
  instance_id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  confirmation_token,
  recovery_token,
  email_change_token_new,
  email_change,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at
)
VALUES
  (
    '11111111-1111-1111-1111-111111111111',
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'alice@example.com',
    crypt('password', gen_salt('bf')),
    now(),
    '',
    '',
    '',
    '',
    '{"provider":"email","providers":["email"]}',
    '{}'::jsonb,
    now(),
    now()
  ),
  (
    '22222222-2222-2222-2222-222222222222',
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'bob@example.com',
    crypt('password', gen_salt('bf')),
    now(),
    '',
    '',
    '',
    '',
    '{"provider":"email","providers":["email"]}',
    '{}'::jsonb,
    now(),
    now()
  );

-- Insert into auth.identities so local email/password sign-in works
-- Insert into auth.identities so local email/password sign-in works
INSERT INTO auth.identities (
  id,
  user_id,
  provider,
  provider_id,
  identity_data,
  created_at,
  updated_at
)
VALUES
  (
    gen_random_uuid(),
    '11111111-1111-1111-1111-111111111111',
    'email',
    '11111111-1111-1111-1111-111111111111',
    format('{"sub":"%s","email":"%s"}',
           '11111111-1111-1111-1111-111111111111',
           'alice@example.com')::jsonb,
    now(),
    now()
  ),
  (
    gen_random_uuid(),
    '22222222-2222-2222-2222-222222222222',
    'email',
    '22222222-2222-2222-2222-222222222222',
    format('{"sub":"%s","email":"%s"}',
           '22222222-2222-2222-2222-222222222222',
           'bob@example.com')::jsonb,
    now(),
    now()
  );
-- --------------------------------------
-- PROFILES
-- --------------------------------------

INSERT INTO profiles (
  id,
  full_name,
  avatar_url,
  role,
  created_at
)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'Alice Example', 'https://example.com/avatars/alice.png', 'Developer', now()),
  ('22222222-2222-2222-2222-222222222222', 'Bob Example', 'https://example.com/avatars/bob.png', 'Engineer', now());

-- ======================================
-- Applications
-- ======================================

INSERT INTO applications (id, created_by, company, role_title, stage, applied_at, next_follow_up_at, notes)
VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'Alpha Corp', 'Frontend Developer', 'Interested', NULL, NULL, 'Looking interesting, research and follow up.'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '11111111-1111-1111-1111-111111111111', 'Beta LLC', 'Backend Engineer', 'Applied', '2025-01-15', '2025-01-20', 'Submitted resume and cover letter.'),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', '22222222-2222-2222-2222-222222222222', 'Gamma Inc', 'QA Analyst', 'Phone Screen', '2025-02-01', '2025-02-03', 'Initial phone screen scheduled.'),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', '22222222-2222-2222-2222-222222222222', 'Delta Co', 'DevOps Engineer', 'Technical Interview', '2025-02-10', '2025-02-15', 'Technical interview upcoming.');

-- ======================================
-- Contacts
-- ======================================

INSERT INTO contacts (id, application_id, name, email, phone, linkedin_url, role, notes)
VALUES
  ('aaaaaaaa-0000-0000-0000-aaaaaaaa0000', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Alice Recruiter', 'alice.recruiter@alphacorp.com', '555-0100', 'https://linkedin.com/in/alice-rec', 'Recruiter', 'Primary recruiter at Alpha Corp'),
  ('bbbbbbbb-0000-0000-0000-bbbbbbbb0000', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Bob Manager', 'bob.manager@betallc.com', '555-0111', 'https://linkedin.com/in/bob-mgr', 'Hiring Manager', 'Main contact at Beta LLC'),
  ('cccccccc-0000-0000-0000-cccccccc0000', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'Charlie Recruiter', 'charlie.recruiter@gammainc.com', '555-0222', 'https://linkedin.com/in/charlie-rec', 'Recruiter', 'Recruiter for QA roles'),
  ('dddddddd-0000-0000-0000-dddddddd0000', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'Dana HiringMgr', 'dana.hiring@deltaco.com', '555-0333', 'https://linkedin.com/in/dana-hm', 'Manager', 'Manager for DevOps candidates');

-- ======================================
-- Interactions
-- ======================================

INSERT INTO interactions (id, application_id, type, occurred_at, summary, next_follow_up_at)
VALUES
  ('11110000-0000-0000-0000-111100000000', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'email', '2025-01-16 10:00:00', 'Sent follow-up email after applying.', '2025-01-20'),
  ('22220000-0000-0000-0000-222200000000', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'call', '2025-01-18 14:30:00', 'Phone screen conversation with Bob Manager.', NULL),
  ('33330000-0000-0000-0000-333300000000', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'interview', '2025-02-11 09:00:00', 'Technical interview with DevOps team.', '2025-02-15'),
  ('44440000-0000-0000-0000-444400000000', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'networking', '2025-02-02 16:15:00', 'Networking message to QA recruiter.', NULL);
