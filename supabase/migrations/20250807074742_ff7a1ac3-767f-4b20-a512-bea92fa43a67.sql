-- Fix the remaining function
CREATE OR REPLACE FUNCTION public.fetch_user_profile(user_id uuid)
RETURNS TABLE(id uuid, user_id uuid, full_name text, email text, role text, phone_number text, city text, hospital text, speciality text, years_of_experience integer, availability text, opd text, notes text, profile_photo_url text, created_at timestamp with time zone, updated_at timestamp with time zone)
LANGUAGE sql
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT 
    p.id,
    p.user_id,
    p.full_name,
    p.email,
    p.role,
    p.phone_number,
    p.city,
    p.hospital,
    p.speciality,
    p.years_of_experience,
    p.availability,
    p.opd,
    p.notes,
    p.profile_photo_url,
    p.created_at,
    p.updated_at
  FROM public.profiles p
  WHERE p.user_id = fetch_user_profile.user_id
  LIMIT 1;
$$;