-- Add username column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN username TEXT UNIQUE;

-- Create index for faster username lookups
CREATE INDEX idx_profiles_username ON public.profiles(username);

-- Create policy for username access
CREATE POLICY "Users can view usernames" 
ON public.profiles 
FOR SELECT 
USING (true);

-- Create function to check if username is available
CREATE OR REPLACE FUNCTION public.is_username_available(check_username TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN NOT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE username = check_username
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get user email by username
CREATE OR REPLACE FUNCTION public.get_email_by_username(lookup_username TEXT)
RETURNS TEXT AS $$
DECLARE
  user_email TEXT;
BEGIN
  SELECT au.email INTO user_email
  FROM public.profiles p
  JOIN auth.users au ON p.user_id = au.id
  WHERE p.username = lookup_username;
  
  RETURN user_email;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;