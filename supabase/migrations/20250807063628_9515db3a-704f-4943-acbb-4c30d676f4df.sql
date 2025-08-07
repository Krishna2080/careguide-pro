-- Delete the old admin user
DELETE FROM auth.users WHERE email = 'admin@medicaldirectory.com';

-- Update the admin profile if it exists, or create a new one
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  confirmation_token,
  recovery_token,
  email_change_token_new,
  email_change,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  last_sign_in_at,
  phone,
  phone_confirmed_at,
  phone_change,
  phone_change_token,
  phone_change_sent_at,
  email_change_token_current,
  email_change_confirm_status,
  banned_until,
  reauthentication_token,
  reauthentication_sent_at,
  is_sso_user,
  deleted_at
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '916309a0-b4a4-4317-aa48-53fd1f26b0e7',
  'authenticated',
  'authenticated',
  'krishnamadaswar@gmail.com',
  crypt('Padmanabh@1234', gen_salt('bf')),
  now(),
  now(),
  now(),
  '',
  '',
  '',
  '',
  '{"provider": "email", "providers": ["email"]}',
  '{"full_name": "Admin", "role": "admin"}',
  false,
  null,
  null,
  null,
  '',
  '',
  null,
  '',
  0,
  null,
  '',
  null,
  false,
  null
)
ON CONFLICT (email) DO UPDATE SET
  encrypted_password = crypt('Padmanabh@1234', gen_salt('bf')),
  raw_user_meta_data = '{"full_name": "Admin", "role": "admin"}',
  updated_at = now();

-- Create or update the admin profile
INSERT INTO public.profiles (
  id,
  user_id,
  full_name,
  email,
  role,
  created_at,
  updated_at
) VALUES (
  '916309a0-b4a4-4317-aa48-53fd1f26b0e7',
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