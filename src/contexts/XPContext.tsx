import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface XPData {
  currentXP: number;
  currentLevel: number;
  xpToNextLevel: number;
  totalXP: number;
  multiplier: number;
}

interface XPContextType {
  xpData: XPData;
  addXP: (amount: number, activity: string) => void;
  getCurrentLevelProgress: () => number;
  getLevelBenefits: (level: number) => string[];
}

const XPContext = createContext<XPContextType | undefined>(undefined);

export const useXP = () => {
  const context = useContext(XPContext);
  if (!context) {
    throw new Error('useXP must be used within an XPProvider');
  }
  return context;
};

interface XPProviderProps {
  children: ReactNode;
}

export const XPProvider: React.FC<XPProviderProps> = ({ children }) => {
  const [xpData, setXPData] = useState<XPData>({
    currentXP: 350,
    currentLevel: 12,
    xpToNextLevel: 450,
    totalXP: 2850,
    multiplier: 1.0
  });

  const addXP = (amount: number, activity: string) => {
    setXPData(prev => {
      const newCurrentXP = prev.currentXP + amount;
      const newTotalXP = prev.totalXP + amount;
      
      // Check level up
      let newLevel = prev.currentLevel;
      let newXPToNext = prev.xpToNextLevel;
      
      if (newCurrentXP >= prev.xpToNextLevel) {
        newLevel += 1;
        newXPToNext = Math.floor(prev.xpToNextLevel * 1.5); // Increase requirement by 50%
      }
      
      return {
        ...prev,
        currentXP: newCurrentXP >= prev.xpToNextLevel ? newCurrentXP - prev.xpToNextLevel : newCurrentXP,
        currentLevel: newLevel,
        xpToNextLevel: newXPToNext,
        totalXP: newTotalXP
      };
    });
  };

  const getCurrentLevelProgress = () => {
    return Math.round((xpData.currentXP / xpData.xpToNextLevel) * 100);
  };

  const getLevelBenefits = (level: number) => {
    const benefits = [];
    if (level >= 5) benefits.push("Tutor IA Básico");
    if (level >= 10) benefits.push("Dicas Personalizadas");
    if (level >= 15) benefits.push("Análise Avançada");
    if (level >= 20) benefits.push("Mentor Premium");
    return benefits;
  };

  return (
    <XPContext.Provider value={{
      xpData,
      addXP,
      getCurrentLevelProgress,
      getLevelBenefits
    }}>
      {children}
    </XPContext.Provider>
  );
};