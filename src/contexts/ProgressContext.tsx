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
}

interface ProgressContextType {
  progress: ProgressData;
  updateProgress: (updates: Partial<ProgressData>) => void;
  addCompletedActivity: () => void;
  addChatInteraction: () => void;
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
      updateSkillProgress,
      setLearningStyleResult,
      updateCPAProgress
    }}>
      {children}
    </ProgressContext.Provider>
  );
};