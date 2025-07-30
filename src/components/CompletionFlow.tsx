import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, PlayCircle, Clock, Star, ArrowRight } from "lucide-react";

interface CompletionFlowProps {
  title: string;
  description: string;
  steps: Array<{
    id: string;
    title: string;
    description: string;
    estimated_time: string;
    difficulty: "easy" | "medium" | "hard";
    completed?: boolean;
  }>;
  successRate?: number;
  className?: string;
}

export const CompletionFlow: React.FC<CompletionFlowProps> = ({
  title,
  description,
  steps,
  successRate = 0,
  className = ""
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return "bg-green-100 text-green-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "hard": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return "⭐";
      case "medium": return "⭐⭐";
      case "hard": return "⭐⭐⭐";
      default: return "⭐";
    }
  };

  const completeStep = (stepId: string) => {
    if (!completedSteps.includes(stepId)) {
      setCompletedSteps([...completedSteps, stepId]);
    }
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const progress = (completedSteps.length / steps.length) * 100;

  return (
    <Card className={`p-6 ${className} card-clean`}>
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="text-xl font-semibold text-foreground mb-2">{title}</h3>
            <p className="text-muted-foreground text-sm">{description}</p>
          </div>
          {successRate > 0 && (
            <div className="text-right">
              <div className="text-lg font-bold text-primary">{successRate}%</div>
              <div className="text-xs text-muted-foreground">Taxa de Conclusão</div>
            </div>
          )}
        </div>

        {/* Progress Overview */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-foreground">
              Progresso: {completedSteps.length}/{steps.length} passos
            </span>
            <Badge variant={progress === 100 ? "default" : "secondary"}>
              {progress === 100 ? "Concluído!" : `${Math.round(progress)}%`}
            </Badge>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      {/* Steps */}
      <div className="space-y-4">
        {steps.map((step, index) => {
          const isCompleted = completedSteps.includes(step.id);
          const isCurrent = index === currentStep && !isCompleted;
          const isLocked = index > currentStep && !isCompleted;

          return (
            <div
              key={step.id}
              className={`p-4 rounded-lg border transition-all duration-200 ${
                isCompleted 
                  ? "bg-green-50 border-green-200" 
                  : isCurrent 
                    ? "bg-primary/5 border-primary/20 ring-1 ring-primary/10" 
                    : isLocked
                      ? "bg-muted/30 border-muted"
                      : "bg-card border-border"
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Step indicator */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  isCompleted 
                    ? "bg-green-500 text-white" 
                    : isCurrent 
                      ? "bg-primary text-white animate-pulse" 
                      : "bg-muted text-muted-foreground"
                }`}>
                  {isCompleted ? <CheckCircle className="w-4 h-4" /> : index + 1}
                </div>

                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className={`font-medium ${isLocked ? "text-muted-foreground" : "text-foreground"}`}>
                      {step.title}
                    </h4>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={getDifficultyColor(step.difficulty)}>
                        {getDifficultyIcon(step.difficulty)} {step.difficulty}
                      </Badge>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {step.estimated_time}
                      </div>
                    </div>
                  </div>
                  
                  <p className={`text-sm mb-3 ${isLocked ? "text-muted-foreground" : "text-muted-foreground"}`}>
                    {step.description}
                  </p>

                  {isCurrent && (
                    <Button 
                      onClick={() => completeStep(step.id)}
                      size="sm"
                      className="hover-scale"
                    >
                      <PlayCircle className="w-4 h-4 mr-2" />
                      Iniciar Etapa
                    </Button>
                  )}

                  {isCompleted && (
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <CheckCircle className="w-4 h-4" />
                      Concluído com sucesso!
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      {progress === 100 && (
        <div className="mt-6 p-4 bg-gradient-achievement rounded-lg text-center">
          <Star className="w-8 h-8 text-white mx-auto mb-2" />
          <h4 className="font-semibold text-white mb-1">Parabéns! 🎉</h4>
          <p className="text-white/90 text-sm">Você completou todo o fluxo de aprendizagem!</p>
        </div>
      )}
    </Card>
  );
};