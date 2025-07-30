import React from "react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Trophy, Target, Star, Zap } from "lucide-react";

interface ProgressNarrativeProps {
  value: number;
  subject: string;
  className?: string;
}

export const ProgressNarrative: React.FC<ProgressNarrativeProps> = ({ 
  value, 
  subject, 
  className = "" 
}) => {
  const getProgressNarrative = (progress: number) => {
    if (progress >= 90) return {
      message: "🏆 Maestria Conquistada!",
      color: "text-primary",
      icon: Trophy,
      description: "Você dominou este tópico!"
    };
    if (progress >= 75) return {
      message: "⭐ Quase Mestre!",
      color: "text-secondary", 
      icon: Star,
      description: "Faltam apenas alguns passos!"
    };
    if (progress >= 50) return {
      message: "🚀 Em Velocidade de Cruzeiro!",
      color: "text-primary",
      icon: Zap,
      description: "Progresso excelente!"
    };
    if (progress >= 25) return {
      message: "🎯 Ganhando Momentum!",
      color: "text-muted-foreground",
      icon: Target,
      description: "Continue assim!"
    };
    return {
      message: "🌱 Plantando Sementes",
      color: "text-muted-foreground",
      icon: Target,
      description: "Sua jornada começou!"
    };
  };

  const narrative = getProgressNarrative(value);
  const IconComponent = narrative.icon;

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <IconComponent className={`w-4 h-4 ${narrative.color}`} />
          <span className={`text-sm font-medium ${narrative.color}`}>
            {narrative.message}
          </span>
        </div>
        <Badge variant="outline" className="text-xs">
          {value}%
        </Badge>
      </div>
      
      <Progress 
        value={value} 
        className={`h-2 transition-all duration-500 ${value >= 90 ? 'progress-glow' : ''}`} 
      />
      
      <p className="text-xs text-muted-foreground animate-fade-in">
        {narrative.description}
      </p>
    </div>
  );
};