-- Fix security warnings by setting search_path for functions
CREATE OR REPLACE FUNCTION public.is_username_available(check_username TEXT)
RETURNS BOOLEAN 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = ''
AS $$
BEGIN
  RETURN NOT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE username = check_username
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.get_email_by_username(lookup_username TEXT)
RETURNS TEXT 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = ''
AS $$
DECLARE
  user_email TEXT;
BEGIN
  SELECT au.email INTO user_email
  FROM public.profiles p
  JOIN auth.users au ON p.user_id = au.id
  WHERE p.username = lookup_username;
  
  RETURN user_email;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'display_name');
  RETURN NEW;
END;
$$;