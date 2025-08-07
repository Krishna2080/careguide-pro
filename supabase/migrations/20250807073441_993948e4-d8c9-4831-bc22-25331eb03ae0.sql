-- Fix duplicate profile issue by using UPSERT instead of INSERT
-- First delete any existing admin user to start fresh
DELETE FROM public.profiles WHERE email = 'krishnamadaswar@gmail.com';
DELETE FROM auth.users WHERE email = 'krishnamadaswar@gmail.com';

-- Insert fresh admin user
INSERT INTO auth.users (
    id,
    instance_id,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    confirmation_token,
    email_change_token_new,
    recovery_token,
    email_change_token_current,
    raw_user_meta_data,
    is_super_admin,
    role
) VALUES (
    '4d018f6d-7684-43fb-92f0-d930accdd925',
    '00000000-0000-0000-0000-000000000000',
    'krishnamadaswar@gmail.com',
    '$2a$10$9JZJo7XqVr6Kb9vKw.7YWeNbJzGJOmZrZl5tS7rHvEKq8Zj3BLbHS',
    now(),
    now(),
    now(),
    '',
    '',
    '',
    '',
    '{"full_name": "Admin User", "role": "admin"}'::jsonb,
    false,
    'authenticated'
);

-- Insert corresponding profile using UPSERT to avoid duplicates
INSERT INTO public.profiles (
    user_id,
    full_name,
    email,
    role,
    created_at,
    updated_at
) VALUES (
    '4d018f6d-7684-43fb-92f0-d930accdd925',
    'Admin User',
    'krishnamadaswar@gmail.com',
    'admin',
    now(),
    now()
) ON CONFLICT (user_id) 
DO UPDATE SET 
    full_name = EXCLUDED.full_name,
    email = EXCLUDED.email,
    role = EXCLUDED.role,
    updated_at = now();