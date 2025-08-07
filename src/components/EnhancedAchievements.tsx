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
          bg: "bg-gradient-to-br from-orange-500 to-orange-700",
          border: "border-orange-400",
          glow: "shadow-[0_8px_32px_rgba(251,146,60,0.4)]",
          text: "text-white",
          progressBg: "bg-orange-500"
        };
      case 'silver':
        return {
          bg: "bg-gradient-to-br from-slate-500 to-slate-700",
          border: "border-slate-400",
          glow: "shadow-[0_8px_32px_rgba(148,163,184,0.4)]",
          text: "text-white",
          progressBg: "bg-slate-500"
        };
      case 'gold':
        return {
          bg: "bg-gradient-to-br from-yellow-400 to-yellow-600",
          border: "border-yellow-300",
          glow: "shadow-[0_8px_32px_rgba(245,158,11,0.4)]",
          text: "text-yellow-900",
          progressBg: "bg-yellow-500"
        };
      case 'diamond':
        return {
          bg: "bg-gradient-to-br from-indigo-500 to-purple-600",
          border: "border-indigo-400",
          glow: "shadow-[0_8px_32px_rgba(99,102,241,0.4)]",
          text: "text-white",
          progressBg: "bg-indigo-500"
        };
      default:
        return {
          bg: "bg-muted",
          border: "border-muted",
          glow: "",
          text: "text-muted-foreground",
          progressBg: "bg-muted-foreground"
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <AnimatePresence>
            {displayAchievements.map((achievement, index) => {
              const rarityStyles = getRarityColors(achievement.rarity);
              const isFlipped = flippedCards.has(achievement.id);
              const isGlowing = achievement.isRecent || recentlyUnlocked.has(achievement.id);
              const progressPercentage = achievement.progress && achievement.maxProgress 
                ? (achievement.progress / achievement.maxProgress) * 100 
                : 0;

              return (
                <motion.div
                  key={achievement.id}
                  className="relative cursor-pointer group"
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ 
                    duration: 0.6, 
                    delay: index * 0.1,
                    type: "spring",
                    stiffness: 100
                  }}
                  whileHover={{ 
                    scale: 1.05, 
                    y: -5,
                    transition: { duration: 0.2 }
                  }}
                  onClick={() => handleCardClick(achievement.id)}
                >
                  <motion.div
                    className={`relative w-full h-52 transition-all duration-500 transform-style-preserve-3d ${isFlipped ? 'rotate-y-180' : ''}`}
                  >
                    {/* Frente do Card */}
                    <div
                      className={`absolute inset-0 w-full h-full rounded-xl border-2 p-6 overflow-hidden pb-3 backface-hidden transition-all duration-300 ${
                        achievement.isUnlocked 
                          ? `${rarityStyles.bg} ${rarityStyles.border} ${rarityStyles.text} shadow-lg ${isGlowing ? rarityStyles.glow : 'hover:shadow-xl'}` 
                          : 'bg-muted/40 border-muted-foreground/20 text-muted-foreground opacity-60 grayscale'
                      } ${achievement.rarity === 'diamond' && achievement.isUnlocked ? 'animate-pulse' : ''}`}
                      style={{
                        filter: achievement.rarity === 'diamond' && achievement.isUnlocked 
                          ? 'drop-shadow(0 0 15px rgba(99,102,241,0.3))' 
                          : 'none'
                      }}
                    >
                      <div className="flex flex-col items-center justify-between h-full">
                        {/* Ícone */}
                        <motion.div 
                          className="text-5xl mb-2"
                          animate={achievement.isUnlocked && isGlowing && achievement.rarity === 'diamond' ? {
                            scale: [1, 1.1, 1],
                            rotate: [0, 5, -5, 0]
                          } : {}}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          {achievement.icon}
                        </motion.div>
                        
                        {/* Título */}
                        <h4 className="font-bold text-base text-center leading-tight mb-2">
                          {achievement.title}
                        </h4>
                        
                        {/* Badge de raridade */}
                        <Badge 
                          variant="outline" 
                          className={`text-xs px-3 py-1 mb-3 font-semibold ${
                            achievement.isUnlocked 
                              ? 'border-current bg-white/20 backdrop-blur-sm' 
                              : 'border-muted-foreground/30'
                          }`}
                        >
                          <span className="mr-1">{getRarityIcon(achievement.rarity)}</span>
                          {achievement.rarity === 'bronze' ? 'Bronze' :
                           achievement.rarity === 'silver' ? 'Silver' :
                           achievement.rarity === 'gold' ? 'Gold' :
                           'Diamond'}
                        </Badge>

                         {/* Progresso para conquistas não desbloqueadas */}
                        {!achievement.isUnlocked && achievement.progress !== undefined && achievement.maxProgress && (
                          <div className="w-full space-y-2 px-1">
                            <div className="relative w-full h-3 bg-muted-foreground/20 rounded-full overflow-hidden">
                              <motion.div
                                className={`h-full ${rarityStyles.progressBg} rounded-full relative`}
                                initial={{ width: 0 }}
                                animate={{ width: `${progressPercentage}%` }}
                                transition={{ duration: 1.5, delay: index * 0.2, ease: "easeOut" }}
                              >
                                {achievement.rarity === 'diamond' && (
                                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
                                )}
                              </motion.div>
                            </div>
                            <div className="text-center overflow-hidden">
                              <div className="text-sm font-bold truncate">
                                {achievement.progress}/{achievement.maxProgress}
                              </div>
                              <div className="text-xs opacity-80 mt-1 truncate">
                                {achievement.id === 'dedicado' ? 'dias' : 'problemas'}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Descrição para conquistas desbloqueadas */}
                        {achievement.isUnlocked && (
                          <p className="text-xs text-center opacity-90 leading-relaxed">
                            {achievement.description}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Verso do Card */}
                    {achievement.isUnlocked && (
                      <div
                        className={`absolute inset-0 w-full h-full rounded-xl border-2 p-6 rotate-y-180 backface-hidden ${rarityStyles.bg} ${rarityStyles.border} ${rarityStyles.text} shadow-lg`}
                      >
                        <div className="flex flex-col items-center justify-center h-full text-center">
                          <motion.div 
                            className="text-4xl mb-4"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                          >
                            {achievement.icon}
                          </motion.div>
                          <p className="text-sm leading-relaxed mb-4 font-medium">
                            {achievement.description}
                          </p>
                          <Badge className="bg-white/20 border-white/30 text-current">
                            Conquista Desbloqueada!
                          </Badge>
                          <div className="text-xs opacity-75 font-medium mt-3">
                            Clique para voltar
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>

                  {/* Efeito de brilho aprimorado */}
                  {isGlowing && achievement.isUnlocked && (
                    <motion.div
                      className="absolute inset-0 rounded-xl pointer-events-none"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0, 0.4, 0] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <div
                        className="w-full h-full rounded-xl"
                        style={{
                          background: achievement.rarity === 'gold' 
                            ? 'linear-gradient(45deg, transparent, rgba(245,158,11,0.4), transparent)'
                            : achievement.rarity === 'diamond'
                            ? 'linear-gradient(45deg, transparent, rgba(99,102,241,0.4), transparent)'
                            : achievement.rarity === 'silver'
                            ? 'linear-gradient(45deg, transparent, rgba(148,163,184,0.4), transparent)'
                            : 'linear-gradient(45deg, transparent, rgba(251,146,60,0.4), transparent)',
                          filter: 'blur(1px)'
                        }}
                      />
                    </motion.div>
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