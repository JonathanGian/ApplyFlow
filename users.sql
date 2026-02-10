SET session_replication_role = replica;

--
-- PostgreSQL database dump
--

-- \restrict LU4mDjpoQISEGOYY6x1FKCVphClXtmFqJHsEiRv6EDh6pzR0lZxwcB0m0OgEcg5

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."audit_log_entries" ("instance_id", "id", "payload", "created_at", "ip_address") VALUES
	('00000000-0000-0000-0000-000000000000', '49f9819f-9c51-4e2a-ac90-be59d7df9cb0', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"provider":"email","user_email":"test@example.com","user_id":"c63137c0-5dfc-45fd-9fb1-fc80ff9775ec","user_phone":""}}', '2026-02-10 11:44:13.332301+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e8ff0dda-50b7-4d35-bc60-4a8848707433', '{"action":"user_invited","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"bob@example.com","user_id":"a52c5b37-70f0-4bdf-be55-adf3043b641f"}}', '2026-02-10 11:47:35.183452+00', ''),
	('00000000-0000-0000-0000-000000000000', '4a2902d6-8b93-453e-81f7-51cab7f8438c', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"provider":"email","user_email":"alice@example.com","user_id":"aec013a6-899f-4037-b33e-39672ee94bb8","user_phone":""}}', '2026-02-10 11:47:52.30154+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f7b99e6e-a7e5-418e-a9fc-6baf43236c16', '{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"bob@example.com","user_id":"a52c5b37-70f0-4bdf-be55-adf3043b641f","user_phone":""}}', '2026-02-10 11:48:02.590551+00', ''),
	('00000000-0000-0000-0000-000000000000', '1d0c78db-d656-4234-9d8a-f118becd4247', '{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"test@example.com","user_id":"c63137c0-5dfc-45fd-9fb1-fc80ff9775ec","user_phone":""}}', '2026-02-10 11:48:02.600267+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ba434627-bafe-450b-af93-1b1358d2452b', '{"action":"user_invited","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"bob@example.com","user_id":"5b108af7-3e32-42e2-a6d6-7ef0314bbe93"}}', '2026-02-10 11:48:10.336115+00', '');


--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."users" ("instance_id", "id", "aud", "role", "email", "encrypted_password", "email_confirmed_at", "invited_at", "confirmation_token", "confirmation_sent_at", "recovery_token", "recovery_sent_at", "email_change_token_new", "email_change", "email_change_sent_at", "last_sign_in_at", "raw_app_meta_data", "raw_user_meta_data", "is_super_admin", "created_at", "updated_at", "phone", "phone_confirmed_at", "phone_change", "phone_change_token", "phone_change_sent_at", "email_change_token_current", "email_change_confirm_status", "banned_until", "reauthentication_token", "reauthentication_sent_at", "is_sso_user", "deleted_at", "is_anonymous") VALUES
	('00000000-0000-0000-0000-000000000000', 'aec013a6-899f-4037-b33e-39672ee94bb8', 'authenticated', 'authenticated', 'alice@example.com', '$2a$10$LsgLHbrn2GDpS1CaV88wieWpumWqUb/k.Jb3xtBlnQRMA3GQq3/7e', '2026-02-10 11:47:52.30473+00', NULL, '', NULL, '', NULL, '', '', NULL, NULL, '{"provider": "email", "providers": ["email"]}', '{"email_verified": true}', NULL, '2026-02-10 11:47:52.294501+00', '2026-02-10 11:47:52.305847+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '5b108af7-3e32-42e2-a6d6-7ef0314bbe93', 'authenticated', 'authenticated', 'bob@example.com', '', NULL, '2026-02-10 11:48:10.337159+00', 'c0a1ae41e001c4c576764fbd32c2a21490eb1c18c502dd0e44087b00', '2026-02-10 11:48:10.337159+00', '', NULL, '', '', NULL, NULL, '{"provider": "email", "providers": ["email"]}', '{}', NULL, '2026-02-10 11:48:10.321998+00', '2026-02-10 11:48:10.35458+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false);


--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."identities" ("provider_id", "user_id", "identity_data", "provider", "last_sign_in_at", "created_at", "updated_at", "id") VALUES
	('aec013a6-899f-4037-b33e-39672ee94bb8', 'aec013a6-899f-4037-b33e-39672ee94bb8', '{"sub": "aec013a6-899f-4037-b33e-39672ee94bb8", "email": "alice@example.com", "email_verified": false, "phone_verified": false}', 'email', '2026-02-10 11:47:52.298276+00', '2026-02-10 11:47:52.298314+00', '2026-02-10 11:47:52.298314+00', '532c152b-e349-4b51-96d2-340b750e7093'),
	('5b108af7-3e32-42e2-a6d6-7ef0314bbe93', '5b108af7-3e32-42e2-a6d6-7ef0314bbe93', '{"sub": "5b108af7-3e32-42e2-a6d6-7ef0314bbe93", "email": "bob@example.com", "email_verified": false, "phone_verified": false}', 'email', '2026-02-10 11:48:10.334168+00', '2026-02-10 11:48:10.334229+00', '2026-02-10 11:48:10.334229+00', 'f850ede0-227e-461e-9344-8d06eca8ec22');


--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_clients; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_authorizations; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_client_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_consents; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."one_time_tokens" ("id", "user_id", "token_type", "token_hash", "relates_to", "created_at", "updated_at") VALUES
	('76368681-e471-47fc-94da-10975b0f0c8a', '5b108af7-3e32-42e2-a6d6-7ef0314bbe93', 'confirmation_token', 'c0a1ae41e001c4c576764fbd32c2a21490eb1c18c502dd0e44087b00', 'bob@example.com', '2026-02-10 11:48:10.356801', '2026-02-10 11:48:10.356801');


--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: applications; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: contacts; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: interactions; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: buckets_analytics; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: buckets_vectors; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: iceberg_namespaces; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: iceberg_tables; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: vector_indexes; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: hooks; Type: TABLE DATA; Schema: supabase_functions; Owner: supabase_functions_admin
--



--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('"auth"."refresh_tokens_id_seq"', 1, false);


--
-- Name: hooks_id_seq; Type: SEQUENCE SET; Schema: supabase_functions; Owner: supabase_functions_admin
--

SELECT pg_catalog.setval('"supabase_functions"."hooks_id_seq"', 1, false);


--
-- PostgreSQL database dump complete
--

-- \unrestrict LU4mDjpoQISEGOYY6x1FKCVphClXtmFqJHsEiRv6EDh6pzR0lZxwcB0m0OgEcg5

RESET ALL;
