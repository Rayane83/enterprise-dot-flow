-- Fix security warning by setting search_path for the log_action function
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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;