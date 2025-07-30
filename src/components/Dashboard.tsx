import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Brain, BookOpen, Target, TrendingUp, Award, BarChart3, MessageCircle, User, Calendar, Clock, Lightbulb, Zap, ArrowRight, Activity, Shield, HardHat, Code, Cpu, Layers } from 'lucide-react';
import { useProgress } from '@/contexts/ProgressContext';
import { useXP } from '@/contexts/XPContext';
import { useAchievement } from '@/contexts/AchievementContext';
import { SmartInsights } from './SmartInsights';
import { QuickWinMessage } from './QuickWinMessage';
import { AdaptiveLearningPath } from './AdaptiveLearningPath';
import { AnimatedCounter } from './AnimatedCounter';
import { useScrollHijack } from '@/hooks/useScrollHijack';
import { useIsMobile } from '@/hooks/use-mobile';
import educationalHeroVideo from '@/assets/educational-hero-video.jpg';

interface DashboardProps {
  onViewChange?: (view: string) => void;
}

const Dashboard = ({ onViewChange }: DashboardProps) => {
  const { progress } = useProgress();
  const { xpData } = useXP();
  const { unlockedAchievements, checkAchievements } = useAchievement();
  
  // Early return com loading se dados essenciais não estão disponíveis
  if (!progress || !xpData || !unlockedAchievements) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Brain className="w-12 h-12 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Carregando seu dashboard...</p>
        </div>
      </div>
    );
  }
  const [isScrolled, setIsScrolled] = useState(false);
  const isMobile = useIsMobile();
  const featuresRef = useRef<HTMLDivElement>(null);
  
  const features = [
    {
      icon: Brain,
      title: "Método CPA",
      description: "Aprendizagem visual e progressiva baseada no método Singapura"
    },
    {
      icon: MessageCircle,
      title: "Tutor IA",
      description: "Assistente inteligente personalizado para sua jornada"
    },
    {
      icon: Target,
      title: "Inteligência Emocional",
      description: "Desenvolvimento de habilidades socioemocionais"
    },
    {
      icon: BookOpen,
      title: "Leitura Personalizada",
      description: "Recomendações baseadas no seu perfil de aprendizagem"
    }
  ];

  const { currentIndex } = useScrollHijack(featuresRef, features.length);

  React.useEffect(() => {
    // Só chama checkAchievements se os dados estão disponíveis e não causará loop
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
    return Math.round(((progress?.completedActivities || 0) / Math.max(progress?.totalActivities || 1, 1)) * 100);
  }, [progress?.completedActivities, progress?.totalActivities]);

  const displayAchievements = (unlockedAchievements && unlockedAchievements.length > 0) ? unlockedAchievements.slice(-4) : [
    { title: 'Primeiro Passo', description: 'Complete sua primeira atividade', icon: '🎯' },
    { title: 'Mente Curiosa', description: 'Faça 5 perguntas ao tutor', icon: '🤔' },
    { title: 'Aprendiz Diário', description: 'Estude por 3 dias consecutivos', icon: '📚' },
    { title: 'Solucionador', description: 'Resolva 10 problemas', icon: '💡' }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
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
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.6 }
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section with Educational Video */}
      <div className="relative overflow-hidden h-[60vh] md:h-[500px] lg:h-[550px] w-full rounded-2xl mb-8 shadow-card">
        <div className="absolute inset-0">
          <img 
            src={educationalHeroVideo} 
            alt="Educational background" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/80 via-primary/70 to-primary/60"></div>
        </div>
        <div className="relative z-10 h-full flex items-center justify-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="flex flex-col items-center space-y-6 max-w-4xl mx-auto px-6 text-center"
          >
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-4 animate-pulse-glow">
              <Brain className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold text-white mb-4">
              Bem-vindo ao <span className="text-gold">Meraki</span>
            </h1>
            <p className="text-xl lg:text-2xl text-white/90 max-w-2xl mx-auto mb-8">
              Sua jornada de aprendizagem personalizada usando IA e metodologias comprovadas
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <Button 
                size="lg" 
                className="bg-white text-primary hover:bg-white/90 text-lg px-8"
                onClick={() => onViewChange?.('progress')}
              >
                Ver Progresso
                <TrendingUp className="ml-2 h-4 w-4" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="text-white border-white/50 hover:bg-white hover:text-primary text-lg px-8 backdrop-blur-sm bg-white/10"
                onClick={() => onViewChange?.('cpa-method')}
              >
                Começar Hoje
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Estatísticas Principais */}
      <motion.section 
        className="py-16 bg-gradient-to-b from-background to-secondary/30"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
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
                <AnimatedCounter end={progress?.completedActivities || 0} />
              </h3>
              <p className="text-muted-foreground">Atividades</p>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Features com Scroll Hijacking */}
      <motion.section 
        ref={featuresRef}
        className="py-16 bg-gradient-to-b from-secondary/30 to-background"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
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
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className={`card-gradient p-6 rounded-xl hover-scale transition-all duration-500 ${
                  !isMobile && currentIndex === index ? 'ring-2 ring-primary shadow-lg' : ''
                }`}
              >
                <div className="w-12 h-12 bg-primary/10 flex items-center justify-center rounded-lg text-primary mb-4">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-foreground">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Conteúdo Principal */}
      <motion.div 
        className="max-w-7xl mx-auto p-6 space-y-8"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
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

        {/* Caminho Adaptativo */}
        <motion.div variants={itemVariants}>
          <AdaptiveLearningPath 
            currentLevel={overallProgress}
            completedModules={["Números Básicos", "Operações Simples"]}
            nextModules={["Percentuais", "Geometria Visual"]}
            successRate={87}
          />
        </motion.div>

        {/* Conquistas */}
        <motion.div variants={itemVariants}>
          <Card className="card-gradient">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-3 text-xl">
                <Award className="h-5 w-5 text-primary" />
                Suas Conquistas
              </CardTitle>
              <CardDescription>
                Celebre seus marcos de aprendizagem
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {displayAchievements.map((achievement, index) => (
                  <div 
                    key={index} 
                    className="text-center p-4 rounded-lg transition-all hover-scale bg-primary/10 border border-primary/20"
                  >
                    <div className="text-2xl mb-2">{achievement.icon}</div>
                    <h4 className="font-medium text-sm mb-1">{achievement.title}</h4>
                    <p className="text-xs text-muted-foreground">{achievement.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Ações Rápidas */}
        <motion.div variants={itemVariants}>
          <Card className="card-gradient">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-3 text-xl">
                <Zap className="h-5 w-5 text-primary" />
                Ações Rápidas
              </CardTitle>
              <CardDescription>
                Continue sua jornada de aprendizagem
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Button 
                  variant="outline" 
                  className="h-auto p-4 flex flex-col items-center gap-2 hover-scale"
                  onClick={() => onViewChange?.('cpa-method')}
                >
                  <Brain className="h-6 w-6 text-primary" />
                  <span className="font-medium">Método CPA</span>
                  <span className="text-xs text-muted-foreground text-center">
                    Aprendizagem visual progressiva
                  </span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-auto p-4 flex flex-col items-center gap-2 hover-scale"
                  onClick={() => onViewChange?.('emotional-intelligence')}
                >
                  <Target className="h-6 w-6 text-primary" />
                  <span className="font-medium">Int. Emocional</span>
                  <span className="text-xs text-muted-foreground text-center">
                    Desenvolvimento pessoal
                  </span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-auto p-4 flex flex-col items-center gap-2 hover-scale"
                  onClick={() => onViewChange?.('chat-tutor')}
                >
                  <MessageCircle className="h-6 w-6 text-primary" />
                  <span className="font-medium">Tutor IA</span>
                  <span className="text-xs text-muted-foreground text-center">
                    Assistente personalizado
                  </span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-auto p-4 flex flex-col items-center gap-2 hover-scale"
                  onClick={() => onViewChange?.('reading-recommendations')}
                >
                  <BookOpen className="h-6 w-6 text-primary" />
                  <span className="font-medium">Leitura</span>
                  <span className="text-xs text-muted-foreground text-center">
                    Recomendações personalizadas
                  </span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Dashboard;