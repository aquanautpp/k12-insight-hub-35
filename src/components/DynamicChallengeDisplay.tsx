import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { RefreshCw, Trophy, Clock, Target } from "lucide-react";
import { useChallenge } from "@/contexts/ChallengeContext";
import { useProgress } from "@/contexts/ProgressContext";
import { useXP } from "@/contexts/XPContext";
import { useToast } from "@/hooks/use-toast";

export const DynamicChallengeDisplay: React.FC = () => {
  const { currentChallenge, generateNewChallenge, completeChallenge } = useChallenge();
  const { progress } = useProgress();
  const { xpData, addXP } = useXP();
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateNewChallenge = async () => {
    setIsGenerating(true);
    // Simulate API call delay
    setTimeout(() => {
      const learningStyle = progress.testResults?.learningStyle || 'visual';
      generateNewChallenge(xpData.currentLevel, learningStyle);
      setIsGenerating(false);
      toast({
        title: "Novo Desafio Gerado!",
        description: "Um desafio personalizado foi criado para você.",
      });
    }, 1000);
  };

  const handleCompleteChallenge = () => {
    if (currentChallenge) {
      completeChallenge(currentChallenge.id, "user-answer");
      addXP(currentChallenge.xpReward, `Completou desafio: ${currentChallenge.title}`);
      
      toast({
        title: "Desafio Completado!",
        description: `Você ganhou ${currentChallenge.xpReward} XP!`,
      });
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner": return "bg-gradient-focus text-primary";
      case "intermediate": return "bg-gradient-learning text-white";
      case "advanced": return "bg-gradient-achievement text-white";
      default: return "bg-secondary";
    }
  };

  const translateDifficulty = (difficulty: string) => {
    switch (difficulty) {
      case "beginner": return "Iniciante";
      case "intermediate": return "Intermediário";
      case "advanced": return "Avançado";
      default: return difficulty;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'mathematics': return '🧮';
      case 'logic': return '🧩';
      case 'life_practical': return '💰';
      case 'emotional': return '❤️';
      default: return '📚';
    }
  };

  if (!currentChallenge) {
    return (
      <Card className="p-6 text-center">
        <div className="space-y-4">
          <Target className="w-12 h-12 text-primary mx-auto" />
          <h3 className="text-lg font-semibold text-foreground">Nenhum Desafio Ativo</h3>
          <p className="text-foreground">Gere um novo desafio personalizado para seu nível</p>
          <Button onClick={handleGenerateNewChallenge} disabled={isGenerating}>
            {isGenerating ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Target className="w-4 h-4 mr-2" />
            )}
            {isGenerating ? 'Gerando...' : 'Gerar Novo Desafio'}
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="shadow-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-2xl">{getCategoryIcon(currentChallenge.category)}</div>
            <div>
              <CardTitle className="text-xl font-bold text-foreground">
                {currentChallenge.title}
              </CardTitle>
              <CardDescription className="text-foreground/80">
                Desafio Personalizado - Nível {xpData.currentLevel}
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={getDifficultyColor(currentChallenge.difficulty)}>
              {translateDifficulty(currentChallenge.difficulty)}
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1 text-primary border-primary">
              <Trophy className="w-3 h-3" />
              {currentChallenge.xpReward} XP
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Challenge Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-2 text-sm text-foreground">
            <Clock className="w-4 h-4 text-primary" />
            ~{currentChallenge.timeEstimate} min
          </div>
          <div className="flex items-center gap-2 text-sm text-foreground">
            <Target className="w-4 h-4 text-primary" />
            {currentChallenge.category.replace('_', ' ')}
          </div>
          <div className="flex items-center gap-2 text-sm text-foreground">
            <Trophy className="w-4 h-4 text-primary" />
            {currentChallenge.xpReward} XP de recompensa
          </div>
        </div>

        {/* Description */}
        <div className="bg-gradient-subtle p-4 rounded-lg">
          <p className="text-foreground leading-relaxed">
            {currentChallenge.description}
          </p>
        </div>

        {/* Context Information */}
        <div>
          <h4 className="font-medium text-foreground mb-2">Informações:</h4>
          <ul className="space-y-1">
            {currentChallenge.context.map((info, index) => (
              <li key={index} className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span className="text-foreground text-sm">{info}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Question */}
        <div className="bg-card border border-border rounded-lg p-4">
          <h4 className="font-medium text-foreground mb-2">DESAFIO:</h4>
          <p className="text-foreground leading-relaxed">
            {currentChallenge.question}
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <Button 
            onClick={handleCompleteChallenge}
            className="flex-1"
            variant="default"
          >
            <Trophy className="w-4 h-4 mr-2" />
            Completar Desafio (+{currentChallenge.xpReward} XP)
          </Button>
          
          <Button 
            variant="outline"
            onClick={handleGenerateNewChallenge}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};