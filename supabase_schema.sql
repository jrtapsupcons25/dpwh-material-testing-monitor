-- DPWH Material Testing Monitor - Supabase Schema
-- Run this in Supabase SQL Editor

-- 1. Users table (extends Supabase auth)
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  role TEXT NOT NULL CHECK (role IN ('admin', 'me')) DEFAULT 'me',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 2. Projects table
CREATE TABLE public.projects (
  id BIGSERIAL PRIMARY KEY,
  contract_id TEXT NOT NULL UNIQUE,
  project_name TEXT NOT NULL,
  location TEXT,
  contractor TEXT,
  contract_amount NUMERIC,
  calendar_days INT,
  noa_date DATE,
  ntp_date DATE,
  expiry_date DATE,
  assigned_me_id UUID REFERENCES public.users(id),
  project_incharge_id UUID REFERENCES public.users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  created_by UUID REFERENCES public.users(id)
);

-- 3. Material Tests table
CREATE TABLE public.material_tests (
  id BIGSERIAL PRIMARY KEY,
  project_id BIGINT NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  test_code TEXT NOT NULL,
  test_type TEXT,
  testing_center TEXT,
  sample_date DATE,
  submit_date DATE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'submitted', 'completed')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  created_by UUID REFERENCES public.users(id)
);

-- 4. Test Results table
CREATE TABLE public.test_results (
  id BIGSERIAL PRIMARY KEY,
  test_id BIGINT NOT NULL UNIQUE REFERENCES public.material_tests(id) ON DELETE CASCADE,
  result_status TEXT NOT NULL CHECK (result_status IN ('pass', 'fail', 'pending')),
  remarks TEXT,
  release_date DATE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 5. Test Payments table
CREATE TABLE public.test_payments (
  id BIGSERIAL PRIMARY KEY,
  test_id BIGINT NOT NULL UNIQUE REFERENCES public.material_tests(id) ON DELETE CASCADE,
  bill_number TEXT,
  payment_status TEXT NOT NULL CHECK (payment_status IN ('pending', 'paid')) DEFAULT 'pending',
  or_number TEXT,
  payment_date DATE,
  amount NUMERIC,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  updated_by UUID REFERENCES public.users(id)
);

-- 6. Activity Log table (optional, for audit trail)
CREATE TABLE public.activity_log (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES public.users(id),
  action TEXT,
  entity_type TEXT,
  entity_id BIGINT,
  old_value JSONB,
  new_value JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.material_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Users: Users can only see their own profile (except admins see all)
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id OR 
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

-- Projects: Admins see all; MEs see only assigned projects
CREATE POLICY "Admin sees all projects" ON public.projects
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "ME sees assigned projects" ON public.projects
  FOR SELECT USING (
    assigned_me_id = auth.uid() OR 
    project_incharge_id = auth.uid() OR
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admin and assigned users can insert projects" ON public.projects
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admin and assigned users can update projects" ON public.projects
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin') OR
    assigned_me_id = auth.uid() OR
    project_incharge_id = auth.uid()
  );

-- Material Tests: Access based on project assignment
CREATE POLICY "Users see tests for assigned projects" ON public.material_tests
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.projects 
      WHERE projects.id = material_tests.project_id AND (
        projects.assigned_me_id = auth.uid() OR 
        projects.project_incharge_id = auth.uid() OR
        EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
      )
    )
  );

CREATE POLICY "MEs add tests to assigned projects" ON public.material_tests
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.projects 
      WHERE projects.id = material_tests.project_id AND (
        projects.assigned_me_id = auth.uid() OR 
        projects.project_incharge_id = auth.uid() OR
        EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
      )
    )
  );

CREATE POLICY "Users can update own tests" ON public.material_tests
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.projects 
      WHERE projects.id = material_tests.project_id AND (
        projects.assigned_me_id = auth.uid() OR 
        projects.project_incharge_id = auth.uid() OR
        EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
      )
    )
  );

-- Test Results: Users can add/update results for their tests
CREATE POLICY "Users see results for assigned tests" ON public.test_results
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.material_tests 
      JOIN public.projects ON projects.id = material_tests.project_id
      WHERE material_tests.id = test_results.test_id AND (
        projects.assigned_me_id = auth.uid() OR 
        projects.project_incharge_id = auth.uid() OR
        EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
      )
    )
  );

CREATE POLICY "Users add results to assigned tests" ON public.test_results
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.material_tests 
      JOIN public.projects ON projects.id = material_tests.project_id
      WHERE material_tests.id = test_results.test_id AND (
        projects.assigned_me_id = auth.uid() OR 
        projects.project_incharge_id = auth.uid() OR
        EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
      )
    )
  );

-- Test Payments: Only admins can update payments
CREATE POLICY "Everyone sees payment status" ON public.test_payments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.material_tests 
      JOIN public.projects ON projects.id = material_tests.project_id
      WHERE material_tests.id = test_payments.test_id AND (
        projects.assigned_me_id = auth.uid() OR 
        projects.project_incharge_id = auth.uid() OR
        EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
      )
    )
  );

CREATE POLICY "Only admins update payments" ON public.test_payments
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Only admins insert payments" ON public.test_payments
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- Create indexes for performance
CREATE INDEX idx_projects_assigned_me ON public.projects(assigned_me_id);
CREATE INDEX idx_projects_project_incharge ON public.projects(project_incharge_id);
CREATE INDEX idx_tests_project ON public.material_tests(project_id);
CREATE INDEX idx_payments_test ON public.test_payments(test_id);
CREATE INDEX idx_results_test ON public.test_results(test_id);

-- Create a function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply the update_updated_at trigger to tables
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tests_updated_at BEFORE UPDATE ON public.material_tests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON public.test_payments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_results_updated_at BEFORE UPDATE ON public.test_results
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample admin user (change email and password in Supabase Auth dashboard)
-- Then manually insert into users table via Supabase UI or use this with caution:
-- INSERT INTO public.users (id, email, full_name, role) 
-- VALUES ('YOUR_AUTH_ID', 'braulpiano010788@gmail.com', 'Braulio Piano', 'admin');
