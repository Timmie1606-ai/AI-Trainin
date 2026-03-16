-- Voeg trial_expires_at toe aan user_profiles
-- NULL = gebruik created_at + 7 dagen (standaard proefperiode)
-- Datum in het verleden = proefperiode verlopen
-- Datum ver in de toekomst = verlengd of permanent toegang
ALTER TABLE public.user_profiles
  ADD COLUMN trial_expires_at TIMESTAMPTZ DEFAULT NULL;

-- Geef admins altijd volledige toegang door trial_expires_at op ver in de toekomst te zetten
UPDATE public.user_profiles
  SET trial_expires_at = '2099-01-01 00:00:00+00'
  WHERE is_admin = TRUE;
