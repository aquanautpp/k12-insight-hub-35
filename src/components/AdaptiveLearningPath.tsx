import React from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Target, Brain, Award, Clock } from "lucide-react";

interface AdaptiveLearningPathProps {
  currentLevel: number;
  completedModules: string[];
  nextModules: string[];
  successRate: number;
  className?: string;
}

export const AdaptiveLearningPath: React.FC<AdaptiveLearningPathProps> = ({
  currentLevel,
  completedModules,
  nextModules,
  successRate,
  className = ""
}) => {
  const getLevelBadge = (level: number) => {
    if (level >= 80) return { text: "Avançado", color: "bg-gradient-achievement text-white" };
    if (level >= 60) return { text: "Intermediário", color: "bg-gradient-learning text-white" };
    return { text: "Iniciante", color: "bg-gradient-focus text-primary" };
  };

  const getSuccessRateColor = (rate: number) => {
    if (rate >= 85) return "text-green-600";
    if (rate >= 70) return "text-yellow-600";
    return "text-orange-600";
  };

  const levelBadge = getLevelBadge(currentLevel);

  return (
    <Card className={`p-6 ${className} card-clean`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-2">Seu Caminho Adaptativo</h3>
          <Badge className={levelBadge.color}>{levelBadge.text}</Badge>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-primary">{successRate}%</div>
          <div className="text-sm font-medium text-primary">
            Taxa de Sucesso
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {/* Módulos Completados */}
        <div>
          <h4 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            Conquistados ({completedModules.length})
          </h4>
          <div className="flex flex-wrap gap-2">
            {completedModules.map((module, index) => (
              <Badge key={index} variant="outline" className="text-xs bg-primary text-white border-primary">
                ✓ {module}
              </Badge>
            ))}
          </div>
        </div>

        {/* Próximos Módulos */}
        <div>
          <h4 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
            <Target className="w-4 h-4 text-primary" />
            Próximos Desafios
          </h4>
          <div className="space-y-2">
            {nextModules.slice(0, 3).map((module, index) => (
              <div key={index} className="flex items-center gap-3 p-2 rounded-lg bg-muted/30">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  index === 0 ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'
                }`}>
                  {index + 1}
                </div>
                <span className="text-sm text-foreground">{module}</span>
                {index === 0 && <Badge variant="secondary" className="text-xs ml-auto">Recomendado</Badge>}
              </div>
            ))}
          </div>
        </div>

        {/* Progresso Geral */}
        <div className="pt-2 border-t border-border">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-foreground">Progresso do Nível</span>
            <span className="text-sm text-muted-foreground">{currentLevel}%</span>
          </div>
          <Progress value={currentLevel} className="h-2" />
        </div>
      </div>
    </Card>
  );
};