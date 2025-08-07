-- Inserir registro de progresso para o usuário existente
INSERT INTO public.progresso (user_id, tempo_estudo, atividades_completadas, pontuacao_total, ultimo_acesso)
VALUES (
  'a227e569-77ec-4104-95d8-0245b5adea4e',
  0,
  '[]'::jsonb,
  0,
  now()
);

-- Atualizar perfil com nome completo se necessário  
UPDATE public.profiles 
SET 
  nome = 'HBS',
  display_name = 'HBS'
WHERE user_id = 'a227e569-77ec-4104-95d8-0245b5adea4e';