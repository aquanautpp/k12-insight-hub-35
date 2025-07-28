import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Blocks, 
  Eye, 
  Calculator,
  ArrowRight,
  CheckCircle,
  Lightbulb,
  Target
} from "lucide-react";
import singaporeMethodHero from "@/assets/singapore-method-hero.jpg";

type Stage = 'concrete' | 'pictorial' | 'abstract';

const SingaporeMethod = () => {
  const [currentStage, setCurrentStage] = useState<Stage>('concrete');
  const [completedStages, setCompletedStages] = useState<Stage[]>([]);

  const stages = {
    concrete: {
      title: "Estágio Concreto",
      description: "Aprenda com objetos físicos e manipuláveis",
      icon: Blocks,
      color: "bg-secondary",
      problem: "Ana tem 8 maçãs. Ela deu 3 maçãs para seu irmão. Quantas maçãs ela tem agora?",
      solution: "Use blocos ou objetos físicos para representar as maçãs",
      visualization: "🍎🍎🍎🍎🍎🍎🍎🍎 → 🍎🍎🍎🍎🍎 (restaram 5)",
      explanation: "No estágio concreto, utilizamos objetos reais ou manipuláveis para compreender o conceito. Isso cria uma base sólida para a compreensão matemática."
    },
    pictorial: {
      title: "Estágio Pictórico", 
      description: "Visualize com diagramas e representações",
      icon: Eye,
      color: "bg-primary",
      problem: "Um ônibus tinha 24 passageiros. Na primeira parada, 9 passageiros desceram e 7 subiram.",
      solution: "Use o modelo de barras para representar visualmente",
      visualization: "▓▓▓▓▓▓▓▓▓ (desceram) + ▓▓▓▓▓▓▓ (subiram) = ?",
      explanation: "O estágio pictórico usa representações visuais como diagramas e modelos de barras. É a ponte entre o concreto e o abstrato."
    },
    abstract: {
      title: "Estágio Abstrato",
      description: "Domine símbolos e equações matemáticas", 
      icon: Calculator,
      color: "bg-accent",
      problem: "Se x + 15 = 32, qual é o valor de x?",
      solution: "Use símbolos matemáticos e álgebra",
      visualization: "x + 15 = 32 → x = 32 - 15 → x = 17",
      explanation: "No estágio abstrato, trabalhamos apenas com símbolos matemáticos, equações e algoritmos. É o nível mais alto de abstração matemática."
    }
  };

  const progressPercentage = (completedStages.length / 3) * 100;

  const handleStageComplete = () => {
    if (!completedStages.includes(currentStage)) {
      setCompletedStages([...completedStages, currentStage]);
    }
    
    // Move to next stage
    if (currentStage === 'concrete') setCurrentStage('pictorial');
    else if (currentStage === 'pictorial') setCurrentStage('abstract');
  };

  const currentStageData = stages[currentStage];
  const Icon = currentStageData.icon;

  return (
    <div className="p-6 space-y-6 bg-gradient-subtle min-h-screen">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="relative">
          <img 
            src={singaporeMethodHero} 
            alt="Singapore Method CPA Stages" 
            className="w-full h-64 object-cover rounded-xl shadow-learning"
          />
          <div className="absolute inset-0 bg-gradient-learning/10 rounded-xl"></div>
        </div>
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Método de Singapura</h1>
          <p className="text-lg text-muted-foreground">
            Concreto → Pictórico → Abstrato (CPA)
          </p>
          <div className="flex items-center justify-center mt-4">
            <div className="bg-white rounded-full px-6 py-2 shadow-card">
              <Progress value={progressPercentage} className="w-32 h-2" />
              <p className="text-sm text-center mt-1 text-muted-foreground">
                {completedStages.length}/3 estágios concluídos
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stage Navigation */}
      <div className="flex justify-center">
        <div className="flex items-center space-x-4 bg-white rounded-xl p-2 shadow-card">
          {Object.entries(stages).map(([key, stage], index) => {
            const StageIcon = stage.icon;
            const isActive = currentStage === key;
            const isCompleted = completedStages.includes(key as Stage);
            
            return (
              <div key={key} className="flex items-center">
                <Button
                  variant={isActive ? "learning" : isCompleted ? "achievement" : "outline"}
                  size="sm"
                  onClick={() => setCurrentStage(key as Stage)}
                  className="relative"
                >
                  {isCompleted && (
                    <CheckCircle className="w-4 h-4 absolute -top-1 -right-1 text-secondary" />
                  )}
                  <StageIcon className="w-4 h-4 mr-2" />
                  {stage.title.split(' ')[1]}
                </Button>
                {index < 2 && (
                  <ArrowRight className="w-4 h-4 text-muted-foreground mx-2" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Current Stage Content */}
      <Card className="p-8 shadow-learning border border-primary/10">
        <div className="flex items-center mb-6">
          <div className={`w-16 h-16 rounded-2xl ${currentStageData.color} flex items-center justify-center mr-4 shadow-lg`}>
            <Icon className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">{currentStageData.title}</h2>
            <p className="text-muted-foreground">{currentStageData.description}</p>
          </div>
        </div>

        {/* Problem Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-gradient-focus rounded-lg p-6 border border-primary/20">
              <div className="flex items-center mb-3">
                <Target className="w-5 h-5 text-primary mr-2" />
                <h3 className="font-semibold text-primary">Problema Exemplo</h3>
              </div>
              <p className="text-foreground mb-4">{currentStageData.problem}</p>
              <Badge variant="outline" className="text-xs">
                Nível {currentStage === 'concrete' ? 'Iniciante' : currentStage === 'pictorial' ? 'Intermediário' : 'Avançado'}
              </Badge>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-card">
              <div className="flex items-center mb-3">
                <Lightbulb className="w-5 h-5 text-accent mr-2" />
                <h3 className="font-semibold text-foreground">Como Resolver</h3>
              </div>
              <p className="text-muted-foreground mb-3">{currentStageData.solution}</p>
              <div className="bg-muted rounded-lg p-4 font-mono text-sm">
                {currentStageData.visualization}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gradient-achievement rounded-lg p-6 text-white">
              <h3 className="font-semibold mb-3 flex items-center">
                <Eye className="w-5 h-5 mr-2" />
                Explicação Pedagógica
              </h3>
              <p className="text-white/90 leading-relaxed">
                {currentStageData.explanation}
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <Button 
                variant="learning" 
                size="lg" 
                onClick={handleStageComplete}
                disabled={completedStages.includes(currentStage)}
                className="w-full"
              >
                {completedStages.includes(currentStage) ? (
                  <>
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Estágio Concluído
                  </>
                ) : (
                  <>
                    <Target className="w-5 h-5 mr-2" />
                    Praticar Este Estágio
                  </>
                )}
              </Button>
              
              {currentStage !== 'abstract' && (
                <Button variant="outline" className="w-full">
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Próximo Estágio
                </Button>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Benefits Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 text-center bg-gradient-learning text-white">
          <Blocks className="w-8 h-8 mx-auto mb-3" />
          <h3 className="font-semibold mb-2">Base Sólida</h3>
          <p className="text-sm text-white/80">Compreensão profunda através da experiência concreta</p>
        </Card>
        
        <Card className="p-6 text-center bg-gradient-focus text-primary border border-primary/20">
          <Eye className="w-8 h-8 mx-auto mb-3" />
          <h3 className="font-semibold mb-2">Visualização</h3>
          <p className="text-sm text-primary/70">Ponte entre concreto e abstrato com representações visuais</p>
        </Card>
        
        <Card className="p-6 text-center bg-gradient-achievement text-white">
          <Calculator className="w-8 h-8 mx-auto mb-3" />
          <h3 className="font-semibold mb-2">Domínio</h3>
          <p className="text-sm text-white/80">Fluência matemática com símbolos e algoritmos</p>
        </Card>
      </div>
    </div>
  );
};

export default SingaporeMethod;