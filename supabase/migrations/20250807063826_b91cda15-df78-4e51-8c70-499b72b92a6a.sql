-- Verificar se a função handle_new_user existe
SELECT 
  routine_name,
  routine_type,
  routine_definition
FROM information_schema.routines 
WHERE routine_name = 'handle_new_user'
AND routine_schema = 'public';

-- Verificar se o trigger existe no auth.users
SELECT 
  trigger_name,
  event_manipulation,
  trigger_schema,
  event_object_table
FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';