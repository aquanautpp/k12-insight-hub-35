import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Award, Target, Calendar } from 'lucide-react';
import { AnimatedCounter } from '../AnimatedCounter';

interface DashboardStatsProps {
  overallProgress: number;
  totalXP: number;
  currentLevel: number;
  completedActivities: number;
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

export const DashboardStats: React.FC<DashboardStatsProps> = React.memo(({
  overallProgress,
  totalXP,
  currentLevel,
  completedActivities
}) => {
  return (
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
              <AnimatedCounter end={totalXP} />
            </h3>
            <p className="text-muted-foreground">XP Total</p>
          </motion.div>

          <motion.div variants={itemVariants} className="card-interactive rounded-xl p-6 text-center hover-scale">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Target className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-foreground text-2xl lg:text-3xl font-bold mb-2">
              <AnimatedCounter end={currentLevel} />
            </h3>
            <p className="text-muted-foreground">Nível Atual</p>
          </motion.div>

          <motion.div variants={itemVariants} className="card-interactive rounded-xl p-6 text-center hover-scale">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-foreground text-2xl lg:text-3xl font-bold mb-2">
              <AnimatedCounter end={completedActivities} />
            </h3>
            <p className="text-muted-foreground">Atividades</p>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
});

DashboardStats.displayName = 'DashboardStats';