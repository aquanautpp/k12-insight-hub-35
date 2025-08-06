import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { RefreshCw, Trophy, Clock, Target, BookOpen } from "lucide-react";
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
  const [userAnswer, setUserAnswer] = useState("");

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
    if (currentChallenge && userAnswer.trim()) {
      completeChallenge(currentChallenge.id, userAnswer);
      addXP(currentChallenge.xpReward, `Completou desafio: ${currentChallenge.title}`);
      setUserAnswer("");
      
      toast({
        title: "Desafio Completado!",
        description: `Você ganhou ${currentChallenge.xpReward} XP!`,
      });
    } else {
      toast({
        title: "Resposta necessária",
        description: "Por favor, digite sua resposta antes de completar o desafio.",
        variant: "destructive"
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
            <Badge className={`${getDifficultyColor(currentChallenge.difficulty)} text-black`}>
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

        {/* Enunciado */}
        <div className="space-y-2">
          <h3 className="font-semibold text-lg text-primary flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            📍 Enunciado
          </h3>
          <div className="bg-gradient-subtle p-4 rounded-lg">
            <p className="text-foreground leading-relaxed">
              {currentChallenge.enunciado}
            </p>
          </div>
        </div>

        {/* Visualização */}
        <div className="space-y-2">
          <h4 className="font-medium text-primary flex items-center gap-2">
            🎨 Visualização
          </h4>
          <div className="p-6 bg-accent/30 rounded-lg text-center border-2 border-dashed border-primary/20">
            <div className="text-2xl leading-relaxed whitespace-pre-line font-mono">
              {currentChallenge.visualizacao}
            </div>
          </div>
        </div>

        {/* Campo de Resposta */}
        <div className="space-y-2">
          <h4 className="font-medium text-primary flex items-center gap-2">
            ✏️ Sua Resposta
          </h4>
          <Input
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            placeholder="Digite sua resposta aqui..."
            className="text-lg p-4 border-2 border-primary/20 focus:border-primary"
          />
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