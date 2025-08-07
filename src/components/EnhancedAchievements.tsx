import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";
import { Award, Star, Crown, Gem, Trophy } from "lucide-react";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  rarity: 'bronze' | 'silver' | 'gold' | 'diamond';
  isUnlocked: boolean;
  isRecent?: boolean;
  progress?: number;
  maxProgress?: number;
}

interface EnhancedAchievementsProps {
  achievements?: Achievement[];
  className?: string;
}

export const EnhancedAchievements: React.FC<EnhancedAchievementsProps> = ({
  achievements = [],
  className = ""
}) => {
  const [flippedCards, setFlippedCards] = useState<Set<string>>(new Set());
  const [recentlyUnlocked, setRecentlyUnlocked] = useState<Set<string>>(new Set());

  // Dados de exemplo se não fornecidos
  const defaultAchievements: Achievement[] = [
    {
      id: "primeiro-passo",
      title: "Primeiro Passo",
      description: "Complete sua primeira atividade",
      icon: "🌱",
      rarity: "bronze",
      isUnlocked: true,
      isRecent: true
    },
    {
      id: "explorador",
      title: "Explorador",
      description: "Alcance o nível 5",
      icon: "🧭",
      rarity: "silver",
      isUnlocked: true,
      isRecent: false
    },
    {
      id: "dedicado",
      title: "Dedicado",
      description: "Estude por 7 dias seguidos",
      icon: "⚡",
      rarity: "gold",
      isUnlocked: false,
      progress: 5,
      maxProgress: 7
    },
    {
      id: "pensador",
      title: "Pensador Visual",
      description: "Resolva 50 problemas pictóricos",
      icon: "👁️",
      rarity: "diamond",
      isUnlocked: false,
      progress: 23,
      maxProgress: 50
    }
  ];

  const displayAchievements = achievements.length > 0 ? achievements : defaultAchievements;

  const getRarityColors = (rarity: string) => {
    switch (rarity) {
      case 'bronze':
        return {
          bg: "bg-gradient-to-br from-amber-600 to-amber-800",
          border: "border-amber-500",
          glow: "shadow-[0_0_20px_rgba(245,158,11,0.5)]",
          text: "text-amber-100"
        };
      case 'silver':
        return {
          bg: "bg-gradient-to-br from-slate-400 to-slate-600",
          border: "border-slate-400",
          glow: "shadow-[0_0_20px_rgba(148,163,184,0.5)]",
          text: "text-slate-100"
        };
      case 'gold':
        return {
          bg: "bg-gradient-to-br from-yellow-400 to-yellow-600",
          border: "border-yellow-400",
          glow: "shadow-[0_0_20px_rgba(251,191,36,0.5)]",
          text: "text-yellow-900"
        };
      case 'diamond':
        return {
          bg: "bg-gradient-to-br from-cyan-400 to-blue-600",
          border: "border-cyan-400",
          glow: "shadow-[0_0_25px_rgba(34,211,238,0.6)]",
          text: "text-cyan-100"
        };
      default:
        return {
          bg: "bg-muted",
          border: "border-muted",
          glow: "",
          text: "text-muted-foreground"
        };
    }
  };

  const getRarityIcon = (rarity: string) => {
    switch (rarity) {
      case 'bronze':
        return <Trophy className="w-4 h-4" />;
      case 'silver':
        return <Star className="w-4 h-4" />;
      case 'gold':
        return <Crown className="w-4 h-4" />;
      case 'diamond':
        return <Gem className="w-4 h-4" />;
      default:
        return <Award className="w-4 h-4" />;
    }
  };

  const handleCardClick = (achievementId: string) => {
    if (displayAchievements.find(a => a.id === achievementId)?.isUnlocked) {
      setFlippedCards(prev => {
        const newSet = new Set(prev);
        if (newSet.has(achievementId)) {
          newSet.delete(achievementId);
        } else {
          newSet.add(achievementId);
        }
        return newSet;
      });
    }
  };

  // Simular desbloqueio recente para demonstração
  useEffect(() => {
    const recentAchievements = displayAchievements.filter(a => a.isRecent);
    if (recentAchievements.length > 0) {
      setRecentlyUnlocked(new Set(recentAchievements.map(a => a.id)));
    }
  }, []);

  return (
    <Card className={`${className} card-clean`}>
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-3 text-xl">
          <Award className="h-5 w-5 text-primary" />
          Suas Conquistas
        </CardTitle>
        <CardDescription>
          Celebre seus marcos de aprendizagem
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <AnimatePresence>
            {displayAchievements.map((achievement, index) => {
              const rarityStyles = getRarityColors(achievement.rarity);
              const isFlipped = flippedCards.has(achievement.id);
              const isGlowing = achievement.isRecent || recentlyUnlocked.has(achievement.id);

              return (
                <motion.div
                  key={achievement.id}
                  className="relative h-40 cursor-pointer perspective-1000"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  onClick={() => handleCardClick(achievement.id)}
                >
                  <motion.div
                    className={`relative w-full h-full transition-transform duration-700 transform-style-preserve-3d ${isFlipped ? 'rotate-y-180' : ''}`}
                  >
                    {/* Frente do Card */}
                    <div
                      className={`absolute inset-0 w-full h-full rounded-xl border-2 p-4 text-center backface-hidden transition-all duration-300 ${
                        achievement.isUnlocked 
                          ? `${rarityStyles.bg} ${rarityStyles.border} ${rarityStyles.text} ${isGlowing ? rarityStyles.glow : ''}` 
                          : 'bg-muted border-muted-foreground/20 text-muted-foreground'
                      }`}
                    >
                      <div className="flex flex-col items-center justify-center h-full gap-3">
                        <div className="text-3xl">{achievement.icon}</div>
                        <h4 className="font-semibold text-sm text-center leading-tight">{achievement.title}</h4>
                        
                        {/* Badge de raridade */}
                        <Badge variant="outline" className={`text-xs px-2 py-1 ${achievement.isUnlocked ? 'border-current' : ''}`}>
                          <span className="mr-1">{getRarityIcon(achievement.rarity)}</span>
                          {achievement.rarity.charAt(0).toUpperCase() + achievement.rarity.slice(1)}
                        </Badge>

                        {/* Barra de progresso para conquistas não desbloqueadas */}
                        {!achievement.isUnlocked && achievement.progress !== undefined && achievement.maxProgress && (
                          <div className="w-full mt-3">
                            <Progress 
                              value={(achievement.progress / achievement.maxProgress) * 100} 
                              className="h-2"
                            />
                            <span className="text-xs mt-2 block font-medium">
                              {achievement.progress}/{achievement.maxProgress}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Verso do Card */}
                    {achievement.isUnlocked && (
                      <div
                        className={`absolute inset-0 w-full h-full rounded-xl border-2 p-4 rotate-y-180 backface-hidden ${rarityStyles.bg} ${rarityStyles.border} ${rarityStyles.text}`}
                      >
                        <div className="flex flex-col items-center justify-center h-full px-2">
                          <p className="text-sm text-center leading-relaxed mb-3">
                            {achievement.description}
                          </p>
                          <div className="text-xs opacity-75 font-medium">
                            Clique para voltar
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>

                  {/* Efeito de brilho para conquistas recentes */}
                  {isGlowing && achievement.isUnlocked && (
                    <motion.div
                      className="absolute inset-0 rounded-xl pointer-events-none"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0, 0.3, 0] }}
                      transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                      style={{
                        background: `linear-gradient(45deg, transparent, ${
                          achievement.rarity === 'gold' ? 'rgba(251,191,36,0.3)' :
                          achievement.rarity === 'diamond' ? 'rgba(34,211,238,0.3)' :
                          achievement.rarity === 'silver' ? 'rgba(148,163,184,0.3)' :
                          'rgba(245,158,11,0.3)'
                        }, transparent)`
                      }}
                    />
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Progresso até próxima conquista */}
        <div className="mt-6 p-4 bg-muted/30 rounded-lg">
          <h4 className="text-sm font-medium mb-2 text-foreground">Próxima Conquista</h4>
          <div className="flex items-center gap-3">
            <div className="text-lg">⚡</div>
            <div className="flex-1">
              <p className="text-sm text-foreground">Dedicado - Estude por 7 dias seguidos</p>
              <Progress value={71} className="mt-1 h-2" />
              <span className="text-xs text-muted-foreground">5/7 dias</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};