-- Add invite_code to groups.
-- Each group gets a unique 8-character code used to generate shareable invite links.
ALTER TABLE public.groups
  ADD COLUMN IF NOT EXISTS invite_code TEXT UNIQUE;

-- Backfill existing groups with a random code
UPDATE public.groups
  SET invite_code = substr(md5(random()::text || id::text), 1, 8)
  WHERE invite_code IS NULL;

-- Make it NOT NULL now that all rows have a value
ALTER TABLE public.groups
  ALTER COLUMN invite_code SET NOT NULL;

-- Auto-generate invite_code on insert if not provided
CREATE OR REPLACE FUNCTION public.generate_invite_code()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.invite_code IS NULL OR NEW.invite_code = '' THEN
    NEW.invite_code := substr(md5(random()::text || NEW.id::text), 1, 8);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_invite_code ON public.groups;
CREATE TRIGGER set_invite_code
  BEFORE INSERT ON public.groups
  FOR EACH ROW EXECUTE FUNCTION public.generate_invite_code();

-- Allow anyone authenticated to look up a group by invite_code (needed for the join page)
CREATE POLICY "groups: read by invite code"
  ON public.groups FOR SELECT
  USING (invite_code IS NOT NULL);

-- Allow any authenticated user to add themselves to a group via invite code
-- (the join page will verify the invite_code before inserting)
CREATE POLICY "group_members: join via invite"
  ON public.group_members FOR INSERT
  WITH CHECK (
    user_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.groups
      WHERE groups.id = group_members.group_id
    )
  );
