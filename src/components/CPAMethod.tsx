import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { BookOpen, CheckCircle, PlayCircle, ArrowRight, Brain, Eye, Calculator, Sparkles } from "lucide-react";
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
        {/* Hero Section - Introdução ao Método CPA */}
        <div className="relative mb-8 rounded-2xl overflow-hidden shadow-card">
          <img 
            src={cpaMethodHero}
            alt="Método CPA - Concreto, Pictórico, Abstrato"
            className="w-full h-64 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/100 to-primary/90">
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
              <div className="bg-gradient-subtle rounded-lg p-4 border border-border">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">🧱</span>
                  <h3 className="text-lg font-bold text-primary">1. Concreto</h3>
                </div>
                <p className="text-sm text-foreground">
                  Você manipula objetos reais, como cubos, blocos ou fichas.
                </p>
              </div>

              <div className="bg-gradient-subtle rounded-lg p-4 border border-border">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">🎨</span>
                  <h3 className="text-lg font-bold text-primary">2. Pictórico</h3>
                </div>
                <p className="text-sm text-foreground">
                  Você vê desenhos e imagens, como os famosos modelos de barras.
                </p>
              </div>

              <div className="bg-gradient-subtle rounded-lg p-4 border border-border">
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
                <strong>🏆 SG Sucesso Internacional:</strong> Essa ideia veio de estudos sobre como aprendemos melhor. Singapura foi um dos primeiros países 
                a usar esse método em todas as escolas, e deu super certo: os alunos de lá estão entre 
                os melhores do mundo em matemática!
              </p>
            </div>

            <div className="optimized-practice-section">
              <div className="practice-header">
                <div className="practice-icon-wrapper">
                  <PlayCircle className="w-5 h-5 text-primary" />
                </div>
                <h3 className="practice-title">Como funciona na prática?</h3>
              </div>
              
              <p className="practice-description">
                Sempre que um novo conceito é ensinado, os professores começam com objetos, depois mostram 
                imagens e só então partem para a conta em si. Isso ajuda a entender de verdade, e não só decorar.
              </p>

              <div className="practice-subtitle">Por exemplo, para aprender frações:</div>

              <div className="practice-cards-grid">
                <div className="practice-card">
                  <div className="card-number">1</div>
                  <div className="card-icon">
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4 26L16 8L28 26H4Z" fill="#FF6B35" stroke="#D4500F" strokeWidth="2"/>
                      <path d="M10 20L16 14L22 20H10Z" fill="#FFE8A3"/>
                      <circle cx="16" cy="18" r="2" fill="#8B4513"/>
                    </svg>
                  </div>
                  <h5 className="card-title">Primeiro</h5>
                  <p className="card-description">Em vez de te dar uma fórmula sobre frações, você primeiro corta uma pizza de brinquedo.</p>
                </div>
                
                <div className="practice-card">
                  <div className="card-number">2</div>
                  <div className="card-icon">
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="4" y="8" width="24" height="2" fill="#2D3748" rx="1"/>
                      <rect x="4" y="12" width="20" height="2" fill="#2D3748" rx="1"/>
                      <rect x="4" y="16" width="22" height="2" fill="#2D3748" rx="1"/>
                      <rect x="4" y="20" width="18" height="2" fill="#2D3748" rx="1"/>
                      <circle cx="26" cy="6" r="4" fill="#FF6B35"/>
                    </svg>
                  </div>
                  <h5 className="card-title">Depois</h5>
                  <p className="card-description">Desenha as fatias no papel, visualizando as partes da pizza.</p>
                </div>
                
                <div className="practice-card">
                  <div className="card-number">3</div>
                  <div className="card-icon">
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="6" y="4" width="20" height="24" fill="#F7FAFC" stroke="#2D3748" strokeWidth="2" rx="2"/>
                      <text x="16" y="14" textAnchor="middle" fill="#2D3748" fontSize="8" fontWeight="600">1/2</text>
                      <text x="16" y="22" textAnchor="middle" fill="#2D3748" fontSize="8" fontWeight="600">+ 1/4</text>
                      <line x1="8" y1="16" x2="24" y2="16" stroke="#2D3748" strokeWidth="1"/>
                    </svg>
                  </div>
                  <h5 className="card-title">Por último</h5>
                  <p className="card-description">Só então faz a conta com números e símbolos matemáticos.</p>
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

        {/* Current Stage Details */}
        <Card className="mb-8 shadow-card sophisticated-reveal magnetic-hover">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <span className="text-3xl float-animation">{stages[currentStage].icon}</span>
              <div>
                <h2 className="text-2xl font-bold text-foreground elegant-text-reveal">{stages[currentStage].title}</h2>
                <p className="text-muted-foreground elegant-text-reveal">{stages[currentStage].description}</p>
              </div>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Exemplo Prático */}
            <div className="bg-gradient-subtle rounded-lg p-6 thoughtful-interaction">
              <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2 elegant-text-reveal">
                <BookOpen className="w-5 h-5" />
                Exemplo Prático
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="artistic-emphasis">
                  <h4 className="font-medium text-foreground mb-2">Problema:</h4>
                  <p className="text-foreground">{stages[currentStage].problem}</p>
                </div>
                <div className="artistic-emphasis">
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

      </div>
    </div>
  );
};

export default CPAMethod;