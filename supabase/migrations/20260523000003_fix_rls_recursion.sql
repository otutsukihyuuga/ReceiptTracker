-- ============================================================
-- Fix infinite recursion in group_members RLS policies.
--
-- The original policy did:
--   EXISTS (SELECT 1 FROM group_members WHERE ...)
-- which re-triggers the policy on group_members → infinite loop.
--
-- Fix: use a SECURITY DEFINER function that bypasses RLS entirely
-- when checking group membership, breaking the recursion.
-- ============================================================

-- Helper: returns true if the current user belongs to a given group.
-- SECURITY DEFINER means it runs as the DB owner, bypassing RLS.
CREATE OR REPLACE FUNCTION public.is_group_member(gid uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.group_members
    WHERE group_id = gid
      AND user_id = auth.uid()
  );
$$;

-- Drop the recursive policies
DROP POLICY IF EXISTS "group_members: read if in same group" ON public.group_members;
DROP POLICY IF EXISTS "groups: read if member"              ON public.groups;
DROP POLICY IF EXISTS "bills: read own or group"            ON public.bills;
DROP POLICY IF EXISTS "bill_items: read if bill readable"   ON public.bill_items;
DROP POLICY IF EXISTS "group_members: add if group creator" ON public.group_members;
DROP POLICY IF EXISTS "group_members: remove if creator or self" ON public.group_members;

-- Re-create group_members SELECT policy using the helper function
CREATE POLICY "group_members: read if in same group"
  ON public.group_members FOR SELECT
  USING (
    user_id = auth.uid()
    OR is_group_member(group_id)
  );

-- Re-create group_members INSERT policy using the helper function
CREATE POLICY "group_members: add if group creator"
  ON public.group_members FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.groups
      WHERE groups.id = group_members.group_id
        AND groups.created_by = auth.uid()
    )
    -- Also allow inserting yourself (for the onboarding flow)
    OR user_id = auth.uid()
  );

-- Re-create group_members DELETE policy
CREATE POLICY "group_members: remove if creator or self"
  ON public.group_members FOR DELETE
  USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.groups
      WHERE groups.id = group_members.group_id
        AND groups.created_by = auth.uid()
    )
  );

-- Re-create groups SELECT policy using the helper function
CREATE POLICY "groups: read if member"
  ON public.groups FOR SELECT
  USING (
    created_by = auth.uid()
    OR is_group_member(id)
  );

-- Re-create bills SELECT policy using the helper function
CREATE POLICY "bills: read own or group"
  ON public.bills FOR SELECT
  USING (
    uploaded_by = auth.uid()
    OR (group_id IS NOT NULL AND is_group_member(group_id))
  );

-- Re-create bill_items SELECT policy using the helper function
CREATE POLICY "bill_items: read if bill readable"
  ON public.bill_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.bills
      WHERE bills.id = bill_items.bill_id
        AND (
          bills.uploaded_by = auth.uid()
          OR (bills.group_id IS NOT NULL AND is_group_member(bills.group_id))
        )
    )
  );
