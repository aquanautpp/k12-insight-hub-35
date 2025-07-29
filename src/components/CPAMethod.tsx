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

  const stages = {
    concrete: {
      title: "Estágio Concreto",
      description: "Aprendizagem através da manipulação física de objetos",
      icon: "🧱",
      problem: "Problema: 56 + 28. Represente com blocos.",
      solution: "Solução: Use 5 barras de dezena + 6 cubos unitários para 56. Adicione 2 barras de dezena + 8 cubos unitários para 28.",
      visualization: "Representação com blocos base 10: Dezenas e unidades organizadas fisicamente para compreensão tátil.",
      explanation: "No estágio concreto, manipulamos objetos físicos como blocos de base 10, cubos coloridos e materiais do cotidiano. Isso desenvolve a intuição numérica e torna conceitos abstratos tangíveis. O estudante literalmente 'sente' a matemática através do toque e movimento. 🔍 Dica: Procure objetos em casa como feijões, palitos ou brinquedos para praticar! Use lápis para representar dezenas e borrachas para unidades."
    },
    pictorial: {
      title: "Estágio Pictórico", 
      description: "Representação visual através de desenhos e diagramas",
      icon: "🎨",
      problem: "Problema: Ana tem 24 adesivos. Ela tem 8 a mais que Bruno. Quantos adesivos Bruno tem?",
      solution: "Solução: Use modelo de barras. Desenhe uma barra para Ana (24) e uma menor para Bruno, mostrando a diferença de 8.",
      visualization: "Modelo de barras (bar model): Representação visual que mostra relações matemáticas de forma intuitiva.",
      explanation: "O estágio pictórico serve como ponte entre concreto e abstrato. Aqui utilizamos diagramas, modelos de barras, desenhos esquemáticos e representações visuais. Esta etapa desenvolve a capacidade de visualização matemática e prepara para o pensamento simbólico."
    },
    abstract: {
      title: "Estágio Abstrato",
      description: "Uso de símbolos e operações matemáticas formais", 
      icon: "🔢",
      problem: "Problema: Resolva a equação: 4x + 6 = 26",
      solution: "Solução: 4x + 6 = 26 → 4x = 20 → x = 5",
      visualization: "Algoritmos e símbolos matemáticos: Notação formal para representar conceitos compreendidos.",
      explanation: "No estágio abstrato, trabalhamos com símbolos matemáticos, algoritmos e operações formais. Esta fase só é introduzida após sólida compreensão nos estágios anteriores, garantindo que os símbolos tenham significado conceitual para o estudante."
    }
  };

  const progressPercentage = (completedStages.length / 3) * 100;

  const handleStageComplete = () => {
    if (!completedStages.includes(currentStage)) {
      setCompletedStages([...completedStages, currentStage]);
    }
    
    // Avança para o próximo estágio
    if (currentStage === 'concrete') {
      setCurrentStage('pictorial');
    } else if (currentStage === 'pictorial') {
      setCurrentStage('abstract');
    }
  };

  const handleStageClick = (stage: Stage) => {
    setCurrentStage(stage);
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
                   <h3 className={`font-bold mb-2 ${isCompleted ? 'text-white' : 'text-green-700'}`}>
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

        {/* Current Stage Details */}
        <Card className="mb-8 shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <span className="text-3xl">{stages[currentStage].icon}</span>
              <div>
                <h2 className="text-2xl font-bold text-foreground">{stages[currentStage].title}</h2>
                <p className="text-muted-foreground">{stages[currentStage].description}</p>
              </div>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Exemplo Prático */}
            <div className="bg-gradient-subtle rounded-lg p-6">
              <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Exemplo Prático
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-foreground mb-2">Problema:</h4>
                  <p className="text-foreground">{stages[currentStage].problem}</p>
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-2">Solução:</h4>
                  <p className="text-foreground">{stages[currentStage].solution}</p>
                </div>
              </div>
            </div>

            {/* Visualização */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Representação Visual
              </h3>
              <p className="text-foreground">{stages[currentStage].visualization}</p>
            </div>

            {/* Explicação Detalhada */}
            <div className="bg-muted/50 rounded-lg p-6">
              <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <Brain className="w-5 h-5" />
                Por que este estágio é importante?
              </h3>
              <p className="text-foreground leading-relaxed">{stages[currentStage].explanation}</p>
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
                <div className="w-16 h-16 rounded-full bg-gradient-achievement flex items-center justify-center mx-auto mb-4">
                  <Brain className="w-8 h-8 text-primary" />
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