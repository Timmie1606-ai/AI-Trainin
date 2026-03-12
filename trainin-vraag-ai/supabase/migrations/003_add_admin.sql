-- Voeg is_admin toe aan user_profiles
ALTER TABLE public.user_profiles ADD COLUMN is_admin BOOLEAN NOT NULL DEFAULT FALSE;
