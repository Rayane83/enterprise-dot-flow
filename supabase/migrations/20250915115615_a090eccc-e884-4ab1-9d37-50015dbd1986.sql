-- Temporarily disable RLS on other tables to test if they're causing issues
ALTER TABLE public.parametrage DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.discord_settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.action_logs DISABLE ROW LEVEL SECURITY;