import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'progress' | 'streak' | 'mastery' | 'exploration';
  requirement: {
    type: 'complete_activities' | 'maintain_streak' | 'reach_level' | 'use_feature';
    target: number;
    current: number;
  };
  isUnlocked: boolean;
  unlockedAt?: Date;
  reward: {
    xp: number;
    benefits: string[];
  };
}

interface AchievementContextType {
  achievements: Achievement[];
  unlockedAchievements: Achievement[];
  checkAchievements: (progressData: any, xpData: any) => Achievement[];
  unlockAchievement: (achievementId: string) => void;
  getProgressTowardsAchievement: (achievementId: string) => number;
}

const AchievementContext = createContext<AchievementContextType | undefined>(undefined);

export const useAchievement = () => {
  const context = useContext(AchievementContext);
  if (!context) {
    throw new Error('useAchievement must be used within an AchievementProvider');
  }
  return context;
};

interface AchievementProviderProps {
  children: ReactNode;
}

export const AchievementProvider: React.FC<AchievementProviderProps> = ({ children }) => {
  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: "first_steps",
      title: "Primeiros Passos",
      description: "Complete sua primeira atividade",
      icon: "🌱",
      category: "progress",
      requirement: {
        type: "complete_activities",
        target: 1,
        current: 0
      },
      isUnlocked: false,
      reward: {
        xp: 25,
        benefits: ["Acesso ao tutor básico"]
      }
    },
    {
      id: "streak_week",
      title: "Semana Dedicada",
      description: "Mantenha uma sequência de 7 dias",
      icon: "🔥",
      category: "streak",
      requirement: {
        type: "maintain_streak",
        target: 7,
        current: 0
      },
      isUnlocked: false,
      reward: {
        xp: 100,
        benefits: ["Multiplicador de XP +10%"]
      }
    },
    {
      id: "level_explorer",
      title: "Explorador",
      description: "Alcance o nível 10",
      icon: "🗺️",
      category: "exploration",
      requirement: {
        type: "reach_level",
        target: 10,
        current: 0
      },
      isUnlocked: false,
      reward: {
        xp: 150,
        benefits: ["Dicas personalizadas", "Análise de padrões"]
      }
    },
    {
      id: "method_master",
      title: "Mestre do Método CPA",
      description: "Complete todas as etapas do método CPA",
      icon: "🏆",
      category: "mastery",
      requirement: {
        type: "complete_activities",
        target: 15,
        current: 0
      },
      isUnlocked: true,
      unlockedAt: new Date('2024-01-15'),
      reward: {
        xp: 200,
        benefits: ["Acesso a problemas avançados"]
      }
    },
    {
      id: "visual_thinker",
      title: "Pensador Visual",
      description: "Resolva 50 problemas pictóricos",
      icon: "👁️",
      category: "mastery",
      requirement: {
        type: "complete_activities",
        target: 50,
        current: 35
      },
      isUnlocked: false,
      reward: {
        xp: 175,
        benefits: ["Visualizações aprimoradas"]
      }
    },
    {
      id: "ai_explorer",
      title: "Explorador de IA",
      description: "Use o tutor IA 20 vezes",
      icon: "🤖",
      category: "exploration",
      requirement: {
        type: "use_feature",
        target: 20,
        current: 15
      },
      isUnlocked: false,
      reward: {
        xp: 125,
        benefits: ["Respostas IA mais detalhadas"]
      }
    }
  ]);

  const [unlockedAchievements, setUnlockedAchievements] = useState<Achievement[]>(
    achievements.filter(a => a.isUnlocked)
  );

  const checkAchievements = useCallback((progressData: any, xpData: any) => {
    const newlyUnlocked: Achievement[] = [];
    
    setAchievements(prev => prev.map(achievement => {
      if (achievement.isUnlocked) return achievement;
      
      let shouldUnlock = false;
      
      switch (achievement.requirement.type) {
        case 'complete_activities':
          achievement.requirement.current = progressData.completedActivities;
          shouldUnlock = progressData.completedActivities >= achievement.requirement.target;
          break;
        case 'maintain_streak':
          achievement.requirement.current = progressData.currentStreak;
          shouldUnlock = progressData.currentStreak >= achievement.requirement.target;
          break;
        case 'reach_level':
          achievement.requirement.current = xpData.currentLevel;
          shouldUnlock = xpData.currentLevel >= achievement.requirement.target;
          break;
        case 'use_feature':
          achievement.requirement.current = progressData.chatInteractions;
          shouldUnlock = progressData.chatInteractions >= achievement.requirement.target;
          break;
      }
      
      if (shouldUnlock) {
        const unlockedAchievement = {
          ...achievement,
          isUnlocked: true,
          unlockedAt: new Date()
        };
        newlyUnlocked.push(unlockedAchievement);
        return unlockedAchievement;
      }
      
      return achievement;
    }));
    
    if (newlyUnlocked.length > 0) {
      setUnlockedAchievements(prev => [...prev, ...newlyUnlocked]);
    }
    
    return newlyUnlocked;
  }, []);

  const unlockAchievement = (achievementId: string) => {
    setAchievements(prev => prev.map(achievement => 
      achievement.id === achievementId 
        ? { ...achievement, isUnlocked: true, unlockedAt: new Date() }
        : achievement
    ));
  };

  const getProgressTowardsAchievement = (achievementId: string) => {
    const achievement = achievements.find(a => a.id === achievementId);
    if (!achievement) return 0;
    
    return Math.min(
      Math.round((achievement.requirement.current / achievement.requirement.target) * 100),
      100
    );
  };

  return (
    <AchievementContext.Provider value={{
      achievements,
      unlockedAchievements,
      checkAchievements,
      unlockAchievement,
      getProgressTowardsAchievement
    }}>
      {children}
    </AchievementContext.Provider>
  );
};