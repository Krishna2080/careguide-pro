-- Allow public read access to doctor profiles for the directory
CREATE POLICY "Public can view doctor profiles" ON public.profiles
FOR SELECT USING (role = 'doctor');

-- Also ensure profiles with complete information are visible
-- Update existing data to ensure no critical fields are null
UPDATE public.profiles 
SET 
  full_name = COALESCE(full_name, email),
  speciality = COALESCE(speciality, 'General Medicine'),
  city = COALESCE(city, 'Not Specified'),
  hospital = COALESCE(hospital, 'Not Specified'),
  availability = COALESCE(availability, 'Available'),
  phone_number = COALESCE(phone_number, 'Contact via email')
WHERE role = 'doctor' AND (
  full_name IS NULL OR 
  speciality IS NULL OR 
  city IS NULL OR 
  hospital IS NULL OR 
  availability IS NULL OR
  phone_number IS NULL
);