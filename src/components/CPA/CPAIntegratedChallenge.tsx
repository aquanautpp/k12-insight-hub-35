import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, ArrowLeft, RotateCcw, Brain, Timer } from "lucide-react";
import { VirtualTenBlocks } from "./VirtualTenBlocks";
import { BarModelEditor } from "./BarModelEditor";
import { EquationEditor } from "./EquationEditor";

type CPAStage = 'concrete' | 'pictorial' | 'abstract';

interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  concrete: {
    description: string;
    initialValue1: number;
    initialValue2: number;
    expectedResult: number;
    operation: 'add' | 'subtract';
  };
  pictorial: {
    description: string;
    expectedModel: any[];
    expectedResult: number;
    type: 'addition' | 'subtraction' | 'comparison' | 'part-whole';
  };
  abstract: {
    description: string;
    equation: string;
    expectedSteps: string[];
    expectedResult: number | string;
    hints: string[];
  };
}

// Exemplo de desafio "Quantas Figurinhas Pedro Tem?"
const pedroChalenge: Challenge = {
  id: "pedro-figurinhas",
  title: "Quantas Figurinhas Pedro Tem?",
  description: "Pedro tinha 27 figurinhas. Ganhou mais 15 do amigo João. Quantas figurinhas ele tem agora?",
  difficulty: 'intermediate',
  concrete: {
    description: "Use os blocos base 10 para representar as figurinhas de Pedro (27) e as que ele ganhou de João (15).",
    initialValue1: 27,
    initialValue2: 15,
    expectedResult: 42,
    operation: 'add'
  },
  pictorial: {
    description: "Crie um modelo de barras mostrando as figurinhas que Pedro tinha e as que ganhou.",
    expectedModel: [[{value: 27, label: "Pedro tinha"}, {value: 15, label: "Ganhou de João"}]],
    expectedResult: 42,
    type: 'addition'
  },
  abstract: {
    description: "Resolva a operação matematicamente usando o algoritmo da adição.",
    equation: "27 + 15 = ?",
    expectedSteps: ["27 + 15", "7 + 5 = 12", "2 + 1 + 1 = 4", "42"],
    expectedResult: 42,
    hints: [
      "Comece somando as unidades: 7 + 5",
      "Quando soma 12, escreva 2 e 'vai 1' para as dezenas",
      "Some as dezenas: 2 + 1 + 1 (que veio das unidades)",
      "O resultado final é 42 figurinhas"
    ]
  }
};

interface CPAIntegratedChallengeProps {
  challenge?: Challenge;
  onComplete?: (challenge: Challenge, stage: CPAStage) => void;
}

