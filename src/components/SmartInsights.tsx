import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, Target, Clock, TrendingUp, Lightbulb } from "lucide-react";
import { useProgress } from "@/contexts/ProgressContext";
import { useXP } from "@/contexts/XPContext";

interface SmartInsightsProps {
  className?: string;
}

export const SmartInsights: React.FC<SmartInsightsProps> = ({ className = "" }) => {
  const { progress } = useProgress();
  const { xpData } = useXP();

  // Generate dynamic insights based on real progress data
  const generateInsights = () => {
    const insights = [];

    // Progress-based insights
    if (progress.completedActivities > 10) {
      insights.push({
        type: "pontos_fortes",
        message: `Excelente consistência! Você completou ${progress.completedActivities} atividades`,
        confidence: 95,
        icon: Target
      });
    }

    // Streak-based insights
    if (progress.currentStreak >= 3) {
      insights.push({
        type: "padrao",
        message: `Ótimo ritmo! Você está em uma sequência de ${progress.currentStreak} dias`,
        confidence: 92,
        icon: Clock
      });
    }

    // Skill progression insights
    const improvingSkills = progress.skillsProgress.filter(skill => skill.trend === 'up');
    if (improvingSkills.length > 0) {
      insights.push({
        type: "recomendacao",
        message: `Continue focando em ${improvingSkills[0].skill} - você está progredindo bem!`,
        confidence: 88,
        icon: TrendingUp
      });
    }

    // CPA method insights
    const strongestStage = Object.entries(progress.cpaProgress)
      .reduce((max, [stage, value]) => value > max.value ? { stage, value } : max, { stage: '', value: 0 });
    
    if (strongestStage.value > 70) {
      insights.push({
        type: "pontos_fortes",
        message: `Você demonstra excelência no estágio ${strongestStage.stage === 'concrete' ? 'Concreto' : strongestStage.stage === 'pictorial' ? 'Pictórico' : 'Abstrato'}`,
        confidence: 94,
        icon: Brain
      });
    }

    // Level-based recommendations
    if (xpData.currentLevel >= 10) {
      insights.push({
        type: "recomendacao",
        message: "Como você já domina o básico, que tal tentar problemas mais complexos?",
        confidence: 90,
        icon: Lightbulb
      });
    }

    return insights.slice(0, 3); // Return max 3 insights
  };

  const insights = generateInsights();

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'pontos_fortes': return 'Pontos Fortes';
      case 'recomendacao': return 'Recomendação';
      case 'padrao': return 'Padrão';
      default: return type;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'pontos_fortes': return 'text-secondary';
      case 'recomendacao': return 'text-primary';
      case 'padrao': return 'text-accent';
      default: return 'text-foreground';
    }
  };

  return (
    <div className={`grid grid-cols-1 md:grid-cols-${Math.min(insights.length, 3)} gap-6 ${className}`}>
      {insights.map((insight, index) => (
        <Card key={index} className="card-interactive shadow-card bg-gradient-focus border border-primary/20 hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center">
                  <insight.icon className="w-5 h-5 text-white" />
                </div>
                <div className="ml-3">
                  <span className="text-sm font-semibold text-foreground">
                    {getTypeLabel(insight.type)}
                  </span>
                  <Badge variant="secondary" className="ml-2 text-xs bg-primary/10 text-primary">
                    {insight.confidence}% confiança
                  </Badge>
                </div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{insight.message}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};