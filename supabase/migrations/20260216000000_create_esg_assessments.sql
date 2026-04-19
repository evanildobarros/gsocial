
-- 1. Create environmental_assessments table
CREATE TABLE IF NOT EXISTS environmental_assessments (
    id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    terminal_name TEXT NOT NULL,
    operation_type TEXT NOT NULL,
    answers JSONB NOT NULL DEFAULT '{}'::jsonb,
    risk_level TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    created_by UUID REFERENCES auth.users(id)
);

-- 2. Create governance_assessments table
CREATE TABLE IF NOT EXISTS governance_assessments (
    id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    company_name TEXT NOT NULL,
    criticality TEXT NOT NULL,
    answers JSONB NOT NULL DEFAULT '{}'::jsonb,
    risk_level TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    created_by UUID REFERENCES auth.users(id)
);

-- 3. Set up Row Level Security (RLS)
ALTER TABLE environmental_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE governance_assessments ENABLE ROW LEVEL SECURITY;

-- 4. Policies for environmental_assessments (Restricted to owner)
DROP POLICY IF EXISTS "Enable all for authenticated users" ON environmental_assessments;
CREATE POLICY "Users can manage their own environmental assessments" ON environmental_assessments
    FOR ALL USING (auth.uid() = created_by);

-- 5. Policies for governance_assessments (Restricted to owner)
DROP POLICY IF EXISTS "Enable all for authenticated users" ON governance_assessments;
CREATE POLICY "Users can manage their own governance assessments" ON governance_assessments
    FOR ALL USING (auth.uid() = created_by);

-- 6. Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_env_terminal_name ON environmental_assessments (terminal_name);
CREATE INDEX IF NOT EXISTS idx_gov_company_name ON governance_assessments (company_name);
CREATE INDEX IF NOT EXISTS idx_env_user_created ON environmental_assessments (created_by, created_at);
CREATE INDEX IF NOT EXISTS idx_gov_user_created ON governance_assessments (created_by, created_at);
