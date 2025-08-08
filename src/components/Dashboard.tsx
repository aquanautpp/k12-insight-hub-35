import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, BookOpen, Target, TrendingUp, Award, BarChart3, MessageCircle, User, Calendar, Clock, Lightbulb, Zap, ArrowRight, Activity, Shield, HardHat, Code, Cpu, Layers, Flame } from 'lucide-react';
import { useProgress } from '@/contexts/ProgressContext';
import { useXP } from '@/contexts/XPContext';
import { useAchievement } from '@/contexts/AchievementContext';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useUserProgress } from '@/hooks/useUserProgress';
import { SmartInsights } from './SmartInsights';
import { QuickWinMessage } from './QuickWinMessage';
import { EnhancedAchievements } from './EnhancedAchievements';
import { RadarChart } from './RadarChart';
import { SystemTest } from './SystemTest';
import { AnimatedCounter } from './AnimatedCounter';
import { useScrollHijack } from '@/hooks/useScrollHijack';
import { useIsMobile } from '@/hooks/use-mobile';


import { StudyPlannerCard } from './StudyPlannerCard';
import { ReviewQueueCard } from './ReviewQueueCard';
import { EIInsightsMini } from './EI/EIInsightsMini';
import HeroSection from './home/HeroSection';
import LogoStrip from './home/LogoStrip';
import FeatureGrid from './home/FeatureGrid';
interface DashboardProps {
  onViewChange?: (view: string) => void;
}
const Dashboard = ({
  onViewChange
}: DashboardProps) => {
  // TODOS OS HOOKS DEVEM VIR PRIMEIRO - ANTES DE QUALQUER RETURN
  const {
    displayName,
    nome
  } = useUserProfile();
  const {
    progress: userProgress,
    loading: progressLoading
  } = useUserProgress();
  const {
    progress
  } = useProgress();
  const {
    xpData
  } = useXP();
  const {
    achievements,
    unlockedAchievements,
    checkAchievements
  } = useAchievement();
  const [isScrolled, setIsScrolled] = useState(false);
  const isMobile = useIsMobile();
  const featuresRef = useRef<HTMLDivElement>(null);
  const features = [{
    icon: Brain,
    title: "Método CPA",
    description: "Aprendizagem visual e progressiva baseada no método Singapura"
  }, {
    icon: MessageCircle,
    title: "Tutor IA",
    description: "Assistente inteligente personalizado para sua jornada"
  }, {
    icon: Target,
    title: "Inteligência Emocional",
    description: "Desenvolvimento de habilidades socioemocionais"
  }, {
    icon: BookOpen,
    title: "Leitura Personalizada",
    description: "Recomendações baseadas no seu perfil de aprendizagem"
  }];
  const {
    currentIndex,
    scrollProgress
  } = useScrollHijack(featuresRef, features.length);

  // Todos os useEffect também devem vir antes do early return
  React.useEffect(() => {
    // Só chama checkAchievements se os dados estão disponíveis e mudaram
    if (progress?.completedActivities !== undefined && xpData?.currentLevel !== undefined) {
      checkAchievements(progress, xpData);
    }
  }, [progress?.completedActivities, xpData?.currentLevel, checkAchievements]);
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Calculate dynamic progress based on actual data with safe defaults
  const mathProgress = React.useMemo(() => {
    if (!progress?.cpaProgress) return 0;
    return Math.round((progress.cpaProgress.concrete + progress.cpaProgress.pictorial + progress.cpaProgress.abstract) / 3);
  }, [progress?.cpaProgress]);
  const reasoningProgress = React.useMemo(() => {
    return progress?.skillsProgress?.find(s => s.skill === 'Raciocínio Lógico')?.level || 75;
  }, [progress?.skillsProgress]);
  const overallProgress = React.useMemo(() => {
    return Math.round((progress?.completedActivities || 0) / Math.max(progress?.totalActivities || 1, 1) * 100);
  }, [progress?.completedActivities, progress?.totalActivities]);
  const streakDays = userProgress?.ei_checkin_streak ?? progress?.currentStreak ?? 0;
  const streakBadges = React.useMemo(() => {
    const earned: string[] = [];
    if (streakDays >= 3) earned.push('🔥 3 dias');
    if (streakDays >= 7) earned.push('🏅 7 dias');
    if (streakDays >= 14) earned.push('🏆 14 dias');
    if (streakDays >= 30) earned.push('👑 30 dias');
    return earned;
  }, [streakDays]);

  // Early return APÓS todos os hooks
  if (!progress || !xpData || !achievements || progressLoading) {
    return <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Brain className="w-12 h-12 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Carregando seu dashboard...</p>
        </div>
      </div>;
  }
  const displayAchievements = achievements && achievements.length > 0 ? achievements.slice(0, 4) : [{
    title: 'Primeiro Passo',
    description: 'Complete sua primeira atividade',
    icon: '🌱'
  }, {
    title: 'Explorador',
    description: 'Alcance o nível 5',
    icon: '🧭'
  }, {
    title: 'Dedicado',
    description: 'Estude por 7 dias seguidos',
    icon: '⚡'
  }, {
    title: 'Pensador',
    description: 'Resolva 50 problemas pictóricos',
    icon: '👁️'
  }];
  const containerVariants = {
    hidden: {
      opacity: 0
    },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
        duration: 0.8
      }
    }
  };
  const itemVariants = {
    hidden: {
      y: 20,
      opacity: 0
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6
      }
    }
  };
  return <div className="min-h-screen">
      <HeroSection nome={nome} onViewChange={onViewChange} />
      <LogoStrip />

      {/* Estatísticas Principais */}
      <motion.section variants={containerVariants} initial="hidden" whileInView="visible" viewport={{
      once: true
    }} className="bg-gradient-to-b from-background to-secondary/30 py-[44px]">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div className="text-center mb-12" variants={itemVariants}>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Seu Progresso em Números
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Acompanhe seu desenvolvimento através de métricas personalizadas
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div variants={itemVariants} className="card-interactive rounded-xl p-6 text-center hover-scale">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-foreground text-2xl lg:text-3xl font-bold mb-2">
                <AnimatedCounter end={Math.round(overallProgress)} suffix="%" />
              </h3>
              <p className="text-muted-foreground">Progresso Geral</p>
            </motion.div>

            <motion.div variants={itemVariants} className="card-interactive rounded-xl p-6 text-center hover-scale">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-foreground text-2xl lg:text-3xl font-bold mb-2">
                <AnimatedCounter end={xpData?.totalXP || 0} />
              </h3>
              <p className="text-muted-foreground">XP Total</p>
            </motion.div>

            <motion.div variants={itemVariants} className="card-interactive rounded-xl p-6 text-center hover-scale">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-foreground text-2xl lg:text-3xl font-bold mb-2">
                <AnimatedCounter end={xpData?.currentLevel || 1} />
              </h3>
              <p className="text-muted-foreground">Nível Atual</p>
            </motion.div>

            <motion.div variants={itemVariants} className="card-interactive rounded-xl p-6 text-center hover-scale">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-foreground text-2xl lg:text-3xl font-bold mb-2">
                <AnimatedCounter end={userProgress?.atividades_completadas ? Array.isArray(userProgress.atividades_completadas) ? userProgress.atividades_completadas.length : 0 : 0} />
              </h3>
              <p className="text-muted-foreground">Atividades</p>
            </motion.div>
          </div>

          
        </div>
      </motion.section>

      <FeatureGrid
        featuresRef={featuresRef}
        features={features}
        currentIndex={currentIndex}
        isMobile={isMobile}
        scrollProgress={scrollProgress}
      />

      {/* Conteúdo Principal */}
      <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{
      once: true
    }} className="max-w-7xl mx-auto p-6 space-y-8 py-[24px]">
        {/* Progresso Detalhado */}
        <motion.div variants={itemVariants}>
          <Card className="card-gradient">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-3 text-2xl">
                <BarChart3 className="h-6 w-6 text-primary" />
                Visão Geral do Progresso
              </CardTitle>
              <CardDescription>
                Acompanhe seu desenvolvimento em diferentes áreas do conhecimento
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium flex items-center gap-2">
                      <Brain className="h-4 w-4 text-primary" />
                      Matemática
                    </span>
                    <span className="text-sm text-muted-foreground">{Math.round(mathProgress)}%</span>
                  </div>
                  <Progress value={mathProgress} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium flex items-center gap-2">
                      <Lightbulb className="h-4 w-4 text-primary" />
                      Raciocínio
                    </span>
                    <span className="text-sm text-muted-foreground">{Math.round(reasoningProgress)}%</span>
                  </div>
                  <Progress value={reasoningProgress} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Insights + Quick Wins + IE Mini (layout compacto) */}
        <div className="grid gap-6 lg:grid-cols-12">
          <motion.div variants={itemVariants} className="lg:col-span-8">
            <SmartInsights className="h-full" />
          </motion.div>
          <div className="lg:col-span-4 space-y-6">
            <motion.div variants={itemVariants}>
              <QuickWinMessage />
            </motion.div>
            <motion.div variants={itemVariants}>
              <EIInsightsMini />
            </motion.div>
          </div>
        </div>

        {/* Planner em largura total para reduzir espaços vazios */}
        <motion.div variants={itemVariants}>
          <StudyPlannerCard />
        </motion.div>

        {/* Gráfico de Radar */}
        <motion.div variants={itemVariants}>
          <RadarChart />
        </motion.div>

        {/* Conquistas Aprimoradas */}
        <motion.div variants={itemVariants}>
          <EnhancedAchievements />
        </motion.div>

      </motion.div>
    </div>;
};
export default Dashboard;