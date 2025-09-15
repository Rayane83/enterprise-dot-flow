-- Make sure the superadmin user exists with correct permissions
INSERT INTO public.users (id, discord_id, username, role, enterprise_id, is_superadmin) 
VALUES (
  '87b77193-1094-46e8-bc9e-7fddc5a7eac2',
  '462716512252329996',
  'SuperAdmin',
  'SUPERSTAFF',
  'default',
  true
) 
ON CONFLICT (discord_id) 
DO UPDATE SET 
  is_superadmin = true,
  role = 'SUPERSTAFF',
  username = 'SuperAdmin';