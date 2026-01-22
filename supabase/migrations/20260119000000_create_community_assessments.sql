CREATE TABLE IF NOT EXISTS public.community_assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    community_name TEXT NOT NULL,
    settlement_type TEXT,
    estimated_families INTEGER,
    water_access TEXT,
    sanitation_status TEXT,
    negative_impacts TEXT[],
    priority_needs TEXT[],
    relationship_level INTEGER,
    assessment_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    coordinates JSONB, -- [lng, lat]
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE public.community_assessments ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Enable read for authenticated users" ON public.community_assessments
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Enable insert for authenticated users" ON public.community_assessments
    FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Enable update for own records" ON public.community_assessments
    FOR UPDATE TO authenticated USING (auth.uid() = created_by);

CREATE POLICY "Enable delete for own records" ON public.community_assessments
    FOR DELETE TO authenticated USING (auth.uid() = created_by);
