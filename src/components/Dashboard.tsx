import React, { useState, useEffect, useMemo } from 'react';
import { Brain } from 'lucide-react';
import { useProgress } from '@/contexts/ProgressContext';
import { useXP } from '@/contexts/XPContext';
import { useAchievement } from '@/contexts/AchievementContext';
import { DashboardHero } from './Dashboard/DashboardHero';
import { DashboardStats } from './Dashboard/DashboardStats';
import { DashboardFeatures } from './Dashboard/DashboardFeatures';
import { DashboardContent } from './Dashboard/DashboardContent';

interface DashboardProps {
  onViewChange?: (view: string) => void;
}

const Dashboard = ({ onViewChange }: DashboardProps) => {
  const { progress } = useProgress();
  const { xpData } = useXP();
  const { achievements, checkAchievements } = useAchievement();
  
  // Early return com loading se dados essenciais não estão disponíveis
  if (!progress || !xpData || !achievements) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Brain className="w-12 h-12 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Carregando seu dashboard...</p>
        </div>
      </div>
    );
  }

  React.useEffect(() => {
    // Só chama checkAchievements se os dados estão disponíveis e mudaram
    if (progress?.completedActivities !== undefined && xpData?.currentLevel !== undefined) {
      checkAchievements(progress, xpData);
    }
  }, [progress?.completedActivities, xpData?.currentLevel, checkAchievements]);

  // Calculate dynamic progress based on actual data with safe defaults
  const mathProgress = useMemo(() => {
    if (!progress?.cpaProgress) return 0;
    return Math.round((progress.cpaProgress.concrete + progress.cpaProgress.pictorial + progress.cpaProgress.abstract) / 3);
  }, [progress?.cpaProgress]);

  const reasoningProgress = useMemo(() => {
    return progress?.skillsProgress?.find(s => s.skill === 'Raciocínio Lógico')?.level || 75;
  }, [progress?.skillsProgress]);

  const overallProgress = useMemo(() => {
    return Math.round(((progress?.completedActivities || 0) / Math.max(progress?.totalActivities || 1, 1)) * 100);
  }, [progress?.completedActivities, progress?.totalActivities]);

  const displayAchievements = useMemo(() => {
    return (achievements && achievements.length > 0) ? achievements.slice(0, 4) : [
      { title: 'Primeiro Passo', description: 'Complete sua primeira atividade', icon: '🌱' },
      { title: 'Explorador', description: 'Alcance o nível 5', icon: '🧭' },
      { title: 'Dedicado', description: 'Estude por 7 dias seguidos', icon: '⚡' },
      { title: 'Pensador', description: 'Resolva 50 problemas pictóricos', icon: '👁️' }
    ];
  }, [achievements]);

  return (
    <div className="min-h-screen">
      <DashboardHero onViewChange={onViewChange} />
      
      <DashboardStats 
        overallProgress={overallProgress}
        totalXP={xpData?.totalXP || 0}
        currentLevel={xpData?.currentLevel || 1}
        completedActivities={progress?.completedActivities || 0}
      />
      
      <DashboardFeatures />
      
      <DashboardContent 
        mathProgress={mathProgress}
        reasoningProgress={reasoningProgress}
        overallProgress={overallProgress}
        displayAchievements={displayAchievements}
      />
    </div>
  );
};

export default Dashboard;