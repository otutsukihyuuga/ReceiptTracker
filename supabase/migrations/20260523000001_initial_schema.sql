-- ============================================================
-- Profiles
-- Auto-created when a user signs up via a trigger on auth.users
-- ============================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name   TEXT,
  avatar_url  TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Trigger: create a profile row automatically on sign up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- ============================================================
-- Groups
-- A user can create many groups. No group is required.
-- ============================================================
CREATE TABLE IF NOT EXISTS public.groups (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  created_by  UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ============================================================
-- Group Members
-- Links users to groups. One row per user per group.
-- ============================================================
CREATE TABLE IF NOT EXISTS public.group_members (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id    UUID NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
  user_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  joined_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(group_id, user_id)
);


-- ============================================================
-- Bills
-- group_id is nullable — a bill can be personal (no group).
-- uploaded_by always tracks who added the bill.
-- ============================================================
CREATE TABLE IF NOT EXISTS public.bills (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id    UUID REFERENCES public.groups(id) ON DELETE SET NULL,
  uploaded_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  merchant    TEXT,
  date        DATE,
  subtotal    NUMERIC(10, 2) DEFAULT 0,
  tax         NUMERIC(10, 2) DEFAULT 0,
  discount    NUMERIC(10, 2) DEFAULT 0,
  total       NUMERIC(10, 2) DEFAULT 0,
  category    TEXT,
  status      TEXT NOT NULL DEFAULT 'processing' CHECK (status IN ('processing', 'processed')),
  image_url   TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ============================================================
-- Bill Items
-- Individual line items extracted from a bill.
-- ============================================================
CREATE TABLE IF NOT EXISTS public.bill_items (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bill_id     UUID NOT NULL REFERENCES public.bills(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  quantity    NUMERIC(10, 2) DEFAULT 1,
  price       NUMERIC(10, 2) DEFAULT 0
);


-- ============================================================
-- Splits
-- One split record per bill that is split.
-- ============================================================
CREATE TABLE IF NOT EXISTS public.splits (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bill_id     UUID NOT NULL REFERENCES public.bills(id) ON DELETE CASCADE,
  created_by  UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ============================================================
-- Split Shares
-- One row per person involved in a split.
-- ============================================================
CREATE TABLE IF NOT EXISTS public.split_shares (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  split_id    UUID NOT NULL REFERENCES public.splits(id) ON DELETE CASCADE,
  user_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  amount      NUMERIC(10, 2) NOT NULL,
  status      TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid'))
);
