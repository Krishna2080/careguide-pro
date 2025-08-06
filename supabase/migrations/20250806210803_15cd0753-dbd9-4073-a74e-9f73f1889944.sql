-- Create helper function to fetch user profile safely
CREATE OR REPLACE FUNCTION public.fetch_user_profile(user_id UUID)
RETURNS TABLE (
  id UUID,
  user_id UUID,
  full_name TEXT,
  email TEXT,
  role TEXT,
  phone_number TEXT,
  city TEXT,
  hospital TEXT,
  speciality TEXT,
  years_of_experience INTEGER,
  availability TEXT,
  opd TEXT,
  notes TEXT,
  profile_photo_url TEXT,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)
LANGUAGE SQL
SECURITY DEFINER
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