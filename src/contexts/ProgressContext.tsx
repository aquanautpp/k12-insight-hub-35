import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'learning' | 'streak' | 'mastery' | 'social' | 'special';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockedAt?: Date;
  progress?: {
    current: number;
    target: number;
  };
  rewards: {
    xp: number;
    unlocks?: string[];
  };
}

interface ProgressData {
  completedActivities: number;
  totalActivities: number;
  currentStreak: number;
  totalHours: number;
  currentXP: number;
  currentLevel: number;
  xpToNextLevel: number;
  totalXPForNextLevel: number;
  recentXPGains: Array<{
    activity: string;
    xp: number;
    timestamp: Date;
  }>;
  achievements: Achievement[];
  completedChallenges: string[];
  userPreferences: string[];
  testResults: {
    learningStyle: string;
    completedAt: Date;
  } | null;
  cpaProgress: {
    concrete: number;
    pictorial: number;
    abstract: number;
  };
  chatInteractions: number;
  skillsProgress: Array<{
    skill: string;
    level: number;
    trend: 'up' | 'down' | 'stable';
  }>;
}

interface ProgressContextType {
  progress: ProgressData;
  updateProgress: (updates: Partial<ProgressData>) => void;
  addCompletedActivity: () => void;
  addChatInteraction: () => void;
  addXP: (activity: string, xp: number) => void;
  unlockAchievement: (achievementId: string) => void;
  completeChallenge: (challengeId: string) => void;
  updateSkillProgress: (skill: string, level: number, trend: 'up' | 'down' | 'stable') => void;
  setLearningStyleResult: (style: string) => void;
  updateCPAProgress: (stage: 'concrete' | 'pictorial' | 'abstract', progress: number) => void;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
};

interface ProgressProviderProps {
  children: ReactNode;
}

export const ProgressProvider: React.FC<ProgressProviderProps> = ({ children }) => {
  const [progress, setProgress] = useState<ProgressData>({
    completedActivities: 5,
    totalActivities: 20,
    currentStreak: 3,
    totalHours: 12.5,
    currentXP: 2450,
    currentLevel: 12,
    xpToNextLevel: 550,
    totalXPForNextLevel: 1000,
    recentXPGains: [
      { activity: 'Método CPA - Concreto', xp: 150, timestamp: new Date(Date.now() - 86400000) },
      { activity: 'Desafio Diário', xp: 100, timestamp: new Date(Date.now() - 172800000) },
      { activity: 'Chat com Meraki', xp: 50, timestamp: new Date(Date.now() - 259200000) }
    ],
    achievements: [
      {
        id: 'first_week',
        title: 'Primeira Semana',
        description: 'Complete sua primeira semana de estudos',
        icon: '🏆',
        category: 'learning',
        rarity: 'common',
        unlockedAt: new Date(Date.now() - 604800000),
        rewards: { xp: 100 }
      },
      {
        id: 'cpa_master',
        title: 'Mestre do CPA',
        description: 'Complete todos os estágios do método CPA',
        icon: '🎯',
        category: 'mastery',
        rarity: 'rare',
        unlockedAt: new Date(Date.now() - 259200000),
        rewards: { xp: 250, unlocks: ['Método CPA Avançado'] }
      },
      {
        id: 'chat_explorer',
        title: 'Explorador de Chat',
        description: 'Tenha 50 conversas com a Meraki',
        icon: '🤖',
        category: 'social',
        rarity: 'epic',
        progress: { current: 15, target: 50 },
        rewards: { xp: 500 }
      }
    ],
    completedChallenges: ['math_001', 'daily_001'],
    userPreferences: ['mathematics', 'logic', 'visual'],
    testResults: {
      learningStyle: 'visual',
      completedAt: new Date(Date.now() - 604800000)
    },
    cpaProgress: {
      concrete: 75,
      pictorial: 60,
      abstract: 30
    },
    chatInteractions: 15,
    skillsProgress: [
      { skill: 'Raciocínio Lógico', level: 75, trend: 'up' },
      { skill: 'Resolução de Problemas', level: 68, trend: 'up' },
      { skill: 'Pensamento Crítico', level: 82, trend: 'stable' },
      { skill: 'Criatividade', level: 70, trend: 'up' },
    ]
  });

  const updateProgress = (updates: Partial<ProgressData>) => {
    setProgress(prev => ({ ...prev, ...updates }));
  };

  const addCompletedActivity = () => {
    setProgress(prev => ({
      ...prev,
      completedActivities: prev.completedActivities + 1,
      totalHours: prev.totalHours + 0.5,
    }));
  };

  const addChatInteraction = () => {
    setProgress(prev => ({
      ...prev,
      chatInteractions: prev.chatInteractions + 1
    }));
  };

  const updateSkillProgress = (skill: string, level: number, trend: 'up' | 'down' | 'stable') => {
    setProgress(prev => ({
      ...prev,
      skillsProgress: prev.skillsProgress.map(s =>
        s.skill === skill ? { ...s, level, trend } : s
      )
    }));
  };

  const setLearningStyleResult = (style: string) => {
    setProgress(prev => ({
      ...prev,
      testResults: {
        learningStyle: style,
        completedAt: new Date()
      }
    }));
  };

  const addXP = (activity: string, xp: number) => {
    setProgress(prev => {
      const newXP = prev.currentXP + xp;
      let newLevel = prev.currentLevel;
      let xpToNext = prev.xpToNextLevel - xp;
      let totalXPForNext = prev.totalXPForNextLevel;

      // Level up logic
      while (xpToNext <= 0) {
        newLevel++;
        totalXPForNext = newLevel * 250; // Escala de XP por nível
        xpToNext = totalXPForNext + xpToNext;
      }

      return {
        ...prev,
        currentXP: newXP,
        currentLevel: newLevel,
        xpToNextLevel: xpToNext,
        totalXPForNextLevel: totalXPForNext,
        recentXPGains: [
          { activity, xp, timestamp: new Date() },
          ...prev.recentXPGains.slice(0, 9)
        ]
      };
    });
  };

  const unlockAchievement = (achievementId: string) => {
    setProgress(prev => ({
      ...prev,
      achievements: prev.achievements.map(achievement =>
        achievement.id === achievementId
          ? { ...achievement, unlockedAt: new Date(), progress: undefined }
          : achievement
      )
    }));
  };

  const completeChallenge = (challengeId: string) => {
    setProgress(prev => ({
      ...prev,
      completedChallenges: [...prev.completedChallenges, challengeId]
    }));
  };

  const updateCPAProgress = (stage: 'concrete' | 'pictorial' | 'abstract', progressValue: number) => {
    setProgress(prev => ({
      ...prev,
      cpaProgress: {
        ...prev.cpaProgress,
        [stage]: progressValue
      }
    }));
  };

  return (
    <ProgressContext.Provider value={{
      progress,
      updateProgress,
      addCompletedActivity,
      addChatInteraction,
      addXP,
      unlockAchievement,
      completeChallenge,
      updateSkillProgress,
      setLearningStyleResult,
      updateCPAProgress
    }}>
      {children}
    </ProgressContext.Provider>
  );
};