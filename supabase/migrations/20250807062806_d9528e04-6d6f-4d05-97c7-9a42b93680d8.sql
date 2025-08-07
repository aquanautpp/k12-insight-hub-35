-- Adicionar campos à tabela profiles
ALTER TABLE public.profiles 
ADD COLUMN nome TEXT,
ADD COLUMN estilo_aprendizagem TEXT,
ADD COLUMN nivel_atual INTEGER DEFAULT 1;

-- Criar tabela de progresso
CREATE TABLE public.progresso (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tempo_estudo INTEGER DEFAULT 0, -- em minutos
  atividades_completadas JSONB DEFAULT '[]'::jsonb,
  pontuacao_total INTEGER DEFAULT 0,
  ultimo_acesso TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de histórico de chat
CREATE TABLE public.chat_historico (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  mensagem TEXT NOT NULL,
  resposta TEXT,
  estagio_cpa TEXT,
  topico TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS nas novas tabelas
ALTER TABLE public.progresso ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_historico ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para progresso
CREATE POLICY "Users can view their own progress" 
ON public.progresso 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress" 
ON public.progresso 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress" 
ON public.progresso 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Políticas RLS para chat_historico
CREATE POLICY "Users can view their own chat history" 
ON public.chat_historico 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own chat history" 
ON public.chat_historico 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Trigger para atualizar updated_at no progresso
CREATE TRIGGER update_progresso_updated_at
BEFORE UPDATE ON public.progresso
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Atualizar função handle_new_user para incluir novos campos
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Criar perfil
  INSERT INTO public.profiles (user_id, display_name, username, nome)
  VALUES (
    NEW.id, 
    NEW.raw_user_meta_data->>'display_name',
    NEW.raw_user_meta_data->>'username',
    NEW.raw_user_meta_data->>'nome'
  );
  
  -- Criar registro de progresso inicial
  INSERT INTO public.progresso (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';