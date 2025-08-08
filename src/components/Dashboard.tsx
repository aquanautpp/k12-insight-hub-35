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
import educationalHeroVideo from '@/assets/educational-hero-video.jpg';
import logoImage from '@/assets/mantha-logo-corrected.png';
import { StudyPlannerCard } from './StudyPlannerCard';
import { ReviewQueueCard } from './ReviewQueueCard';
import { EIInsightsMini } from './EI/EIInsightsMini';
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
    currentIndex
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
      {/* Hero Section with Educational Video */}
      <div className="relative overflow-hidden h-[60vh] md:h-[500px] lg:h-[550px] w-full rounded-2xl mb-8 shadow-card">
        <div className="absolute inset-0">
          <img src={educationalHeroVideo} alt="Educational background" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/80 via-primary/70 to-primary/60"></div>
        </div>
        <div className="relative z-10 h-full flex items-center justify-center">
          <motion.div initial={{
          opacity: 0,
          y: 30
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 1,
          delay: 0.2
        }} className="flex flex-col items-center space-y-6 max-w-2xl mx-auto px-6 text-center">
            {/* Logo Mantha Completo */}
            <motion.div className="mantha-logo-container mb-5 mx-0 px-0 py-0 rounded-full" initial={{
            opacity: 0,
            y: 80,
            x: -60,
            scale: 0.8
          }} animate={{
            opacity: 1,
            y: 0,
            x: 0,
            scale: 1
          }} transition={{
            duration: 3.5,
            ease: "easeOut",
            opacity: {
              duration: 3.5,
              ease: "easeOut"
            },
            y: {
              duration: 3.5,
              ease: "easeOut"
            },
            x: {
              duration: 3.5,
              ease: "easeOut"
            },
            scale: {
              duration: 3.5,
              ease: "easeOut"
            }
          }}>
              <div className="w-[180px] md:w-[220px] lg:w-[260px] h-[120px] md:h-[140px] lg:h-[160px] flex items-center justify-center mx-auto bg-transparent">
                <motion.img src="/lovable-uploads/1f11a51d-9ab8-463e-8d4c-3cfb8576711e.png" alt="MANTHA - Educação Personalizada" className="mantha-logo-main w-[240px] md:w-[280px] lg:w-[320px] h-auto p-2" initial={{
                scale: 0.95
              }} animate={{
                scale: 1
              }} transition={{
                duration: 3.5,
                ease: "easeOut",
                delay: 0.8
              }} />
              </div>
            </motion.div>
            <div className="mt-0">
              <h1 className="text-3xl text-white mb-4 font-semibold lg:text-5xl">
                De volta à <span className="text-yellow-400">Mantha</span>{nome ? `, ${nome}` : ''}!
              </h1>
              <p className="text-xl lg:text-2xl text-white/90 max-w-2xl mb-2 mx-0 my-0">
                Sua jornada de aprendizagem personalizada usando IA e metodologias comprovadas
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 mt-2">
              <Button size="lg" variant="outline" className="bg-white/10 text-white border-white/30 hover:bg-white hover:text-primary text-lg px-8 backdrop-blur-sm" onClick={() => onViewChange?.('progress')}>
                Ver Progresso
                <TrendingUp className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" className="bg-white/10 text-white border-white/30 hover:bg-white hover:text-primary text-lg px-8 backdrop-blur-sm" onClick={() => onViewChange?.('cpa-method')}>
                Começar Hoje
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Estatísticas Principais */}
      <motion.section className="py-16 bg-gradient-to-b from-background to-secondary/30" variants={containerVariants} initial="hidden" whileInView="visible" viewport={{
      once: true
    }}>
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

          <Card className="card-interactive rounded-xl p-6 mt-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Flame className="w-5 h-5 text-primary" />
                  <span className="text-sm text-muted-foreground">Streak EI</span>
                </div>
                <h3 className="text-foreground text-2xl lg:text-3xl font-bold">{streakDays} dias</h3>
              </div>
              <div className="flex gap-2 flex-wrap justify-end">
                {streakBadges.map((b, i) => (
                  <Badge key={i} variant="secondary" className="bg-primary/10 text-primary">{b}</Badge>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </motion.section>

      {/* Features com Scroll Hijacking */}
      <motion.section ref={featuresRef} className="py-16 bg-gradient-to-b from-secondary/30 to-background" variants={containerVariants} initial="hidden" whileInView="visible" viewport={{
      once: true
    }}>
        <div className="max-w-7xl mx-auto px-6">
          <motion.div className="text-center mb-12" variants={itemVariants}>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Recursos de Aprendizagem
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Descubra as ferramentas que tornam o aprendizado mais eficaz e envolvente
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => <motion.div key={index} variants={itemVariants} className={`card-gradient p-6 rounded-xl hover-scale transition-all duration-500 ${!isMobile && currentIndex === index ? 'ring-2 ring-primary shadow-lg' : ''}`}>
                <div className="w-12 h-12 bg-primary/10 flex items-center justify-center rounded-lg text-primary mb-4">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-foreground">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {feature.description}
                </p>
              </motion.div>)}
          </div>
        </div>
      </motion.section>

      {/* Conteúdo Principal */}
      <motion.div className="max-w-7xl mx-auto p-6 space-y-8" variants={containerVariants} initial="hidden" whileInView="visible" viewport={{
      once: true
    }}>
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

        {/* Insights e Quick Wins */}
        <div className="grid gap-6 md:grid-cols-2">
          <motion.div variants={itemVariants}>
            <SmartInsights className="h-full" />
          </motion.div>
          <motion.div variants={itemVariants}>
            <QuickWinMessage />
          </motion.div>
        </div>


        {/* Metacognição + Prática Espaçada + IE Mini */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <motion.div variants={itemVariants}>
            <StudyPlannerCard />
          </motion.div>
          <motion.div variants={itemVariants}>
            <ReviewQueueCard />
          </motion.div>
          <motion.div variants={itemVariants}>
            <EIInsightsMini />
          </motion.div>
        </div>

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