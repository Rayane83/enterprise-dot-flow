-- Create table for Discord guild settings
CREATE TABLE public.discord_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  enterprise_id TEXT NOT NULL UNIQUE,
  main_guild_id TEXT,
  main_guild_staff_role_id TEXT,
  main_guild_patron_role_id TEXT,
  main_guild_co_patron_role_id TEXT,
  main_guild_enterprise_role_id TEXT,
  dot_guild_id TEXT,
  dot_guild_staff_role_id TEXT,
  dot_guild_dot_role_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for action logs
CREATE TABLE public.action_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  enterprise_id TEXT NOT NULL,
  action_type TEXT NOT NULL,
  action_description TEXT NOT NULL,
  target_table TEXT,
  target_id TEXT,
  old_data JSONB,
  new_data JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.discord_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.action_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for discord_settings
CREATE POLICY "Users can view discord settings for their enterprise"
ON public.discord_settings
FOR SELECT
USING (
  enterprise_id = (SELECT enterprise_id FROM public.get_current_user() LIMIT 1) OR
  (SELECT is_superadmin FROM public.get_current_user() LIMIT 1) = true
);

CREATE POLICY "Only SUPERSTAFF can modify discord settings"
ON public.discord_settings
FOR ALL
USING (
  (SELECT role FROM public.get_current_user() LIMIT 1) = 'SUPERSTAFF' OR
  (SELECT is_superadmin FROM public.get_current_user() LIMIT 1) = true
);

-- RLS Policies for action_logs
CREATE POLICY "Superadmins can view all logs"
ON public.action_logs
FOR SELECT
USING ((SELECT is_superadmin FROM public.get_current_user() LIMIT 1) = true);

CREATE POLICY "System can insert logs"
ON public.action_logs
FOR INSERT
WITH CHECK (true);

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_discord_settings_updated_at
BEFORE UPDATE ON public.discord_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Function to log actions
CREATE OR REPLACE FUNCTION public.log_action(
  p_action_type TEXT,
  p_action_description TEXT,
  p_target_table TEXT DEFAULT NULL,
  p_target_id TEXT DEFAULT NULL,
  p_old_data JSONB DEFAULT NULL,
  p_new_data JSONB DEFAULT NULL
)
RETURNS VOID AS $$
DECLARE
  current_user_data RECORD;
BEGIN
  -- Get current user data
  SELECT * FROM public.get_current_user() INTO current_user_data LIMIT 1;
  
  IF current_user_data.user_id IS NOT NULL THEN
    INSERT INTO public.action_logs (
      user_id,
      enterprise_id,
      action_type,
      action_description,
      target_table,
      target_id,
      old_data,
      new_data
    ) VALUES (
      current_user_data.user_id,
      current_user_data.enterprise_id,
      p_action_type,
      p_action_description,
      p_target_table,
      p_target_id,
      p_old_data,
      p_new_data
    );
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;