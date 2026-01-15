-- Atualizar o usuário para master admin baseado no e-mail
UPDATE public.profiles
SET role = 'master'
WHERE email = 'evanildobarros@gmail.com';
