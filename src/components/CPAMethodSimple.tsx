import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Brain, Eye, Calculator, ArrowRight } from "lucide-react";

type Stage = 'concrete' | 'pictorial' | 'abstract';

const CPAMethodSimple = () => {
  const [currentStage, setCurrentStage] = useState<Stage>('concrete');
  const [completedStages, setCompletedStages] = useState<Stage[]>([]);

  const stages = {
    concrete: {
      title: "Estágio Concreto",
      description: "Use objetos físicos para entender conceitos",
      icon: "🧱",
      color: "bg-blue-500"
    },
    pictorial: {
      title: "Estágio Pictórico", 
      description: "Visualize através de imagens e diagramas",
      icon: "🎨",
      color: "bg-green-500"
    },
    abstract: {
      title: "Estágio Abstrato",
      description: "Trabalhe com símbolos e equações",
      icon: "🔢",
      color: "bg-purple-500"
    }
  };

  const progressPercentage = (completedStages.length / 3) * 100;

  const completeStage = (stage: Stage) => {
    if (!completedStages.includes(stage)) {
      setCompletedStages([...completedStages, stage]);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-4">
          Método CPA
        </h1>
        <p className="text-xl text-muted-foreground">
          Concrete • Pictorial • Abstract
        </p>
      </div>

      {/* Progress */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Seu Progresso</h2>
            <Badge variant="secondary">
              {completedStages.length}/3 estágios
            </Badge>
          </div>
          <Progress value={progressPercentage} className="h-3 mb-2" />
          <p className="text-sm text-muted-foreground">
            {progressPercentage === 100 ? 'Parabéns! Você completou todos os estágios!' :
             progressPercentage >= 66 ? 'Quase lá! Um último estágio!' :
             progressPercentage >= 33 ? 'Bom progresso! Continue!' :
             'Comece sua jornada CPA!'}
          </p>
        </CardContent>
      </Card>

      {/* Stages */}
      <div className="grid gap-6 md:grid-cols-3">
        {Object.entries(stages).map(([key, stage]) => {
          const stageKey = key as Stage;
          const isCompleted = completedStages.includes(stageKey);
          const isCurrent = currentStage === stageKey;
          
          return (
            <Card 
              key={key}
              className={`transition-all duration-300 cursor-pointer hover:shadow-lg ${
                isCurrent ? 'ring-2 ring-primary' : ''
              } ${isCompleted ? 'bg-primary/10' : ''}`}
              onClick={() => setCurrentStage(stageKey)}
            >
              <CardHeader className="text-center">
                <div className="text-4xl mb-2">{stage.icon}</div>
                <CardTitle className="text-lg">{stage.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-sm text-muted-foreground mb-4">
                  {stage.description}
                </p>
                
                {/* Simple Example */}
                <div className="bg-muted p-4 rounded-lg mb-4">
                  {stageKey === 'concrete' && (
                    <div>
                      <p className="font-medium mb-2">Exemplo: 5 + 3</p>
                      <p className="text-sm">🍎🍎🍎🍎🍎 + 🍎🍎🍎 = 8 maçãs</p>
                    </div>
                  )}
                  {stageKey === 'pictorial' && (
                    <div>
                      <p className="font-medium mb-2">Exemplo: 5 + 3</p>
                      <p className="text-sm">●●●●● + ●●● = 8</p>
                    </div>
                  )}
                  {stageKey === 'abstract' && (
                    <div>
                      <p className="font-medium mb-2">Exemplo: 5 + 3</p>
                      <p className="text-sm">5 + 3 = 8</p>
                    </div>
                  )}
                </div>

                <Button 
                  variant={isCompleted ? "secondary" : "default"}
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    completeStage(stageKey);
                  }}
                  className="w-full"
                >
                  {isCompleted ? 'Concluído ✓' : 'Praticar'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Current Stage Detail */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">{stages[currentStage].icon}</span>
            {stages[currentStage].title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            {stages[currentStage].description}
          </p>
          
          <div className="bg-muted p-6 rounded-lg">
            <h3 className="font-bold mb-4">Prática Interativa</h3>
            
            {currentStage === 'concrete' && (
              <div className="space-y-4">
                <p><strong>Problema:</strong> João tem 7 bolas. Ele perdeu 2. Quantas sobraram?</p>
                <div className="flex gap-2 text-2xl">
                  ⚽⚽⚽⚽⚽⚽⚽ → ⚽⚽⚽⚽⚽
                </div>
                <p><strong>Resposta:</strong> 5 bolas</p>
              </div>
            )}
            
            {currentStage === 'pictorial' && (
              <div className="space-y-4">
                <p><strong>Problema:</strong> Maria comprou 4 livros e ganhou 3. Quantos tem agora?</p>
                <div className="flex gap-2 text-lg">
                  📚📚📚📚 + 📚📚📚 = 📚📚📚📚📚📚📚
                </div>
                <p><strong>Resposta:</strong> 7 livros</p>
              </div>
            )}
            
            {currentStage === 'abstract' && (
              <div className="space-y-4">
                <p><strong>Problema:</strong> Se x + 5 = 12, qual o valor de x?</p>
                <div className="bg-white p-4 rounded border text-center">
                  <p>x + 5 = 12</p>
                  <p>x = 12 - 5</p>
                  <p>x = 7</p>
                </div>
                <p><strong>Resposta:</strong> x = 7</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CPAMethodSimple;