import React from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Trophy, Star, Target, Clock, BookOpen, Brain, Zap } from "lucide-react";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'learning' | 'streak' | 'mastery' | 'social' | 'special';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockedAt?: Date;
  progress?: {
    current: number;
    target: number;
  };
  rewards: {
    xp: number;
    unlocks?: string[];
  };
}

interface AchievementSystemProps {
  achievements: Achievement[];
  onClaimReward: (achievementId: string) => void;
}

const AchievementSystem: React.FC<AchievementSystemProps> = ({
  achievements,
  onClaimReward
}) => {
  const rarityColors = {
    common: "bg-gray-500",
    rare: "bg-blue-500", 
    epic: "bg-purple-500",
    legendary: "bg-gold-500"
  };

  const categoryIcons = {
    learning: <BookOpen className="w-5 h-5" />,
    streak: <Zap className="w-5 h-5" />,
    mastery: <Brain className="w-5 h-5" />,
    social: <Star className="w-5 h-5" />,
    special: <Trophy className="w-5 h-5" />
  };

  const unlockedAchievements = achievements.filter(a => a.unlockedAt);
  const inProgressAchievements = achievements.filter(a => !a.unlockedAt && a.progress);
  const lockedAchievements = achievements.filter(a => !a.unlockedAt && !a.progress);

  return (
    <div className="space-y-6">
      {/* Conquistas Desbloqueadas */}
      {unlockedAchievements.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-gold-500" />
            Conquistas Desbloqueadas ({unlockedAchievements.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {unlockedAchievements.map((achievement) => (
              <Card key={achievement.id} className="p-4 hover:shadow-achievement transition-all duration-300 border-gold-200">
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-12 h-12 ${rarityColors[achievement.rarity]} rounded-xl flex items-center justify-center text-white shadow-glow`}>
                    {categoryIcons[achievement.category]}
                  </div>
                  <Badge variant="secondary" className={`${rarityColors[achievement.rarity]} text-white`}>
                    {achievement.rarity}
                  </Badge>
                </div>
                
                <h4 className="font-semibold mb-1">{achievement.title}</h4>
                <p className="text-sm text-muted-foreground mb-3">{achievement.description}</p>
                
                <div className="flex items-center justify-between">
                  <div className="text-sm">
                    <span className="text-green-600 font-semibold">+{achievement.rewards.xp} XP</span>
                  </div>
                  {achievement.unlockedAt && (
                    <div className="text-xs text-muted-foreground">
                      {achievement.unlockedAt.toLocaleDateString()}
                    </div>
                  )}
                </div>
                
                {achievement.rewards.unlocks && (
                  <div className="mt-2">
                    <p className="text-xs font-semibold text-primary">Desbloqueou:</p>
                    <p className="text-xs text-muted-foreground">{achievement.rewards.unlocks.join(', ')}</p>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Conquistas em Progresso */}
      {inProgressAchievements.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            Em Progresso ({inProgressAchievements.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {inProgressAchievements.map((achievement) => (
              <Card key={achievement.id} className="p-4 hover:shadow-card transition-all duration-300">
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-10 h-10 ${rarityColors[achievement.rarity]} rounded-lg flex items-center justify-center text-white opacity-75`}>
                    {categoryIcons[achievement.category]}
                  </div>
                  <Badge variant="outline">
                    {achievement.rarity}
                  </Badge>
                </div>
                
                <h4 className="font-semibold mb-1">{achievement.title}</h4>
                <p className="text-sm text-muted-foreground mb-3">{achievement.description}</p>
                
                {achievement.progress && (
                  <div className="space-y-2 mb-3">
                    <div className="flex justify-between text-sm">
                      <span>Progresso</span>
                      <span>{achievement.progress.current}/{achievement.progress.target}</span>
                    </div>
                    <Progress 
                      value={(achievement.progress.current / achievement.progress.target) * 100} 
                      className="h-2" 
                    />
                  </div>
                )}
                
                <div className="text-sm text-green-600 font-semibold">
                  Recompensa: +{achievement.rewards.xp} XP
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Conquistas Bloqueadas */}
      {lockedAchievements.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Clock className="w-5 h-5 text-muted-foreground" />
            Conquistas Secretas ({lockedAchievements.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {lockedAchievements.map((achievement) => (
              <Card key={achievement.id} className="p-4 opacity-60 hover:opacity-80 transition-opacity">
                <div className="text-center">
                  <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center mx-auto mb-2">
                    <span className="text-2xl">🔒</span>
                  </div>
                  <h4 className="font-semibold text-sm mb-1">???</h4>
                  <p className="text-xs text-muted-foreground">Conquista secreta</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AchievementSystem;