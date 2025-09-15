-- Allow users to create their own user record during signup
CREATE POLICY "Users can create their own record during signup" 
ON public.users 
FOR INSERT 
WITH CHECK (discord_id = (auth.jwt() ->> 'discord_id'));