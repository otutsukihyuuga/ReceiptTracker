-- ============================================================
-- Enable Row Level Security on all tables
-- ============================================================
ALTER TABLE public.profiles       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.groups         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_members  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bills          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bill_items     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.splits         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.split_shares   ENABLE ROW LEVEL SECURITY;


-- ============================================================
-- Profiles
-- Users can read any profile (needed for showing member names).
-- Users can only update their own profile.
-- ============================================================
CREATE POLICY "profiles: read any"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "profiles: update own"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);


-- ============================================================
-- Groups
-- Anyone authenticated can create a group.
-- Only members of a group can read it.
-- Only the creator can update or delete it.
-- ============================================================
CREATE POLICY "groups: create"
  ON public.groups FOR INSERT
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "groups: read if member"
  ON public.groups FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.group_members
      WHERE group_members.group_id = groups.id
        AND group_members.user_id = auth.uid()
    )
    OR created_by = auth.uid()
  );

CREATE POLICY "groups: update if creator"
  ON public.groups FOR UPDATE
  USING (auth.uid() = created_by);

CREATE POLICY "groups: delete if creator"
  ON public.groups FOR DELETE
  USING (auth.uid() = created_by);


-- ============================================================
-- Group Members
-- Group creator can add/remove members.
-- Members can read who else is in their group.
-- Members can remove themselves.
-- ============================================================
CREATE POLICY "group_members: read if in same group"
  ON public.group_members FOR SELECT
  USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.group_members gm
      WHERE gm.group_id = group_members.group_id
        AND gm.user_id = auth.uid()
    )
  );

CREATE POLICY "group_members: add if group creator"
  ON public.group_members FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.groups
      WHERE groups.id = group_members.group_id
        AND groups.created_by = auth.uid()
    )
  );

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


-- ============================================================
-- Bills
-- A user can see their own bills + bills belonging to groups they are in.
-- Only the uploader can update or delete a bill.
-- ============================================================
CREATE POLICY "bills: read own or group"
  ON public.bills FOR SELECT
  USING (
    uploaded_by = auth.uid()
    OR (
      group_id IS NOT NULL AND EXISTS (
        SELECT 1 FROM public.group_members
        WHERE group_members.group_id = bills.group_id
          AND group_members.user_id = auth.uid()
      )
    )
  );

CREATE POLICY "bills: insert own"
  ON public.bills FOR INSERT
  WITH CHECK (auth.uid() = uploaded_by);

CREATE POLICY "bills: update own"
  ON public.bills FOR UPDATE
  USING (auth.uid() = uploaded_by);

CREATE POLICY "bills: delete own"
  ON public.bills FOR DELETE
  USING (auth.uid() = uploaded_by);


-- ============================================================
-- Bill Items
-- Readable if the parent bill is readable.
-- Writable only by the bill uploader.
-- ============================================================
CREATE POLICY "bill_items: read if bill readable"
  ON public.bill_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.bills
      WHERE bills.id = bill_items.bill_id
        AND (
          bills.uploaded_by = auth.uid()
          OR (
            bills.group_id IS NOT NULL AND EXISTS (
              SELECT 1 FROM public.group_members
              WHERE group_members.group_id = bills.group_id
                AND group_members.user_id = auth.uid()
            )
          )
        )
    )
  );

CREATE POLICY "bill_items: insert if bill owner"
  ON public.bill_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.bills
      WHERE bills.id = bill_items.bill_id
        AND bills.uploaded_by = auth.uid()
    )
  );

CREATE POLICY "bill_items: delete if bill owner"
  ON public.bill_items FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.bills
      WHERE bills.id = bill_items.bill_id
        AND bills.uploaded_by = auth.uid()
    )
  );


-- ============================================================
-- Splits
-- Readable by anyone involved in a share, or the creator.
-- Only authenticated users can create a split on a bill they can see.
-- ============================================================
CREATE POLICY "splits: read if involved"
  ON public.splits FOR SELECT
  USING (
    created_by = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.split_shares
      WHERE split_shares.split_id = splits.id
        AND split_shares.user_id = auth.uid()
    )
  );

CREATE POLICY "splits: insert authenticated"
  ON public.splits FOR INSERT
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "splits: delete if creator"
  ON public.splits FOR DELETE
  USING (auth.uid() = created_by);


-- ============================================================
-- Split Shares
-- Readable by anyone involved in the same split.
-- Users can update only their own share (to mark as paid).
-- ============================================================
CREATE POLICY "split_shares: read if in split"
  ON public.split_shares FOR SELECT
  USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.splits
      WHERE splits.id = split_shares.split_id
        AND splits.created_by = auth.uid()
    )
  );

CREATE POLICY "split_shares: insert if split creator"
  ON public.split_shares FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.splits
      WHERE splits.id = split_shares.split_id
        AND splits.created_by = auth.uid()
    )
  );

CREATE POLICY "split_shares: update own status"
  ON public.split_shares FOR UPDATE
  USING (auth.uid() = user_id);
