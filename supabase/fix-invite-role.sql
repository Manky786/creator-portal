-- Fix: Invited users should ALWAYS be creators, regardless of email domain
-- Only non-invited @stage.in users become admins
-- Run this in Supabase SQL Editor

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  user_role TEXT;
  has_invite BOOLEAN;
BEGIN
  -- Check if user signed up with an invite code
  has_invite := (NEW.raw_user_meta_data->>'invite_code') IS NOT NULL
                AND (NEW.raw_user_meta_data->>'invite_code') != '';

  -- If user has invite code, they are ALWAYS a creator
  -- Only @stage.in users WITHOUT invite become admins
  IF has_invite THEN
    user_role := 'creator';
  ELSIF NEW.email LIKE '%@stage.in' THEN
    user_role := 'admin';
  ELSE
    user_role := 'creator';
  END IF;

  -- Create profile
  INSERT INTO public.profiles (id, email, phone, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.phone,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
    user_role
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