export const CPAIntegratedChallenge = ({ 
  challenge = pedroChalenge, 
  onComplete 
}: CPAIntegratedChallengeProps) => {
  const [currentStage, setCurrentStage] = useState<CPAStage>('concrete');
  const [completedStages, setCompletedStages] = useState<CPAStage[]>([]);
  const [stageAttempts, setStageAttempts] = useState<Record<CPAStage, number>>({
    concrete: 0,
    pictorial: 0,
    abstract: 0
  });
  const [startTime, setStartTime] = useState<Date>(new Date());
  const [stageStartTime, setStageStartTime] = useState<Date>(new Date());

  useEffect(() => {
    setStartTime(new Date());
    setStageStartTime(new Date());
  }, [challenge]);

  useEffect(() => {
    setStageStartTime(new Date());
  }, [currentStage]);

  const handleStageComplete = (success: boolean) => {
    if (success) {
      setCompletedStages(prev => [...new Set([...prev, currentStage])]);
      
      // Chamar callback se fornecido
      onComplete?.(challenge, currentStage);
      
      // Lógica de progressão adaptativa
      const attempts = stageAttempts[currentStage] + 1;
      setStageAttempts(prev => ({ ...prev, [currentStage]: attempts }));
      
      // Auto-avançar para próximo estágio se bem-sucedido
      if (currentStage === 'concrete') {
        setTimeout(() => setCurrentStage('pictorial'), 1500);
      } else if (currentStage === 'pictorial') {
        setTimeout(() => setCurrentStage('abstract'), 1500);
      }
    } else {
      // Incrementar tentativas em caso de erro
      setStageAttempts(prev => ({ 
        ...prev, 
        [currentStage]: prev[currentStage] + 1 
      }));
      
      // Se muitas tentativas erradas, sugerir voltar ao estágio anterior
      if (stageAttempts[currentStage] >= 2 && currentStage !== 'concrete') {
        // Lógica para sugerir retorno será implementada no feedback do componente
      }
    }
  };

  const handleReturnToPictorial = () => {
    setCurrentStage('pictorial');
  };

  const goToStage = (stage: CPAStage) => {
    setCurrentStage(stage);
    setStageStartTime(new Date());
  };

  const resetChallenge = () => {
    setCurrentStage('concrete');
    setCompletedStages([]);
    setStageAttempts({ concrete: 0, pictorial: 0, abstract: 0 });
    setStartTime(new Date());
    setStageStartTime(new Date());
  };

  const getStageProgress = () => {
    const stages: CPAStage[] = ['concrete', 'pictorial', 'abstract'];
    const currentIndex = stages.indexOf(currentStage);
    return ((currentIndex + 1) / stages.length) * 100;
  };

  const getStageIcon = (stage: CPAStage) => {
    switch (stage) {
      case 'concrete': return '🧱';
      case 'pictorial': return '🎨';
      case 'abstract': return '🔢';
    }
  };

  const getStageTitle = (stage: CPAStage) => {
    switch (stage) {
      case 'concrete': return 'Estágio Concreto';
      case 'pictorial': return 'Estágio Pictórico';
      case 'abstract': return 'Estágio Abstrato';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800 border-green-200';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'advanced': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const translateDifficulty = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'Iniciante';
      case 'intermediate': return 'Intermediário';
      case 'advanced': return 'Avançado';
      default: return difficulty;
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header do Desafio */}
        <Card className="shadow-card border-2 border-primary/20 bg-gradient-to-br from-gradient-start to-gradient-end card-interactive">
          <CardHeader className="bg-gradient-to-r from-primary via-primary/90 to-primary/80 text-white rounded-t-lg">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold text-white">
                  {challenge.title}
                </CardTitle>
                <p className="text-white mt-2">{challenge.description}</p>
              </div>
              <div className="flex items-center gap-3">
                <Badge className="bg-white/30 text-white border-white/40">
                  {translateDifficulty(challenge.difficulty)}
                </Badge>
                <Button variant="ghost" size="sm" onClick={resetChallenge} className="bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800 border border-green-600 shadow-lg">
                  <RotateCcw className="w-4 h-4 text-white" />
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            {/* Progresso geral */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">Progresso no Método CPA</span>
                <span className="text-sm text-muted-foreground">
                  {completedStages.length}/3 estágios completos
                </span>
              </div>
              <Progress value={getStageProgress()} className="h-2" />
            </div>
            
            {/* Navegação entre estágios */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {(['concrete', 'pictorial', 'abstract'] as CPAStage[]).map((stage) => (
                <Button
                  key={stage}
                  variant="outline"
                  onClick={() => goToStage(stage)}
                  className={`flex items-center gap-2 p-3 h-auto min-h-[60px] justify-start ${
                    currentStage === stage 
                      ? 'bg-green-400 text-white hover:bg-green-500 border-green-400' 
                      : ''
                  }`}
                  disabled={stage === 'pictorial' && !completedStages.includes('concrete') ||
                           stage === 'abstract' && !completedStages.includes('pictorial')}
                >
                  <span className="text-xl">{getStageIcon(stage)}</span>
                  <div className="text-left flex-1">
                    <div className="font-medium text-sm">{getStageTitle(stage)}</div>
                    <div className="text-xs opacity-70 break-words">
                      {completedStages.includes(stage) ? '✅ Completo' : 
                       stageAttempts[stage] > 0 ? `${stageAttempts[stage]} tentativas` : 'Novo'}
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Componente do estágio atual */}
        <div className="animate-fade-in">
          {currentStage === 'concrete' && (
            <VirtualTenBlocks
              problem={challenge.concrete}
              onComplete={handleStageComplete}
            />
          )}
          
          {currentStage === 'pictorial' && (
            <BarModelEditor
              problem={challenge.pictorial}
              onComplete={handleStageComplete}
            />
          )}
          
          {currentStage === 'abstract' && (
            <EquationEditor
              problem={challenge.abstract}
              onComplete={handleStageComplete}
              onReturnToPictorial={handleReturnToPictorial}
            />
          )}
        </div>

        {/* Estatísticas e feedback - Pronto para Desafio */}
        <Card className="shadow-lg border-2 border-primary/30 bg-gradient-to-br from-gradient-start to-gradient-end overflow-hidden">
          <CardHeader className="pb-4 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 backdrop-blur-sm">
            <CardTitle className="text-xl font-bold text-center text-primary flex items-center justify-center gap-3 mb-2">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center shadow-lg">
                🚀
              </div>
              Pronto para o Desafio!
            </CardTitle>
            <p className="text-center text-primary/80 text-sm font-medium">
              Acompanhe seu progresso e estatísticas em tempo real
            </p>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-sm border-2 border-primary/30 rounded-xl p-4 hover:shadow-lg hover:scale-105 transition-all duration-300 shadow-md">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-primary/30 rounded-full flex items-center justify-center border-2 border-primary/40 shadow-inner">
                    <Timer className="w-5 h-5 text-primary" />
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-foreground">
                      {Math.floor((new Date().getTime() - startTime.getTime()) / 1000)}s
                    </div>
                    <div className="text-xs text-foreground/70 font-semibold uppercase tracking-wide">Tempo Total</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-sm border-2 border-primary/30 rounded-xl p-4 hover:shadow-lg hover:scale-105 transition-all duration-300 shadow-md">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-primary/30 rounded-full flex items-center justify-center border-2 border-primary/40 shadow-inner">
                    <Brain className="w-5 h-5 text-primary" />
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-bold text-foreground">
                      {getStageTitle(currentStage)}
                    </div>
                    <div className="text-xs text-foreground/70 font-semibold uppercase tracking-wide">Estágio Atual</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-sm border-2 border-primary/30 rounded-xl p-4 hover:shadow-lg hover:scale-105 transition-all duration-300 shadow-md">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-primary/30 rounded-full flex items-center justify-center border-2 border-primary/40 shadow-inner">
                    <span className="text-sm font-bold text-primary">
                      {Object.values(stageAttempts).reduce((a, b) => a + b, 0)}
                    </span>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-bold text-foreground">Tentativas</div>
                    <div className="text-xs text-foreground/70 font-semibold uppercase tracking-wide">Total</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};