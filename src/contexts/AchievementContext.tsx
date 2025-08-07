import React, { createContext, useContext, useState, ReactNode } from 'react';

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
      id: "streak_3",
      title: "Começo Consistente",
      description: "Mantenha uma sequência de 3 dias",
      icon: "🔥",
      category: "streak",
      requirement: {
        type: "maintain_streak",
        target: 3,
        current: 0
      },
      isUnlocked: false,
      reward: {
        xp: 50,
        benefits: ["Badge de consistência"]
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
      id: "streak_14",
      title: "Quinzena Firme",
      description: "Mantenha uma sequência de 14 dias",
      icon: "🏆",
      category: "streak",
      requirement: {
        type: "maintain_streak",
        target: 14,
        current: 0
      },
      isUnlocked: false,
      reward: {
        xp: 200,
        benefits: ["Reconhecimento de constância"]
      }
    },
    {
      id: "streak_30",
      title: "Mês de Ouro",
      description: "Mantenha uma sequência de 30 dias",
      icon: "🏅",
      category: "streak",
      requirement: {
        type: "maintain_streak",
        target: 30,
        current: 0
      },
      isUnlocked: false,
      reward: {
        xp: 400,
        benefits: ["Badge lendária de disciplina"]
      }
    },
    {
      id: "level_explorer",
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
    },
    {
      id: "method_master",
      title: "Pensador Visual",
      description: "Resolva 50 problemas pictóricos",
      icon: "👁️",
      category: "mastery",
      requirement: {
        type: "complete_activities",
        target: 50,
        current: 35
      },
      isUnlocked: true,
      unlockedAt: new Date('2024-01-15'),
      reward: {
        xp: 175,
        benefits: ["Visualizações aprimoradas"]
      }
    }
  ]);

  const [unlockedAchievements, setUnlockedAchievements] = useState<Achievement[]>(
    achievements.filter(a => a.isUnlocked)
  );

  const checkAchievements = React.useCallback((progressData: any, xpData: any) => {
    const newlyUnlocked: Achievement[] = [];
    
    const updatedAchievements = achievements.map(achievement => {
      if (achievement.isUnlocked) return achievement;
      
      let shouldUnlock = false;
      const updatedAchievement = { ...achievement };
      
      switch (achievement.requirement.type) {
        case 'complete_activities':
          updatedAchievement.requirement.current = progressData.completedActivities;
          shouldUnlock = progressData.completedActivities >= achievement.requirement.target;
          break;
        case 'maintain_streak':
          updatedAchievement.requirement.current = progressData.currentStreak;
          shouldUnlock = progressData.currentStreak >= achievement.requirement.target;
          break;
        case 'reach_level':
          updatedAchievement.requirement.current = xpData.currentLevel;
          shouldUnlock = xpData.currentLevel >= achievement.requirement.target;
          break;
        case 'use_feature':
          updatedAchievement.requirement.current = progressData.chatInteractions;
          shouldUnlock = progressData.chatInteractions >= achievement.requirement.target;
          break;
      }
      
      if (shouldUnlock) {
        const unlockedAchievement = {
          ...updatedAchievement,
          isUnlocked: true,
          unlockedAt: new Date()
        };
        newlyUnlocked.push(unlockedAchievement);
        return unlockedAchievement;
      }
      
      return updatedAchievement;
    });
    
    // Only update state if there are actual changes
    const hasChanges = updatedAchievements.some((achievement, index) => 
      achievement.requirement.current !== achievements[index].requirement.current ||
      achievement.isUnlocked !== achievements[index].isUnlocked
    );
    
    if (hasChanges) {
      setAchievements(updatedAchievements);
    }
    
    if (newlyUnlocked.length > 0) {
      setUnlockedAchievements(prev => [...prev, ...newlyUnlocked]);
    }
    
    return newlyUnlocked;
  }, [achievements]);

  const unlockAchievement = (achievementId: string) => {
    setAchievements(prev => {
      let changed = false;
      const updated = prev.map(achievement => {
        if (achievement.id === achievementId) {
          if (achievement.isUnlocked) return achievement;
          changed = true;
          return { ...achievement, isUnlocked: true, unlockedAt: new Date() };
        }
        return achievement;
      });
      if (changed) {
        const newly = updated.find(a => a.id === achievementId);
        if (newly && !newly.isUnlocked) return updated; // safety
        setUnlockedAchievements(prevUnlocked => {
          if (prevUnlocked.some(a => a.id === achievementId)) return prevUnlocked;
          return newly ? [...prevUnlocked, newly] : prevUnlocked;
        });
      }
      return updated;
    });
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