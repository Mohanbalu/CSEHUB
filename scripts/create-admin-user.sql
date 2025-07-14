-- Create admin user with specific credentials
-- First, we need to insert into auth.users (this would normally be done through Supabase Auth)
-- For demo purposes, here are the credentials:

-- Admin Email: admin@csehub.com
-- Admin Password: admin123

-- Update the profiles table to set admin role for this email
INSERT INTO profiles (id, email, full_name, role, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'admin@csehub.com',
  'Admin User',
  'admin',
  NOW(),
  NOW()
)
ON CONFLICT (email) DO UPDATE SET
  role = 'admin',
  full_name = 'Admin User',
  updated_at = NOW();

-- Note: In a real application, you would create the user through Supabase Auth UI
-- or use the Supabase client to sign up the user first, then update their role
