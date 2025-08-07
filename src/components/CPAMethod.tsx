import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { BookOpen, CheckCircle, PlayCircle, ArrowRight, Brain, Eye, Calculator, Sparkles, Pizza, Edit3, FileText } from "lucide-react";
import cpaMethodHero from "@/assets/cpa-method-hero.jpg";
import { CPAProblemDisplay } from "./CPAProblemDisplay";
import MathText from "./MathText";

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
      solution: "Solução: $4x + 6 = 26 \\rightarrow 4x = 20 \\rightarrow x = 5$",
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
        {/* Hero Section - Introdução ao Método CPA */}
        <div className="relative mb-8 rounded-2xl overflow-hidden shadow-card">
          <img 
            src={cpaMethodHero}
            alt="Método CPA - Concreto, Pictórico, Abstrato"
            className="w-full h-64 object-cover"
          />
          <div className="absolute inset-0 bg-primary/90">
            <div className="px-8 py-6 h-full flex items-center">
              <div className="w-full">
                <h1 className="text-4xl font-bold text-white mb-4">
                  🎯 Método CPA: Aprenda Matemática de Verdade!
                </h1>
                <p className="text-lg text-white/95 mb-6">
                  O segredo educacional de Singapura chegou até você - prepare-se para uma revolução no seu aprendizado!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* O que é o Método CPA */}
        <Card className="mb-8 shadow-card transform scale-90">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-3">
              <Brain className="w-6 h-6 text-primary" />
              O que é o Método CPA?
            </h2>
            
            <p className="text-base text-foreground mb-4 leading-relaxed">
              O Método CPA é uma forma diferente (e muito mais legal!) de aprender matemática. 
              Em vez de começar direto com números e fórmulas, você passa por três etapas:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-card rounded-lg p-4 border border-border">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">🧱</span>
                  <h3 className="text-lg font-bold text-primary">1. Concreto</h3>
                </div>
                <p className="text-sm text-foreground">
                  Você manipula objetos reais, como cubos, blocos ou fichas.
                </p>
              </div>

              <div className="bg-card rounded-lg p-4 border border-border">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">🎨</span>
                  <h3 className="text-lg font-bold text-primary">2. Pictórico</h3>
                </div>
                <p className="text-sm text-foreground">
                  Você vê desenhos e imagens, como os famosos modelos de barras.
                </p>
              </div>

              <div className="bg-card rounded-lg p-4 border border-border">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">🔢</span>
                  <h3 className="text-lg font-bold text-primary">3. Abstrato</h3>
                </div>
                <p className="text-sm text-foreground">
                  Só depois você usa números e símbolos, como fazemos em contas.
                </p>
              </div>
            </div>

            <div className="bg-muted/50 rounded-lg p-4 mb-4">
              <p className="text-sm text-foreground leading-relaxed">
                <strong>🏆 Sucesso Internacional:</strong> Essa ideia veio de estudos sobre como aprendemos melhor. Singapura foi um dos primeiros países 
                a usar esse método em todas as escolas, e deu super certo: os alunos de lá estão entre 
                os melhores do mundo em matemática!
              </p>
            </div>

            <div className="practice-section bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl p-4 border border-primary/20">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <PlayCircle className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">Como funciona na prática?</h3>
              </div>
              
              <p className="text-foreground mb-4 text-sm leading-relaxed opacity-90">
                Sempre que um novo conceito é ensinado, os professores começam com objetos, depois mostram 
                imagens e só então partem para a conta em si. Isso ajuda a entender de verdade, e não só decorar.
              </p>

              <div className="interactive-example bg-white/70 backdrop-blur-sm rounded-lg p-4 border border-primary/30 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-primary">Exemplo: Aprender Frações</span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-white rounded-lg p-3 border border-primary/20 hover:border-primary/40 transition-all duration-200 hover:scale-105 cursor-pointer shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white text-xs font-bold">1</div>
                      <Pizza className="w-4 h-4 text-orange-600" />
                    </div>
                    <h5 className="text-sm font-semibold text-foreground mb-1">Concreto</h5>
                    <p className="text-xs text-muted-foreground">Corta uma pizza real</p>
                  </div>
                  
                  <div className="bg-white rounded-lg p-3 border border-primary/20 hover:border-primary/40 transition-all duration-200 hover:scale-105 cursor-pointer shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">2</div>
                      <Edit3 className="w-4 h-4 text-blue-600" />
                    </div>
                    <h5 className="text-sm font-semibold text-foreground mb-1">Pictórico</h5>
                    <p className="text-xs text-muted-foreground">Desenha as fatias</p>
                  </div>
                  
                  <div className="bg-white rounded-lg p-3 border border-primary/20 hover:border-primary/40 transition-all duration-200 hover:scale-105 cursor-pointer shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">3</div>
                      <FileText className="w-4 h-4 text-purple-600" />
                    </div>
                    <h5 className="text-sm font-semibold text-foreground mb-1">Abstrato</h5>
                    <p className="text-xs text-muted-foreground">Escreve 1/4, 2/4...</p>
                  </div>
                </div>
              </div>
            </div>

            <h3 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-primary" />
              Por que isso funciona?
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                <span className="text-foreground">Você entende melhor, em vez de só memorizar.</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                <span className="text-foreground">Aprende a resolver problemas sozinho, sem decorar fórmula.</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                <span className="text-foreground">Evita confusões porque cada passo tem sentido.</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                <span className="text-foreground">Fica mais confiante para usar a matemática no mundo real.</span>
              </div>
            </div>

            <div className="bg-gradient-achievement rounded-lg p-6 text-white">
              <h4 className="font-bold mb-3 flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                O Segredo do Sucesso de Singapura
              </h4>
              <p className="leading-relaxed">
                O CPA é usado em Singapura há décadas — e os alunos de lá sempre estão no topo dos rankings 
                internacionais. Não é porque são gênios: é porque o método respeita o seu tempo de aprender 
                e ajuda você a realmente <strong>pensar com a matemática</strong>, e não só repetir.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Progress Indicator */}
        <Card className="mb-8 shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-foreground">🎯 Sua Jornada de Maestria CPA</h2>
              <Badge variant="secondary" className="animate-pulse">{completedStages.length}/3 estágios dominados</Badge>
            </div>
            <Progress value={progressPercentage} className="h-3 mb-2 animate-scale-in" />
            <p className="text-sm text-muted-foreground">
              {progressPercentage === 100 ? '🏆 Parabéns! Você dominou completamente o método CPA!' :
               progressPercentage >= 66 ? '🚀 Quase lá! Finalize sua jornada épica!' :
               progressPercentage >= 33 ? '💪 Excelente progresso! Continue assim!' :
               '🌱 Sua aventura está começando - cada passo te aproxima da maestria!'}
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
                className={`cursor-pointer transition-all duration-300 magnetic-hover thoughtful-interaction ${
                  isActive ? 'ring-2 ring-primary shadow-learning artistic-emphasis' : ''
                } ${isCompleted ? 'premium-gradient-morph' : ''}`}
                onClick={() => handleStageClick(stageKey)}
              >
                <CardContent className="p-6 text-center sophisticated-reveal">
                  <div className="flex items-center justify-center mb-3">
                    <div className={`text-4xl mr-3 ${isCompleted ? 'float-animation' : ''} ${isActive ? 'human-touch' : ''}`}>
                      {stage.icon}
                    </div>
                    {isCompleted && (
                      <div className="relative">
                        <CheckCircle className="w-6 h-6 text-white" />
                        <Sparkles className="w-4 h-4 text-yellow-300 absolute -top-1 -right-1 animate-pulse" />
                      </div>
                    )}
                  </div>
                   <h3 className={`font-bold mb-2 elegant-text-reveal ${isCompleted ? 'text-white' : 'text-green-700'}`}>
                      {stage.title}
                    </h3>
                  <p className={`text-sm digital-maker-glow ${isCompleted ? 'text-white/80' : 'text-muted-foreground'}`}>
                    {stage.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Problemas CPA Interativos */}
        <Card className="mb-8 shadow-card sophisticated-reveal magnetic-hover">
          <CardContent className="p-0">
            <CPAProblemDisplay 
              stage={currentStage}
              onComplete={(problem) => {
                if (!completedStages.includes(currentStage)) {
                  setCompletedStages([...completedStages, currentStage]);
                }
              }}
            />
          </CardContent>
        </Card>

        {/* Explicação do Estágio */}
        <Card className="mb-8 shadow-card">
          <CardContent className="p-6">
            <div className="bg-muted/50 rounded-lg p-6">
              <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <Brain className="w-5 h-5" />
                Por que este estágio é importante?
              </h3>
              <p className="text-foreground leading-relaxed">{stages[currentStage].explanation}</p>
            </div>

          </CardContent>
        </Card>

      </div>
    </div>
  );
};

export default CPAMethod;