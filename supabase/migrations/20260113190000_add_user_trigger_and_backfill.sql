-- 1. Função para criar perfil automaticamente quando um novo usuário se cadastra
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, role, created_at, updated_at)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.email,
    'user', -- Role padrão
    nom(),
    now()
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Trigger que dispara a função acima após um INSERT em auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 3. (IMPORTANTE) "Backfill": Criar perfis para usuários que já existem mas não têm perfil
INSERT INTO public.profiles (id, email, full_name, role, created_at, updated_at)
SELECT 
  id, 
  email, 
  COALESCE(raw_user_meta_data->>'full_name', 'Usuário Sem Nome'), -- Fallback para nome
  'user',
  created_at,
  updated_at
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.profiles);
