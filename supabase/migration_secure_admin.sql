-- Prevent users from updating their own is_admin status via API
-- This trigger ensures that even if RLS allows UPDATE on the row, 
-- the is_admin column cannot be changed by the user themselves.

CREATE OR REPLACE FUNCTION public.prevent_admin_self_grant()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if is_admin is being changed
  IF NEW.is_admin IS DISTINCT FROM OLD.is_admin THEN
    -- If the user is updating their own record (standard RLS case)
    -- and they are not a service_role (admin bypass)
    -- We assume auth.role() = 'authenticated' for normal users
    
    -- Note: We can't easily check if the *actor* is admin inside the trigger 
    -- without checking the table itself, which might be recursive.
    -- SAFE APPROACH: Disallow changing is_admin via standard API completely.
    -- Only allow it if executed by a superuser/service_role (Dashboard SQL Editor).
    
    IF auth.role() != 'service_role' THEN
        RAISE EXCEPTION 'You are not authorized to change administrative privileges.';
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_protect_admin_column ON public.users;

CREATE TRIGGER on_protect_admin_column
BEFORE UPDATE ON public.users
FOR EACH ROW
EXECUTE FUNCTION public.prevent_admin_self_grant();
