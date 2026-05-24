-- Allow users to insert their own profile row.
-- Needed for users who signed up before the trigger was deployed,
-- and as a safety net for the upsert in AuthContext/Onboarding.
CREATE POLICY "profiles: insert own"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);
