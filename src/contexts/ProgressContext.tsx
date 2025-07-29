import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ProgressData {
  completedActivities: number;
  totalActivities: number;
  currentStreak: number;
  totalHours: number;
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
  analytics: {
    dailyUsageMinutes: number;
    weeklyProgress: number[];
    strongestHour: number;
    learningVelocity: number;
    engagementScore: number;
  };
}

interface ProgressContextType {
  progress: ProgressData;
  updateProgress: (updates: Partial<ProgressData>) => void;
  addCompletedActivity: () => void;
  addChatInteraction: () => void;
  updateSkillProgress: (skill: string, level: number, trend: 'up' | 'down' | 'stable') => void;
  setLearningStyleResult: (style: string) => void;
  updateCPAProgress: (stage: 'concrete' | 'pictorial' | 'abstract', progress: number) => void;
  addStudyTime: (minutes: number) => void;
  updateEngagementScore: (activity: string, timeSpent: number) => void;
  getInsights: () => string[];
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
    testResults: null,
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
    ],
    analytics: {
      dailyUsageMinutes: 35,
      weeklyProgress: [20, 35, 40, 30, 45, 50, 35],
      strongestHour: 10, // 10am
      learningVelocity: 1.2,
      engagementScore: 85
    }
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

  const updateCPAProgress = (stage: 'concrete' | 'pictorial' | 'abstract', progressValue: number) => {
    setProgress(prev => ({
      ...prev,
      cpaProgress: {
        ...prev.cpaProgress,
        [stage]: progressValue
      }
    }));
  };

  const addStudyTime = (minutes: number) => {
    setProgress(prev => ({
      ...prev,
      totalHours: prev.totalHours + (minutes / 60),
      analytics: {
        ...prev.analytics,
        dailyUsageMinutes: prev.analytics.dailyUsageMinutes + minutes
      }
    }));
  };

  const updateEngagementScore = (activity: string, timeSpent: number) => {
    setProgress(prev => {
      const baseScore = prev.analytics.engagementScore;
      const timeBonus = Math.min(timeSpent / 10, 5); // Max 5 points for time spent
      const newScore = Math.min(baseScore + timeBonus, 100);
      
      return {
        ...prev,
        analytics: {
          ...prev.analytics,
          engagementScore: newScore
        }
      };
    });
  };

  const getInsights = () => {
    const insights = [];
    
    if (progress.currentStreak >= 7) {
      insights.push("Excelente consistência! Você está numa sequência impressionante.");
    }
    
    if (progress.analytics.engagementScore > 80) {
      insights.push("Seu nível de engajamento está ótimo! Continue assim.");
    }
    
    const strongestSkill = progress.skillsProgress.reduce((max, skill) => 
      skill.level > max.level ? skill : max
    );
    insights.push(`Você está se destacando em ${strongestSkill.skill}!`);
    
    return insights;
  };

  return (
    <ProgressContext.Provider value={{
      progress,
      updateProgress,
      addCompletedActivity,
      addChatInteraction,
      updateSkillProgress,
      setLearningStyleResult,
      updateCPAProgress,
      addStudyTime,
      updateEngagementScore,
      getInsights
    }}>
      {children}
    </ProgressContext.Provider>
  );
};