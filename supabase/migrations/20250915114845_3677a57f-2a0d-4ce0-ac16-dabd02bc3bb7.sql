-- Fix the RLS policy to avoid user_metadata references
DROP POLICY IF EXISTS "Superadmins can manage all users" ON public.users;

-- Create a simple superadmin policy without user_metadata reference
CREATE POLICY "Superadmins can manage all users" 
ON public.users 
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() 
    AND is_superadmin = true
  )
);