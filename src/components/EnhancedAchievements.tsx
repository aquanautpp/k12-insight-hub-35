import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Award, Star, Crown, Diamond, Medal } from 'lucide-react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  rarity: 'bronze' | 'silver' | 'gold' | 'diamond';
  unlocked: boolean;
  unlockedAt?: Date;
  progress?: number;
  maxProgress?: number;
  isNew?: boolean;
}

interface EnhancedAchievementsProps {
  achievements: Achievement[];
  className?: string;
}

export const EnhancedAchievements: React.FC<EnhancedAchievementsProps> = ({ 
  achievements, 
  className = '' 
}) => {
  const [flippedCards, setFlippedCards] = useState<Set<string>>(new Set());

  const rarityConfig = {
    bronze: {
      color: 'hsl(30, 100%, 50%)',
      glowColor: 'hsl(30, 100%, 50%, 0.3)',
      icon: Medal,
      label: 'Bronze'
    },
    silver: {
      color: 'hsl(0, 0%, 75%)',
      glowColor: 'hsl(0, 0%, 75%, 0.3)',
      icon: Star,
      label: 'Prata'
    },
    gold: {
      color: 'hsl(45, 100%, 50%)',
      glowColor: 'hsl(45, 100%, 50%, 0.3)',
      icon: Crown,
      label: 'Ouro'
    },
    diamond: {
      color: 'hsl(200, 100%, 70%)',
      glowColor: 'hsl(200, 100%, 70%, 0.3)',
      icon: Diamond,
      label: 'Diamante'
    }
  };

  const displayAchievements = achievements.length > 0 ? achievements.slice(0, 6) : [
    {
      id: '1',
      title: 'Primeiro Passo',
      description: 'Complete sua primeira atividade',
      icon: '🌱',
      rarity: 'bronze' as const,
      unlocked: true,
      unlockedAt: new Date(),
      isNew: true
    },
    {
      id: '2',
      title: 'Explorador',
      description: 'Alcance o nível 5',
      icon: '🧭',
      rarity: 'silver' as const,
      unlocked: true,
      unlockedAt: new Date(Date.now() - 86400000)
    },
    {
      id: '3',
      title: 'Dedicado',
      description: 'Estude por 7 dias seguidos',
      icon: '⚡',
      rarity: 'gold' as const,
      unlocked: false,
      progress: 3,
      maxProgress: 7
    },
    {
      id: '4',
      title: 'Mestre CPA',
      description: 'Complete todos os estágios CPA',
      icon: '🎯',
      rarity: 'diamond' as const,
      unlocked: false,
      progress: 1,
      maxProgress: 3
    },
    {
      id: '5',
      title: 'Pensador',
      description: 'Resolva 50 problemas pictóricos',
      icon: '👁️',
      rarity: 'silver' as const,
      unlocked: false,
      progress: 23,
      maxProgress: 50
    },
    {
      id: '6',
      title: 'Matemático',
      description: 'Alcance 1000 XP total',
      icon: '🧮',
      rarity: 'gold' as const,
      unlocked: false,
      progress: 650,
      maxProgress: 1000
    }
  ];

  // Trigger flip animation for newly unlocked achievements
  useEffect(() => {
    const newAchievements = displayAchievements.filter(a => a.isNew && a.unlocked);
    if (newAchievements.length > 0) {
      const timer = setTimeout(() => {
        setFlippedCards(prev => {
          const newSet = new Set(prev);
          newAchievements.forEach(a => newSet.add(a.id));
          return newSet;
        });
      }, 500);
      return () => clearTimeout(timer);
    }
  }, []);

  const toggleFlip = (id: string) => {
    setFlippedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const nextAchievement = displayAchievements.find(a => !a.unlocked && a.progress !== undefined);

  return (
    <Card className={`card-gradient ${className}`}>
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-3 text-xl">
          <Award className="h-5 w-5 text-primary" />
          Suas Conquistas
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Next Achievement Progress */}
        {nextAchievement && (
          <div className="p-4 bg-secondary/30 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Próxima Conquista</span>
              <Badge variant="outline" className="text-xs">
                {rarityConfig[nextAchievement.rarity].label}
              </Badge>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-lg">{nextAchievement.icon}</span>
                <div className="flex-1">
                  <div className="font-medium text-sm">{nextAchievement.title}</div>
                  <div className="text-xs text-muted-foreground">{nextAchievement.description}</div>
                </div>
              </div>
              <div className="space-y-1">
                <Progress 
                  value={(nextAchievement.progress! / nextAchievement.maxProgress!) * 100} 
                  className="h-2"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{nextAchievement.progress}/{nextAchievement.maxProgress}</span>
                  <span>{Math.round((nextAchievement.progress! / nextAchievement.maxProgress!) * 100)}%</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Achievements Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <AnimatePresence>
            {displayAchievements.map((achievement, index) => {
              const isFlipped = flippedCards.has(achievement.id);
              const RarityIcon = rarityConfig[achievement.rarity].icon;

              return (
                <motion.div
                  key={achievement.id}
                  className="relative h-32 cursor-pointer"
                  onClick={() => toggleFlip(achievement.id)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  style={{ perspective: '1000px' }}
                >
                  {/* Glow effect for unlocked achievements */}
                  {achievement.unlocked && (
                    <motion.div
                      className="absolute inset-0 rounded-xl -z-10"
                      style={{
                        background: `radial-gradient(circle, ${rarityConfig[achievement.rarity].glowColor} 0%, transparent 70%)`
                      }}
                      animate={{
                        opacity: achievement.isNew ? [0.3, 0.8, 0.3] : 0.3,
                        scale: achievement.isNew ? [1, 1.05, 1] : 1,
                      }}
                      transition={{
                        duration: achievement.isNew ? 2 : 0,
                        repeat: achievement.isNew ? Infinity : 0,
                        ease: 'easeInOut'
                      }}
                    />
                  )}

                  <motion.div
                    className="relative w-full h-full"
                    animate={{ rotateY: isFlipped ? 180 : 0 }}
                    transition={{ duration: 0.6, type: 'spring', stiffness: 300, damping: 30 }}
                    style={{ transformStyle: 'preserve-3d' }}
                  >
                    {/* Front */}
                    <div
                      className="absolute inset-0 w-full h-full rounded-xl p-4 border-2 backface-hidden flex flex-col items-center justify-center text-center"
                      style={{
                        backgroundColor: achievement.unlocked ? 'hsl(var(--card))' : 'hsl(var(--muted))',
                        borderColor: achievement.unlocked ? rarityConfig[achievement.rarity].color : 'hsl(var(--border))',
                        backfaceVisibility: 'hidden'
                      }}
                    >
                      <div className="text-3xl mb-2 filter grayscale-0">
                        {achievement.unlocked ? achievement.icon : '🔒'}
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-medium text-xs leading-tight">
                          {achievement.title}
                        </h4>
                        <div className="flex items-center justify-center gap-1">
                          <RarityIcon 
                            className="w-3 h-3" 
                            style={{ color: rarityConfig[achievement.rarity].color }}
                          />
                          <span className="text-xs text-muted-foreground">
                            {rarityConfig[achievement.rarity].label}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Back */}
                    <div
                      className="absolute inset-0 w-full h-full rounded-xl p-4 border-2 backface-hidden flex flex-col justify-center text-center"
                      style={{
                        backgroundColor: achievement.unlocked ? 'hsl(var(--card))' : 'hsl(var(--muted))',
                        borderColor: achievement.unlocked ? rarityConfig[achievement.rarity].color : 'hsl(var(--border))',
                        transform: 'rotateY(180deg)',
                        backfaceVisibility: 'hidden'
                      }}
                    >
                      <div className="space-y-2">
                        <p className="text-xs text-muted-foreground leading-tight">
                          {achievement.description}
                        </p>
                        {achievement.unlocked && achievement.unlockedAt && (
                          <div className="text-xs text-primary">
                            Desbloqueado em {achievement.unlockedAt.toLocaleDateString()}
                          </div>
                        )}
                        {!achievement.unlocked && achievement.progress !== undefined && (
                          <div className="space-y-1">
                            <Progress 
                              value={(achievement.progress / achievement.maxProgress!) * 100} 
                              className="h-1"
                            />
                            <div className="text-xs text-muted-foreground">
                              {achievement.progress}/{achievement.maxProgress}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Statistics */}
        <div className="flex justify-center gap-6 text-center">
          {Object.entries(rarityConfig).map(([rarity, config]) => {
            const count = displayAchievements.filter(a => a.rarity === rarity && a.unlocked).length;
            return (
              <div key={rarity} className="space-y-1">
                <config.icon 
                  className="w-6 h-6 mx-auto" 
                  style={{ color: config.color }}
                />
                <div className="text-sm font-medium">{count}</div>
                <div className="text-xs text-muted-foreground">{config.label}</div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};