-- Atualização do Schema gSocial - Diagnóstico Socioeconômico 2024
-- Local: Supabase Dashboard -> SQL Editor

-- 1. Expansão da tabela de Diagnóstico Territorial (Comunidades)
ALTER TABLE community_assessments 
ADD COLUMN IF NOT EXISTS income_level NUMERIC,
ADD COLUMN IF NOT EXISTS is_edu_desert BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS hanseniase_cases INTEGER DEFAULT 0;

-- 2. Garantir que as tabelas de Auditoria Ambiental e Governança existam
-- (Caso não tenham sido criadas anteriormente)

CREATE TABLE IF NOT EXISTS environmental_assessments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    terminal_name TEXT NOT NULL,
    operation_type TEXT NOT NULL,
    answers JSONB NOT NULL DEFAULT '{}',
    risk_level TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id)
);

CREATE TABLE IF NOT EXISTS governance_assessments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_name TEXT NOT NULL,
    criticality TEXT NOT NULL,
    answers JSONB NOT NULL DEFAULT '{}',
    risk_level TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id)
);

-- 3. Habilitar RLS (Row Level Security) para as novas tabelas
ALTER TABLE environmental_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE governance_assessments ENABLE ROW LEVEL SECURITY;

-- 4. Criar Políticas de Acesso (CRUD)
-- Política para Ambiental
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can manage their own environmental assessments' AND tablename = 'environmental_assessments') THEN
        CREATE POLICY "Users can manage their own environmental assessments"
        ON environmental_assessments FOR ALL
        TO authenticated
        USING (auth.uid() = created_by);
    END IF;
END $$;

-- Política para Governança
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can manage their own governance assessments' AND tablename = 'governance_assessments') THEN
        CREATE POLICY "Users can manage their own governance assessments"
        ON governance_assessments FOR ALL
        TO authenticated
        USING (auth.uid() = created_by);
    END IF;
END $$;

-- Comentários para documentação
COMMENT ON COLUMN community_assessments.income_level IS 'Renda per capita média da comunidade (Ref: 2024)';
COMMENT ON COLUMN community_assessments.is_edu_desert IS 'Indicador de deserto educacional (raio de 2km sem escolas)';
COMMENT ON COLUMN community_assessments.hanseniase_cases IS 'Número de casos de Hanseníase reportados nos últimos 2 anos';
