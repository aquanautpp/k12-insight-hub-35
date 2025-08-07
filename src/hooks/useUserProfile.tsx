import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface UserProfile {
  id: string;
  user_id: string;
  username: string | null;
  display_name: string | null;
  avatar_url: string | null;
  nome: string | null;
  estilo_aprendizagem: string | null;
  nivel_atual: number | null;
}

export const useUserProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching profile:', error);
        } else {
          setProfile(data);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const getDisplayName = () => {
    if (!user) return '';
    
    // Priority: nome > username > display_name > email
    if (profile?.nome) return profile.nome;
    if (profile?.username) return profile.username;
    if (profile?.display_name) return profile.display_name;
    return user.email || '';
  };

  return {
    profile,
    loading,
    displayName: getDisplayName(),
    username: profile?.username,
    nome: profile?.nome,
    estilo_aprendizagem: profile?.estilo_aprendizagem,
    nivel_atual: profile?.nivel_atual,
    email: user?.email
  };
};