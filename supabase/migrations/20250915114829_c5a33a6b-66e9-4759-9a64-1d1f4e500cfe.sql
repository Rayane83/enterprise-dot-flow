-- Drop existing policies to create a simpler one
DROP POLICY IF EXISTS "Authenticated users can create their user record" ON public.users;
DROP POLICY IF EXISTS "Superadmins can manage all users" ON public.users;
DROP POLICY IF EXISTS "Users can view their own data and same enterprise" ON public.users;

-- Create a policy that allows any authenticated user to insert
CREATE POLICY "Allow authenticated users to insert users" 
ON public.users 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() IS NOT NULL);

-- Allow users to view users data  
CREATE POLICY "Allow authenticated users to select users" 
ON public.users 
FOR SELECT 
TO authenticated
USING (true);

-- Only superadmins can update/delete (we'll add this later if needed)
CREATE POLICY "Superadmins can manage all users" 
ON public.users 
FOR ALL
USING ((SELECT is_superadmin FROM public.users WHERE discord_id = (SELECT (auth.jwt() -> 'user_metadata' ->> 'provider_id'))) = true);