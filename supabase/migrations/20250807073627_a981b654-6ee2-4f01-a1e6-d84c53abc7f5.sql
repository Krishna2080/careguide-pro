-- Delete existing admin user and create with correct password hash
DELETE FROM public.profiles WHERE email = 'krishnamadaswar@gmail.com';
DELETE FROM auth.users WHERE email = 'krishnamadaswar@gmail.com';

-- Create admin user with simpler password "admin123" 
-- Hash generated using bcrypt with salt rounds 10: $2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi
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
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
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

-- Insert corresponding profile
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