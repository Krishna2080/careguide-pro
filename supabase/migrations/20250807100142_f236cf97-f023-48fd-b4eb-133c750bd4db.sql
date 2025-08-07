-- Create a function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Create policy to allow admins to delete any profile
CREATE POLICY "Admins can delete any profile" ON public.profiles
FOR DELETE 
TO authenticated
USING (public.is_admin());