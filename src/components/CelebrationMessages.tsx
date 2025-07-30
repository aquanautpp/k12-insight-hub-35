import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, Star, Zap, Target, Gift, Sparkles } from "lucide-react";

interface Achievement {
  id: string;
  title: string;
  description: string;
  type: "milestone" | "streak" | "skill" | "special";
  icon: string;
  rarity: "common" | "rare" | "epic" | "legendary";
  unlockedAt?: Date;
  progress?: number;
  maxProgress?: number;
}

interface CelebrationMessagesProps {
  achievement: Achievement;
  isNewlyUnlocked?: boolean;
  onCelebrate?: () => void;
  className?: string;
}

export const CelebrationMessages: React.FC<CelebrationMessagesProps> = ({
  achievement,
  isNewlyUnlocked = false,
  onCelebrate,
  className = ""
}) => {
  const [isAnimating, setIsAnimating] = useState(isNewlyUnlocked);

  const getRarityStyles = (rarity: string) => {
    switch (rarity) {
      case "common":
        return {
          gradient: "bg-gradient-focus",
          border: "border-gray-200",
          glow: "",
          text: "text-gray-700"
        };
      case "rare":
        return {
          gradient: "bg-gradient-learning",
          border: "border-blue-300",
          glow: "shadow-lg shadow-blue-200",
          text: "text-blue-700"
        };
      case "epic":
        return {
          gradient: "bg-gradient-achievement",
          border: "border-purple-300",
          glow: "shadow-lg shadow-purple-200",
          text: "text-purple-700"
        };
      case "legendary":
        return {
          gradient: "bg-gradient-celebration",
          border: "border-yellow-300",
          glow: "shadow-xl shadow-yellow-200",
          text: "text-yellow-800"
        };
      default:
        return {
          gradient: "bg-gradient-focus",
          border: "border-gray-200",
          glow: "",
          text: "text-gray-700"
        };
    }
  };

  const getCelebrationMessage = (type: string, rarity: string) => {
    const messages = {
      milestone: {
        common: "Parabéns! Você alcançou um marco importante! 🎯",
        rare: "Incrível! Você desbloqueou uma conquista especial! ⭐",
        epic: "Espetacular! Uma conquista épica foi desbloqueada! 🌟",
        legendary: "LENDÁRIO! Você é oficialmente um mestre! 👑"
      },
      streak: {
        common: "Ótima constância! Continue assim! 🔥",
        rare: "Sua dedicação está impressionante! 💪",
        epic: "Você é imparável! Que sequência incrível! ⚡",
        legendary: "HISTÓRICO! Sua consistência é lendária! 🏆"
      },
      skill: {
        common: "Nova habilidade dominada! 📚",
        rare: "Você evoluiu suas habilidades! 🧠",
        epic: "Maestria desbloqueada! Você é excepcional! 🎓",
        legendary: "GENIAL! Você transcendeu limites! 🚀"
      },
      special: {
        common: "Conquista especial desbloqueada! 🎁",
        rare: "Algo raro aconteceu! Parabéns! ✨",
        epic: "Evento épico! Você fez algo extraordinário! 💫",
        legendary: "IMPOSSÍVEL! Você fez o impossível! 🌈"
      }
    };

    return messages[type]?.[rarity] || "Parabéns pela conquista! 🎉";
  };

  const handleCelebrate = () => {
    setIsAnimating(true);
    onCelebrate?.();
    
    // Reset animation after duration
    setTimeout(() => {
      setIsAnimating(false);
    }, 1000);
  };

  const styles = getRarityStyles(achievement.rarity);
  const celebrationText = getCelebrationMessage(achievement.type, achievement.rarity);

  return (
    <Card className={`p-6 ${styles.gradient} ${styles.border} ${styles.glow} ${className} ${
      isAnimating ? 'celebration-bounce' : ''
    } transition-all duration-300`}>
      {/* Sparkles effect for legendary achievements */}
      {achievement.rarity === "legendary" && isAnimating && (
        <div className="absolute inset-0 pointer-events-none">
          <Sparkles className="absolute top-2 left-2 text-yellow-400 animate-bounce" />
          <Sparkles className="absolute top-4 right-6 text-yellow-400 animate-bounce delay-100" />
          <Sparkles className="absolute top-8 left-1/2 text-yellow-400 animate-bounce delay-200" />
        </div>
      )}

      <div className="relative">
        {/* Achievement Icon */}
        <div className="text-center mb-4">
          <div className={`inline-flex w-16 h-16 rounded-full items-center justify-center mb-3 ${
            achievement.rarity === "legendary" ? "bg-gradient-celebration" : "bg-white/20"
          } ${isAnimating ? "animate-pulse" : ""}`}>
            <span className="text-3xl">{achievement.icon}</span>
          </div>
          
          <Badge className={`${styles.text} bg-white/80 border-0`}>
            {achievement.rarity.toUpperCase()}
          </Badge>
        </div>

        {/* Achievement Details */}
        <div className="text-center space-y-2 mb-4">
          <h3 className={`text-xl font-bold ${styles.text}`}>
            {achievement.title}
          </h3>
          <p className={`text-sm ${styles.text} opacity-90`}>
            {achievement.description}
          </p>
        </div>

        {/* Celebration Message */}
        <div className="text-center mb-4">
          <p className={`font-medium ${styles.text}`}>
            {celebrationText}
          </p>
        </div>

        {/* Progress Bar (if applicable) */}
        {achievement.progress !== undefined && achievement.maxProgress && (
          <div className="mb-4">
            <div className="flex justify-between text-xs text-white/80 mb-1">
              <span>Progresso</span>
              <span>{achievement.progress}/{achievement.maxProgress}</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div 
                className="bg-white h-2 rounded-full transition-all duration-500"
                style={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="text-center space-y-2">
          <Button 
            onClick={handleCelebrate}
            variant="outline"
            className="w-full bg-white/20 border-white/40 text-white hover:bg-white/30"
          >
            <Star className="w-4 h-4 mr-2" />
            Celebrar Conquista!
          </Button>
          
          {achievement.rarity === "legendary" && (
            <Button 
              variant="outline"
              className="w-full bg-white/10 border-white/30 text-white/80 hover:bg-white/20 text-xs"
            >
              <Gift className="w-3 h-3 mr-2" />
              Compartilhar com Amigos
            </Button>
          )}
        </div>

        {/* Unlock timestamp */}
        {achievement.unlockedAt && (
          <div className="text-center mt-3">
            <span className={`text-xs ${styles.text} opacity-70`}>
              Desbloqueado em {achievement.unlockedAt.toLocaleDateString()}
            </span>
          </div>
        )}
      </div>
    </Card>
  );
};

// Sample achievements data
export const sampleAchievements: Achievement[] = [
  {
    id: "first-cpa-complete",
    title: "Mestre CPA Iniciante",
    description: "Completou seu primeiro ciclo Concreto-Pictórico-Abstrato",
    type: "milestone",
    icon: "🎯",
    rarity: "common",
    unlockedAt: new Date(),
    progress: 3,
    maxProgress: 3
  },
  {
    id: "week-streak",
    title: "Semana de Foco",
    description: "Praticou matemática por 7 dias consecutivos",
    type: "streak",
    icon: "🔥",
    rarity: "rare",
    unlockedAt: new Date(),
    progress: 7,
    maxProgress: 7
  },
  {
    id: "logic-master",
    title: "Mestre da Lógica",
    description: "Resolveu 50 problemas de raciocínio lógico com 95% de precisão",
    type: "skill",
    icon: "🧠",
    rarity: "epic",
    progress: 50,
    maxProgress: 50
  },
  {
    id: "perfect-month",
    title: "Mês Perfeito",
    description: "Completou todas as atividades diárias por 30 dias seguidos",
    type: "special",
    icon: "👑",
    rarity: "legendary",
    unlockedAt: new Date(),
    progress: 30,
    maxProgress: 30
  }
];