import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface UserProgress {
  id: string;
  tempo_estudo: number;
  atividades_completadas: any;
  pontuacao_total: number;
  ultimo_acesso: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  ei_checkin_streak: number;
  ei_last_checkin_date: string | null;
}

export const useUserProgress = () => {
  const { user } = useAuth();
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setProgress(null);
      setLoading(false);
      return;
    }

    const fetchProgress = async () => {
      try {
        const { data, error } = await supabase
          .from('progresso')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching progress:', error);
        } else {
          setProgress(data);
        }
      } catch (error) {
        console.error('Error fetching progress:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [user]);

  const updateProgress = async (updates: Partial<Omit<UserProgress, 'id' | 'user_id' | 'created_at' | 'updated_at'>>) => {
    if (!user || !progress) return;

    try {
      const { data, error } = await supabase
        .from('progresso')
        .update({
          ...updates,
          ultimo_acesso: new Date().toISOString()
        })
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating progress:', error);
      } else {
        setProgress(data);
      }
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const addStudyTime = async (minutes: number) => {
    if (!progress) return;
    
    await updateProgress({
      tempo_estudo: progress.tempo_estudo + minutes
    });
  };

  const addCompletedActivity = async (activity: string) => {
    if (!progress) return;
    
    const activities = Array.isArray(progress.atividades_completadas) 
      ? progress.atividades_completadas 
      : [];
    
    if (!activities.includes(activity)) {
      await updateProgress({
        atividades_completadas: [...activities, activity]
      });
    }
  };

  const addPoints = async (points: number) => {
    if (!progress) return;
    
    await updateProgress({
      pontuacao_total: progress.pontuacao_total + points
    });
  };

  const getActivitiesCount = () => {
    if (!progress) return 0;
    return Array.isArray(progress.atividades_completadas) 
      ? progress.atividades_completadas.length 
      : 0;
  };

  return {
    progress,
    loading,
    updateProgress,
    addStudyTime,
    addCompletedActivity,
    addPoints,
    getActivitiesCount
  };
};