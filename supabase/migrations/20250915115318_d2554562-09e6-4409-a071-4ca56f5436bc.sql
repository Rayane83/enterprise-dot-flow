-- Temporarily disable RLS to test authentication flow
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;

-- We'll re-enable it once authentication works
-- This is temporary for debugging