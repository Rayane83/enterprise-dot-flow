-- Fix the security vulnerability: restrict user data access
-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Allow authenticated users to select users" ON public.users;

-- Create a secure policy that only allows:
-- 1. Users to view their own data
-- 2. Users to view data from their enterprise  
-- 3. Superadmins to view all data
CREATE POLICY "Users can view their own data and same enterprise" 
ON public.users 
FOR SELECT 
USING (
  -- User can see their own record
  id = auth.uid() 
  OR 
  -- User can see records from their enterprise
  enterprise_id = (
    SELECT u.enterprise_id 
    FROM public.users u 
    WHERE u.id = auth.uid()
  )
  OR
  -- Superadmins can see everything
  EXISTS (
    SELECT 1 
    FROM public.users su 
    WHERE su.id = auth.uid() 
    AND su.is_superadmin = true
  )
);