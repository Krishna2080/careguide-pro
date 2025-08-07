-- Update or create admin profile with new credentials
INSERT INTO public.profiles (
  user_id,
  full_name,
  email,
  role,
  created_at,
  updated_at
) VALUES (
  '916309a0-b4a4-4317-aa48-53fd1f26b0e7',
  'Admin',
  'krishnamadaswar@gmail.com',
  'admin',
  now(),
  now()
)
ON CONFLICT (user_id) DO UPDATE SET
  full_name = 'Admin',
  email = 'krishnamadaswar@gmail.com',
  role = 'admin',
  updated_at = now();