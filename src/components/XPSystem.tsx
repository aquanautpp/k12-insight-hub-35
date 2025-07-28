import React from 'react';
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Star, Trophy, Zap, Target } from "lucide-react";

interface XPSystemProps {
  currentXP: number;
  currentLevel: number;
  xpToNextLevel: number;
  totalXPForNextLevel: number;
  recentGains: Array<{
    activity: string;
    xp: number;
    timestamp: Date;
  }>;
}

const XPSystem: React.FC<XPSystemProps> = ({
  currentXP,
  currentLevel,
  xpToNextLevel,
  totalXPForNextLevel,
  recentGains
}) => {
  const progressPercentage = ((totalXPForNextLevel - xpToNextLevel) / totalXPForNextLevel) * 100;

  const getLevelBadge = (level: number) => {
    if (level < 5) return { color: "bg-gray-500", title: "Iniciante", icon: <Star className="w-4 h-4" /> };
    if (level < 10) return { color: "bg-blue-500", title: "Aprendiz", icon: <Zap className="w-4 h-4" /> };
    if (level < 20) return { color: "bg-purple-500", title: "Experiente", icon: <Target className="w-4 h-4" /> };
    return { color: "bg-gold-500", title: "Mestre", icon: <Trophy className="w-4 h-4" /> };
  };

  const levelInfo = getLevelBadge(currentLevel);

  return (
    <Card className="p-6 bg-gradient-learning text-white shadow-elegant">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 ${levelInfo.color} rounded-xl flex items-center justify-center shadow-glow`}>
            {levelInfo.icon}
          </div>
          <div>
            <h3 className="text-xl font-bold">Nível {currentLevel}</h3>
            <Badge variant="secondary" className="mt-1">
              {levelInfo.title}
            </Badge>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold">{currentXP.toLocaleString()}</div>
          <div className="text-sm opacity-80">XP Total</div>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span>Progresso para Nível {currentLevel + 1}</span>
          <span>{totalXPForNextLevel - xpToNextLevel}/{totalXPForNextLevel} XP</span>
        </div>
        <Progress value={progressPercentage} className="h-3 bg-white/20" />
      </div>

      {recentGains.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-semibold text-sm mb-2">Ganhos Recentes de XP</h4>
          {recentGains.slice(0, 3).map((gain, index) => (
            <div key={index} className="flex items-center justify-between bg-white/10 rounded-lg p-2">
              <span className="text-sm">{gain.activity}</span>
              <Badge variant="secondary" className="bg-green-500 text-white">
                +{gain.xp} XP
              </Badge>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

export default XPSystem;