import React from "react";
import { Card } from "@/components/ui/card";
import { Clock, Zap, Target } from "lucide-react";

interface QuickWinMessageProps {
  type?: "daily" | "skill" | "achievement";
  className?: string;
}

export const QuickWinMessage: React.FC<QuickWinMessageProps> = ({ 
  type = "daily", 
  className = "" 
}) => {
  const messages = {
    daily: {
      icon: Clock,
      title: "5 Minutos = 1 Grande Vitória",
      description: "Pequenas ações diárias criam transformações épicas",
      color: "text-primary",
      gradient: "bg-gradient-focus"
    },
    skill: {
      icon: Zap,
      title: "Próximo Nível em Vista",
      description: "Cada exercício te aproxima da maestria",
      color: "text-secondary",
      gradient: "bg-gradient-learning"
    },
    achievement: {
      icon: Target,
      title: "Seu Próximo Troféu Aguarda",
      description: "Complete mais 2 atividades para desbloquear",
      color: "text-primary",
      gradient: "bg-gradient-achievement"
    }
  };

  const config = messages[type];
  const IconComponent = config.icon;

  return (
    <Card className={`p-4 ${config.gradient} border-0 ${className} animate-fade-in`}>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
          <IconComponent className={`w-5 h-5 ${config.color}`} />
        </div>
        <div className="flex-1">
          <h4 className={`font-semibold text-sm ${config.color}`}>
            {config.title}
          </h4>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {config.description}
          </p>
        </div>
      </div>
    </Card>
  );
};