import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface ChatMessage {
  id: string;
  mensagem: string;
  resposta: string | null;
  estagio_cpa: string | null;
  topico: string | null;
  created_at: string;
}

export const useChatHistory = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setMessages([]);
      setLoading(false);
      return;
    }

    const fetchHistory = async () => {
      try {
        const { data, error } = await supabase
          .from('chat_historico')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: true });

        if (error) {
          console.error('Error fetching chat history:', error);
        } else {
          setMessages(data || []);
        }
      } catch (error) {
        console.error('Error fetching chat history:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [user]);

  const saveChatMessage = async (
    mensagem: string, 
    resposta?: string, 
    estagio_cpa?: string, 
    topico?: string
  ) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('chat_historico')
        .insert({
          user_id: user.id,
          mensagem,
          resposta: resposta || null,
          estagio_cpa: estagio_cpa || null,
          topico: topico || null
        })
        .select()
        .single();

      if (error) {
        console.error('Error saving chat message:', error);
      } else {
        setMessages(prev => [...prev, data]);
      }
    } catch (error) {
      console.error('Error saving chat message:', error);
    }
  };

  const getLastConversation = () => {
    return messages.slice(-10); // Últimas 10 mensagens
  };

  return {
    messages,
    loading,
    saveChatMessage,
    getLastConversation
  };
};