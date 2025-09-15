-- Drop the previous policy that may not work correctly
DROP POLICY IF EXISTS "Users can create their own record during signup" ON public.users;

-- Create a simpler policy that allows authenticated users to insert
CREATE POLICY "Authenticated users can create their user record" 
ON public.users 
FOR INSERT 
TO authenticated
WITH CHECK (true);