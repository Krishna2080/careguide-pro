-- Clean approach: Just handle profiles table properly
-- Remove any existing profiles and let the trigger handle user creation
DELETE FROM public.profiles;

-- Create a simple function to make any user an admin
CREATE OR REPLACE FUNCTION public.make_user_admin(user_email text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.profiles 
  SET role = 'admin' 
  WHERE email = user_email;
  
  -- If no profile exists, this means the user hasn't signed up yet
  IF NOT FOUND THEN
    RAISE NOTICE 'User with email % not found. They need to sign up first.', user_email;
  END IF;
END;
$$;