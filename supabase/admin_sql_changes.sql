-- Admin users table and RBAC helper
CREATE TABLE IF NOT EXISTS public.admin_users (
  user_id uuid PRIMARY KEY,
  added_at timestamptz DEFAULT now()
);

-- Example: grant select on admin_users to authenticated (optional)
GRANT SELECT ON public.admin_users TO authenticated;

-- Policy: only admin users can manage career_applications (select/update/delete)
ALTER TABLE public.career_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admins manage career_applications" ON public.career_applications
  FOR ALL
  USING (
    EXISTS (SELECT 1 FROM public.admin_users au WHERE au.user_id = auth.uid())
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.admin_users au WHERE au.user_id = auth.uid())
  );

-- If you need applicants (public) to INSERT applications without auth, add an insert policy that allows anonymous inserts.
-- Example allowing anyone to insert (adjust as needed):
-- CREATE POLICY "public insert applications" ON public.career_applications
--   FOR INSERT
--   WITH CHECK (true);

-- Note: After applying these policies, make sure service-role operations (server endpoints) use the service role key.
-- To add an admin user, run:
-- INSERT INTO public.admin_users (user_id) VALUES ('<user-uuid>');
