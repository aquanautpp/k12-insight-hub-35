import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { BookOpen, CheckCircle, PlayCircle, ArrowRight, Brain, Eye, Calculator } from "lucide-react";
import cpaMethodHero from "@/assets/cpa-method-hero.jpg";

type Stage = 'concrete' | 'pictorial' | 'abstract';

const CPAMethod = () => {
  const [currentStage, setCurrentStage] = useState<Stage>('concrete');
  const [completedStages, setCompletedStages] = useState<Stage[]>([]);
  const [currentExampleIndex, setCurrentExampleIndex] = useState(0);

  const stages = {
    concrete: {
      title: "Estágio Concreto",
      description: "Aprendizagem através da manipulação física de objetos",
      icon: "🧱",
      examples: [
        {
          problem: "Ana tem 5 maçãs. Ela deu 2 para seu irmão. Quantas maçãs sobraram?",
          solution: "5 - 2 = 3 maçãs",
          visualization: "🍎🍎🍎🍎🍎 → 🍎🍎🍎 (3 maçãs restantes)",
          explanation: "Use maçãs reais ou objetos físicos para contar e subtrair."
        },
        {
          problem: "João coletou 8 conchas na praia. Ele perdeu 3 no caminho. Quantas sobraram?",
          solution: "8 - 3 = 5 conchas",
          visualization: "🐚🐚🐚🐚🐚🐚🐚🐚 → 🐚🐚🐚🐚🐚 (5 conchas restantes)",
          explanation: "Manipule conchas reais para visualizar a subtração."
        },
        {
          problem: "Maria tem 6 lápis. Ela comprou mais 4. Quantos lápis ela tem agora?",
          solution: "6 + 4 = 10 lápis",
          visualization: "✏️✏️✏️✏️✏️✏️ + ✏️✏️✏️✏️ = 10 lápis",
          explanation: "Use lápis reais para somar e contar o total."
        },
        {
          problem: "Pedro dividiu 12 biscoitos igualmente entre 3 amigos. Quantos cada um recebeu?",
          solution: "12 ÷ 3 = 4 biscoitos",
          visualization: "🍪🍪🍪🍪 | 🍪🍪🍪🍪 | 🍪🍪🍪🍪 (4 para cada)",
          explanation: "Distribua biscoitos reais em grupos iguais."
        },
        {
          problem: "Uma caixa tem 15 bolas. Se tiramos 7 bolas, quantas ficam?",
          solution: "15 - 7 = 8 bolas",
          visualization: "⚽⚽⚽⚽⚽⚽⚽⚽⚽⚽⚽⚽⚽⚽⚽ → ⚽⚽⚽⚽⚽⚽⚽⚽ (8 bolas)",
          explanation: "Use bolas físicas para remover e contar o que sobra."
        }
      ]
    },
    pictorial: {
      title: "Estágio Pictórico", 
      description: "Representação visual através de desenhos e diagramas",
      icon: "🎨",
      examples: [
        {
          problem: "Em uma fazenda há 3 grupos de vacas. Cada grupo tem 4 vacas. Quantas vacas há no total?",
          solution: "3 × 4 = 12 vacas",
          visualization: "🐄🐄🐄🐄 🐄🐄🐄🐄 🐄🐄🐄🐄 = 12 vacas",
          explanation: "Desenhe grupos de vacas para visualizar a multiplicação."
        },
        {
          problem: "Uma pizza foi cortada em 8 fatias. Carlos comeu 3 fatias. Que fração da pizza sobrou?",
          solution: "5/8 da pizza sobrou",
          visualization: "🍕: ████████ → █████░░░ (5 fatias de 8)",
          explanation: "Desenhe uma pizza dividida em 8 partes e marque as partes restantes."
        },
        {
          problem: "Em um estacionamento há 5 fileiras com 6 carros cada. Quantos carros há no total?",
          solution: "5 × 6 = 30 carros",
          visualization: "🚗🚗🚗🚗🚗🚗\n🚗🚗🚗🚗🚗🚗\n🚗🚗🚗🚗🚗🚗\n🚗🚗🚗🚗🚗🚗\n🚗🚗🚗🚗🚗🚗",
          explanation: "Desenhe uma grade de carros organizados em fileiras."
        },
        {
          problem: "Ana tem 24 adesivos para distribuir igualmente em 4 páginas. Quantos adesivos por página?",
          solution: "24 ÷ 4 = 6 adesivos",
          visualization: "📄: ⭐⭐⭐⭐⭐⭐ | 📄: ⭐⭐⭐⭐⭐⭐ | 📄: ⭐⭐⭐⭐⭐⭐ | 📄: ⭐⭐⭐⭐⭐⭐",
          explanation: "Desenhe 4 páginas com 6 adesivos distribuídos igualmente."
        },
        {
          problem: "Um jardim retangular tem 8 metros de comprimento e 5 metros de largura. Qual é a área?",
          solution: "8 × 5 = 40 metros quadrados",
          visualization: "▦▦▦▦▦▦▦▦\n▦▦▦▦▦▦▦▦\n▦▦▦▦▦▦▦▦\n▦▦▦▦▦▦▦▦\n▦▦▦▦▦▦▦▦ (8×5 = 40)",
          explanation: "Desenhe um retângulo dividido em quadrados unitários."
        }
      ]
    },
    abstract: {
      title: "Estágio Abstrato",
      description: "Uso de símbolos e operações matemáticas formais", 
      icon: "🔢",
      examples: [
        {
          problem: "Resolva: 2x + 5 = 13",
          solution: "x = 4",
          visualization: "2x + 5 = 13 → 2x = 8 → x = 4",
          explanation: "Resolva algebricamente isolando a variável x."
        },
        {
          problem: "Calcule a área de um círculo com raio de 7 cm (π ≈ 3,14)",
          solution: "A = πr² = 3,14 × 7² = 153,86 cm²",
          visualization: "A = π × r² = 3,14 × 49 = 153,86",
          explanation: "Aplique a fórmula da área do círculo diretamente."
        },
        {
          problem: "Se f(x) = 3x - 7, calcule f(5)",
          solution: "f(5) = 3(5) - 7 = 15 - 7 = 8",
          visualization: "f(5) = 3(5) - 7 = 15 - 7 = 8",
          explanation: "Substitua x por 5 na função e calcule."
        },
        {
          problem: "Resolva o sistema: x + y = 10 e 2x - y = 5",
          solution: "x = 5, y = 5",
          visualization: "x + y = 10\n2x - y = 5\n→ 3x = 15 → x = 5, y = 5",
          explanation: "Use métodos algébricos como adição ou substituição."
        },
        {
          problem: "Calcule: lim(x→2) (x² - 4)/(x - 2)",
          solution: "= lim(x→2) (x + 2) = 4",
          visualization: "(x² - 4)/(x - 2) = (x+2)(x-2)/(x-2) = x + 2 → 4",
          explanation: "Simplifique a expressão e aplique o limite."
        }
      ]
    }
  };

  const progressPercentage = (completedStages.length / 3) * 100;
  const currentStageData = stages[currentStage];
  const currentExample = currentStageData.examples[currentExampleIndex];

  const handleStageComplete = () => {
    if (!completedStages.includes(currentStage)) {
      setCompletedStages([...completedStages, currentStage]);
    }
    
    if (currentStage === 'concrete') {
      setCurrentStage('pictorial');
      setCurrentExampleIndex(0);
    } else if (currentStage === 'pictorial') {
      setCurrentStage('abstract');
      setCurrentExampleIndex(0);
    }
  };

  const handleStageClick = (stage: Stage) => {
    setCurrentStage(stage);
    setCurrentExampleIndex(0);
  };

  const nextExample = () => {
    setCurrentExampleIndex((prev) => 
      prev < currentStageData.examples.length - 1 ? prev + 1 : 0
    );
  };

  const prevExample = () => {
    setCurrentExampleIndex((prev) => 
      prev > 0 ? prev - 1 : currentStageData.examples.length - 1
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto p-6">
        {/* Hero Section */}
        <div className="relative mb-8 rounded-2xl overflow-hidden shadow-card">
          <img 
            src={cpaMethodHero}
            alt="Método CPA - Concreto, Pictórico, Abstrato"
            className="w-full h-64 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/60 flex items-center">
            <div className="px-8">
              <h1 className="text-4xl font-bold text-white mb-4">
                Método CPA (Concreto-Pictórico-Abstrato)
              </h1>
              <p className="text-xl text-white/90 mb-4">
                Abordagem pedagógica comprovada do Sistema Educacional de Singapura
              </p>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-white">
                <p className="text-sm mb-2">
                  <strong>Como funciona:</strong> O método CPA guia o aprendizado através de três estágios sequenciais: 
                  manipulação física (Concreto), representações visuais (Pictórico) e símbolos matemáticos (Abstrato). 
                  Esta progressão garante compreensão profunda antes da abstração.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Indicator */}
        <Card className="mb-8 shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-foreground">Seu Progresso no Método CPA</h2>
              <Badge variant="secondary">{completedStages.length}/3 estágios concluídos</Badge>
            </div>
            <Progress value={progressPercentage} className="h-3 mb-2" />
            <p className="text-sm text-muted-foreground">
              Continue praticando cada estágio para dominar completamente o método CPA
            </p>
          </CardContent>
        </Card>

        {/* Stage Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {Object.entries(stages).map(([key, stage]) => {
            const stageKey = key as Stage;
            const isActive = currentStage === stageKey;
            const isCompleted = completedStages.includes(stageKey);
            
            return (
              <Card 
                key={key}
                className={`cursor-pointer transition-all duration-300 hover:shadow-learning ${
                  isActive ? 'ring-2 ring-primary shadow-learning' : ''
                } ${isCompleted ? 'bg-gradient-achievement' : ''}`}
                onClick={() => handleStageClick(stageKey)}
              >
                <CardContent className="p-6 text-center">
                  <div className="flex items-center justify-center mb-3">
                    <div className={`text-4xl mr-3 ${isCompleted ? 'animate-pulse' : ''}`}>
                      {stage.icon}
                    </div>
                    {isCompleted && <CheckCircle className="w-6 h-6 text-white" />}
                  </div>
                  <h3 className={`font-bold mb-2 ${isCompleted ? 'text-white' : 'text-foreground'}`}>
                    {stage.title}
                  </h3>
                  <p className={`text-sm ${isCompleted ? 'text-white/80' : 'text-muted-foreground'}`}>
                    {stage.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Current Stage Examples */}
        <Card className="mb-8 shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <span className="text-3xl">{currentStageData.icon}</span>
              <div>
                <h2 className="text-2xl font-bold text-foreground">{currentStageData.title}</h2>
                <p className="text-muted-foreground">{currentStageData.description}</p>
              </div>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Example Navigation */}
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">
                Exemplo {currentExampleIndex + 1} de {currentStageData.examples.length}
              </h3>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={prevExample}>
                  ←
                </Button>
                <Button variant="outline" size="sm" onClick={nextExample}>
                  →
                </Button>
              </div>
            </div>

            {/* Current Example */}
            <div className="bg-gradient-subtle rounded-lg p-6">
              <h4 className="text-lg font-semibold mb-4 text-foreground">
                {currentExample.problem}
              </h4>
              
              <div className="space-y-4">
                <div>
                  <h5 className="font-medium text-muted-foreground mb-2">Visualização:</h5>
                  <div className="bg-background p-4 rounded border font-mono text-center text-lg whitespace-pre-line">
                    {currentExample.visualization}
                  </div>
                </div>
                
                <div>
                  <h5 className="font-medium text-muted-foreground mb-2">Solução:</h5>
                  <p className="text-lg font-medium text-primary">{currentExample.solution}</p>
                </div>
                
                <div>
                  <h5 className="font-medium text-muted-foreground mb-2">Como fazer:</h5>
                  <p className="text-foreground">{currentExample.explanation}</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <Button 
                variant="learning" 
                onClick={handleStageComplete}
                className="flex items-center gap-2"
              >
                <PlayCircle className="w-4 h-4" />
                Praticar Este Estágio
              </Button>
              
              {currentStage !== 'abstract' && (
                <Button 
                  variant="outline" 
                  onClick={handleStageComplete}
                  className="flex items-center gap-2"
                >
                  <ArrowRight className="w-4 h-4" />
                  Próximo Estágio
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Benefits Section */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-foreground">
              Benefícios do Método CPA
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-learning flex items-center justify-center mx-auto mb-4">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Compreensão Profunda</h3>
                <p className="text-sm text-muted-foreground">
                  Desenvolve entendimento conceitual sólido antes da abstração matemática
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-achievement flex items-center justify-center mx-auto mb-4">
                  <Calculator className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Resolução de Problemas</h3>
                <p className="text-sm text-muted-foreground">
                  Ensina múltiplas estratégias para abordar desafios matemáticos complexos
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-focus flex items-center justify-center mx-auto mb-4">
                  <Eye className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Visualização</h3>
                <p className="text-sm text-muted-foreground">
                  Fortalece capacidade de representar e visualizar conceitos matemáticos
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CPAMethod;