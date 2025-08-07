-- First, fix the confirmation_token NULL issue
UPDATE auth.users 
SET confirmation_token = '' 
WHERE confirmation_token IS NULL;

-- Create or update admin user using the correct unique constraint (id)
DO $$
DECLARE
    admin_user_id uuid;
BEGIN
    -- Try to find existing admin user by email
    SELECT id INTO admin_user_id 
    FROM auth.users 
    WHERE email = 'krishnamadaswar@gmail.com';
    
    IF admin_user_id IS NULL THEN
        -- Create new admin user
        INSERT INTO auth.users (
            id,
            email,
            encrypted_password,
            email_confirmed_at,
            created_at,
            updated_at,
            raw_user_meta_data,
            role,
            aud,
            confirmation_token,
            email_change_token_new,
            recovery_token
        ) VALUES (
            gen_random_uuid(),
            'krishnamadaswar@gmail.com',
            crypt('Padmanabh@1234', gen_salt('bf')),
            now(),
            now(),
            now(),
            '{"full_name": "Admin User", "role": "admin"}'::jsonb,
            'authenticated',
            'authenticated',
            '',
            '',
            ''
        ) RETURNING id INTO admin_user_id;
    ELSE
        -- Update existing user
        UPDATE auth.users 
        SET 
            encrypted_password = crypt('Padmanabh@1234', gen_salt('bf')),
            email_confirmed_at = now(),
            updated_at = now(),
            raw_user_meta_data = '{"full_name": "Admin User", "role": "admin"}'::jsonb,
            confirmation_token = '',
            email_change_token_new = '',
            recovery_token = ''
        WHERE id = admin_user_id;
    END IF;
    
    -- Create or update profile
    INSERT INTO public.profiles (
        user_id,
        full_name,
        email,
        role
    ) VALUES (
        admin_user_id,
        'Admin User',
        'krishnamadaswar@gmail.com',
        'admin'
    ) ON CONFLICT (user_id) DO UPDATE SET
        full_name = EXCLUDED.full_name,
        email = EXCLUDED.email,
        role = EXCLUDED.role,
        updated_at = now();
        
END $$;