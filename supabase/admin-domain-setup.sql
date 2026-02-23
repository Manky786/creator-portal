-- =============================================
-- STAGE Creator Portal - Admin Domain Setup
-- @stage.in emails = Automatic Admin
-- Run this in Supabase SQL Editor
-- =============================================

-- Drop existing trigger first
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Update the function to check email domain
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  user_role TEXT;
BEGIN
  -- Check if email ends with @stage.in → make admin
  IF NEW.email LIKE '%@stage.in' THEN
    user_role := 'admin';
  ELSE
    user_role := 'creator';
  END IF;

  -- Create profile with appropriate role
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

-- Recreate the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================
-- Done! Now:
-- @stage.in emails → Automatic ADMIN
-- All other emails → Creator
-- =============================================
