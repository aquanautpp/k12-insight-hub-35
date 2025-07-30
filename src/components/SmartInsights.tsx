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
    // Todas as categorias usam a cor verde oliva (primary)
    return 'text-primary';
  };

  return (
    <Card className="bg-card shadow-card border border-border">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          Insights Inteligentes
        </h3>
        <div className="grid grid-cols-1 gap-4">
          {insights.map((insight, index) => (
            <div key={index} className="bg-card shadow-card border border-border hover:shadow-lg transition-all duration-300 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <insight.icon className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full bg-primary/10 ${getTypeColor(insight.type)}`}>
                      {getTypeLabel(insight.type)}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {insight.confidence}% confiança
                    </span>
                  </div>
                  <p className="text-sm text-foreground leading-relaxed">
                    {insight.message}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};