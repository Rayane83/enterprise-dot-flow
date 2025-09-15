-- Create enum for user roles
CREATE TYPE public.user_role AS ENUM ('PATRON', 'CO-PATRON', 'STAFF', 'DOT', 'SUPERSTAFF');

-- Create users table for Discord integration
CREATE TABLE public.users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  discord_id TEXT NOT NULL UNIQUE,
  username TEXT NOT NULL,
  role public.user_role NOT NULL DEFAULT 'STAFF',
  enterprise_id TEXT NOT NULL,
  is_superadmin BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create parametrage table
CREATE TABLE public.parametrage (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  enterprise_id TEXT NOT NULL,
  active_version TEXT NOT NULL DEFAULT 'v1',
  effective_from TIMESTAMP WITH TIME ZONE,
  effective_to TIMESTAMP WITH TIME ZONE,
  open_datetime TIMESTAMP WITH TIME ZONE NOT NULL,
  close_datetime TIMESTAMP WITH TIME ZONE NOT NULL,
  salary_max_employee INTEGER NOT NULL DEFAULT 0,
  bonus_max_employee INTEGER NOT NULL DEFAULT 0,
  salary_max_boss INTEGER NOT NULL DEFAULT 0,
  bonus_max_boss INTEGER NOT NULL DEFAULT 0,
  tax_brackets JSONB NOT NULL DEFAULT '[]'::jsonb,
  wealth_tax_brackets JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(enterprise_id, active_version)
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parametrage ENABLE ROW LEVEL SECURITY;

-- Create security definer function to get current user info
CREATE OR REPLACE FUNCTION public.get_current_user()
RETURNS TABLE(user_id UUID, discord_id TEXT, username TEXT, role public.user_role, enterprise_id TEXT, is_superadmin BOOLEAN)
LANGUAGE SQL
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT u.id, u.discord_id, u.username, u.role, u.enterprise_id, u.is_superadmin
  FROM public.users u
  WHERE u.discord_id = (auth.jwt() ->> 'discord_id')
  LIMIT 1;
$$;

-- RLS Policies for users table
CREATE POLICY "Users can view their own data and same enterprise"
ON public.users
FOR SELECT
USING (
  discord_id = (auth.jwt() ->> 'discord_id') OR
  enterprise_id = (SELECT enterprise_id FROM public.get_current_user() LIMIT 1) OR 
  (SELECT is_superadmin FROM public.get_current_user() LIMIT 1) = true
);

CREATE POLICY "Superadmins can manage all users"
ON public.users
FOR ALL
USING ((SELECT is_superadmin FROM public.get_current_user() LIMIT 1) = true);

-- RLS Policies for parametrage table
CREATE POLICY "Users can view parametrage for their enterprise"
ON public.parametrage
FOR SELECT
USING (
  enterprise_id = (SELECT enterprise_id FROM public.get_current_user() LIMIT 1) OR
  (SELECT is_superadmin FROM public.get_current_user() LIMIT 1) = true
);

CREATE POLICY "Only SUPERSTAFF can modify parametrage"
ON public.parametrage
FOR ALL
USING (
  (SELECT role FROM public.get_current_user() LIMIT 1) = 'SUPERSTAFF' OR
  (SELECT is_superadmin FROM public.get_current_user() LIMIT 1) = true
);

-- Create trigger function for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON public.users
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_parametrage_updated_at
BEFORE UPDATE ON public.parametrage
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default superadmin user
INSERT INTO public.users (discord_id, username, role, enterprise_id, is_superadmin)
VALUES ('462716512252329996', 'SuperAdmin', 'SUPERSTAFF', 'default', true)
ON CONFLICT (discord_id) DO NOTHING;