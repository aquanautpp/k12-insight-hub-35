import React, { Suspense } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Brain, Lightbulb, BarChart3, Award } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

// Lazy load components
const SmartInsights = React.lazy(() => import('../SmartInsights').then(module => ({ default: module.SmartInsights })));
const QuickWinMessage = React.lazy(() => import('../QuickWinMessage').then(module => ({ default: module.QuickWinMessage })));
const AdaptiveLearningPath = React.lazy(() => import('../AdaptiveLearningPath').then(module => ({ default: module.AdaptiveLearningPath })));

interface DashboardContentProps {
  mathProgress: number;
  reasoningProgress: number;
  overallProgress: number;
  displayAchievements: Array<{
    title: string;
    description: string;
    icon: string;
  }>;
}

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

const ComponentSkeleton = () => (
  <div className="space-y-4">
    <Skeleton className="h-6 w-3/4" />
    <Skeleton className="h-20 w-full" />
    <Skeleton className="h-4 w-1/2" />
  </div>
);

export const DashboardContent: React.FC<DashboardContentProps> = React.memo(({
  mathProgress,
  reasoningProgress,
  overallProgress,
  displayAchievements
}) => {
  return (
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
          <Suspense fallback={<ComponentSkeleton />}>
            <SmartInsights className="h-full" />
          </Suspense>
        </motion.div>
        <motion.div variants={itemVariants}>
          <Suspense fallback={<ComponentSkeleton />}>
            <QuickWinMessage />
          </Suspense>
        </motion.div>
      </div>

      {/* Caminho Adaptativo */}
      <motion.div variants={itemVariants}>
        <Suspense fallback={<ComponentSkeleton />}>
          <AdaptiveLearningPath 
            currentLevel={overallProgress}
            completedModules={["Números Básicos", "Operações Simples"]}
            nextModules={["Percentuais", "Geometria Visual"]}
            successRate={87}
          />
        </Suspense>
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
                  className="text-center p-4 rounded-lg transition-all hover-scale bg-white border border-primary"
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
    </motion.div>
  );
});

DashboardContent.displayName = 'DashboardContent';