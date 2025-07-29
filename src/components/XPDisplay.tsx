import React from 'react';
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Star, Zap, TrendingUp } from "lucide-react";
import { useXP } from "@/contexts/XPContext";

interface XPDisplayProps {
  showDetails?: boolean;
  className?: string;
}

export const XPDisplay: React.FC<XPDisplayProps> = ({ showDetails = false, className = "" }) => {
  const { xpData, getCurrentLevelProgress, getLevelBenefits } = useXP();

  if (!showDetails) {
    return (
      <Badge variant="secondary" className={`text-sm ${className}`}>
        <Star className="w-4 h-4 mr-1" />
        Nível {xpData.currentLevel}
      </Badge>
    );
  }

  const levelBenefits = getLevelBenefits(xpData.currentLevel);
  const nextLevelBenefits = getLevelBenefits(xpData.currentLevel + 1);

  return (
    <Card className={`p-4 ${className}`}>
      <div className="space-y-4">
        {/* Level and XP Info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-learning flex items-center justify-center">
              <Star className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-foreground">Nível {xpData.currentLevel}</h3>
              <p className="text-sm text-muted-foreground">{xpData.totalXP} XP Total</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-primary">{xpData.currentXP}</p>
            <p className="text-sm text-muted-foreground">/ {xpData.xpToNextLevel} XP</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-foreground">Progresso para o próximo nível</span>
            <span className="text-sm text-primary font-medium">{getCurrentLevelProgress()}%</span>
          </div>
          <Progress value={getCurrentLevelProgress()} className="h-3" />
        </div>

        {/* Multiplier */}
        {xpData.multiplier > 1.0 && (
          <div className="flex items-center gap-2 bg-gradient-focus/20 rounded-lg p-3">
            <Zap className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium">Multiplicador Ativo: {xpData.multiplier}x</span>
          </div>
        )}

        {/* Current Level Benefits */}
        {levelBenefits.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Benefícios Desbloqueados
            </h4>
            <div className="flex flex-wrap gap-2">
              {levelBenefits.map((benefit, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {benefit}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Next Level Preview */}
        {nextLevelBenefits.length > levelBenefits.length && (
          <div className="space-y-2 border-t border-border pt-3">
            <h4 className="text-sm font-medium text-muted-foreground">Próximo Desbloqueio - Nível {xpData.currentLevel + 1}</h4>
            <div className="flex flex-wrap gap-2">
              {nextLevelBenefits.slice(levelBenefits.length).map((benefit, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {benefit}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};