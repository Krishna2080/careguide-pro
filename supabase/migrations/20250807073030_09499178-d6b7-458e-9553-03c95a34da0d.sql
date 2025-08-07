-- Clear any existing admin profiles and create fresh admin user
DELETE FROM public.profiles WHERE role = 'admin';

-- Insert admin user directly into auth.users with proper password hash
INSERT INTO auth.users (
    id,
    instance_id,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    role,
    aud,
    raw_user_meta_data
) VALUES (
    '28c5ddbf-8aa9-476f-92a9-82fca75bf680',
    '00000000-0000-0000-0000-000000000000',
    'krishnamadaswar@gmail.com',
    crypt('Padmanabh@1234', gen_salt('bf')),
    now(),
    now(),
    now(),
    'authenticated',
    'authenticated',
    '{"role": "admin", "full_name": "Admin User"}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    encrypted_password = EXCLUDED.encrypted_password,
    email_confirmed_at = EXCLUDED.email_confirmed_at,
    updated_at = EXCLUDED.updated_at,
    raw_user_meta_data = EXCLUDED.raw_user_meta_data;

-- Insert corresponding profile
INSERT INTO public.profiles (
    user_id,
    full_name,
    email,
    role,
    created_at,
    updated_at
) VALUES (
    '28c5ddbf-8aa9-476f-92a9-82fca75bf680',
    'Admin User',
    'krishnamadaswar@gmail.com',
    'admin',
    now(),
    now()
) ON CONFLICT (user_id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    email = EXCLUDED.email,
    role = EXCLUDED.role,
    updated_at = EXCLUDED.updated_at;