import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { BookOpen, CheckCircle, PlayCircle, ArrowRight, Brain } from "lucide-react";
import { CPAProblemDisplay } from "./CPAProblemDisplay";
import { CPAExplanationTooltip } from "./CPAExplanationTooltip";
import { CPAIntegratedChallenge } from "./CPA/CPAIntegratedChallenge";
import { useFeatureFlags } from "@/contexts/FeatureFlagsContext";
import { toast } from "sonner";

type Stage = 'concrete' | 'pictorial' | 'abstract';

const CPAMethod = () => {
  const [currentStage, setCurrentStage] = useState<Stage>('concrete');
  const [completedStages, setCompletedStages] = useState<Stage[]>([]);
  const [currentExampleIndex, setCurrentExampleIndex] = useState(0);
  const [showInteractiveChallenge, setShowInteractiveChallenge] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  
  const { isEnabled } = useFeatureFlags();
  
  const stages = {
    concrete: {
      title: "Estágio Concreto",
      description: "Aprendizagem através da manipulação física de objetos",
      icon: "🧱"
    },
    pictorial: {
      title: "Estágio Pictórico", 
      description: "Representação visual através de desenhos e diagramas",
      icon: "🎨"
    },
    abstract: {
      title: "Estágio Abstrato",
      description: "Uso de símbolos e operações matemáticas formais",
      icon: "🔢"
    }
  };

  const progressPercentage = completedStages.length / 3 * 100;
  const currentStageData = stages[currentStage];

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

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto">
        {/* Hero Section - Faixa colorida discreta no topo */}
        <div className="bg-primary py-12 mb-24">
          <div className="px-6">
            <div className="flex items-center gap-4 mb-6">
              <Brain className="w-8 h-8 text-white" />
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                Método CPA: a abordagem de matemática que colocou um país no topo do mundo
              </h1>
            </div>
            
            <div className="flex items-center gap-4 text-white/90 mb-6">
              <span className="px-3 py-1 bg-white/20 rounded">Concreto</span>
              <ArrowRight className="w-4 h-4" />
              <span className="px-3 py-1 bg-white/20 rounded">Pictórico</span>
              <ArrowRight className="w-4 h-4" />
              <span className="px-3 py-1 bg-white/20 rounded">Abstrato</span>
            </div>
            
            <p className="text-white/95 text-lg leading-relaxed max-w-4xl">
              Abordagem pedagógica comprovada do Sistema Educacional de Singapura que revolutiona o ensino da matemática através de uma progressão natural e intuitiva.
            </p>
          </div>
        </div>

        {/* O que é o Método CPA */}
        <div className="px-6 mb-24">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
            O que é o Método CPA?
          </h2>
          
          <p className="text-lg text-muted-foreground mb-16 max-w-4xl mx-auto leading-relaxed text-center">
            Você já se perguntou porque alguns países dominam as olimpíadas internacionais de matemática? O Método CPA, inspirado no modelo educacional de Singapura, é uma forma diferente (e muito mais legal!) de aprender matemática. Em vez de começar direto com números e fórmulas, você passa por três etapas:
          </p>
          
          {/* Cards dos estágios - Design limpo */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
            {[{
              icon: "🧱",
              title: "1. Concreto",
              desc: "Você manipula objetos reais, como cubos, blocos ou fichas."
            }, {
              icon: "🎨",
              title: "2. Pictórico", 
              desc: "Você vê desenhos e imagens, como os famosos modelos de barras."
            }, {
              icon: "🔢",
              title: "3. Abstrato",
              desc: "Só depois você usa números e símbolos, como fazemos em contas."
            }].map((item, index) => (
              <div key={index} className="text-center p-6 border-b border-gray-200">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold text-foreground mb-3">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
          
          {/* Seção de Sucesso - Design minimalista */}
          <div className="text-center p-6 border border-gray-200 rounded-lg bg-gray-50/50">
            <p className="text-foreground leading-relaxed text-lg">
              <strong className="text-primary">🏆 Resultados Comprovados:</strong> O CPA é usado em Singapura há décadas — e os alunos de lá sempre estão no topo dos rankings internacionais. 
              Não é porque são gênios: é porque o método respeita o seu tempo de aprender e ajuda você a realmente pensar com a matemática, e não só repetir.
            </p>
          </div>
        </div>

        {/* Progress Indicator - Design clean */}
        <div className="px-6 mb-16">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-foreground">Seu Progresso no Método CPA</h2>
            <Badge variant="secondary" className="text-sm">{completedStages.length}/3 estágios concluídos</Badge>
          </div>
          <Progress value={progressPercentage} className="h-2 mb-2" />
          <p className="text-sm text-muted-foreground">
            Continue praticando cada estágio para dominar completamente o método CPA
          </p>
        </div>

        {/* Stage Navigation - Cards padronizados */}
        <div className="px-6 mb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.entries(stages).map(([key, stage]) => {
              const stageKey = key as Stage;
              const isActive = currentStage === stageKey;
              const isCompleted = completedStages.includes(stageKey);
              
              return (
                <div 
                  key={key} 
                  className={`cursor-pointer p-6 border border-gray-200 rounded-lg text-center transition-all duration-200 hover:border-primary/50 hover:shadow-sm ${
                    isActive ? 'border-primary bg-primary/5' : ''
                  } ${isCompleted ? 'bg-primary/10' : ''}`}
                  onClick={() => handleStageClick(stageKey)}
                >
                  <div className="flex items-center justify-center mb-3">
                    <div className="text-3xl mr-2">{stage.icon}</div>
                    {isCompleted && <CheckCircle className="w-5 h-5 text-primary" />}
                  </div>
                  <h3 className="font-bold mb-2 text-foreground text-lg">{stage.title}</h3>
                  <p className="text-sm text-muted-foreground">{stage.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Problemas CPA - Design limpo */}
        <div className="px-6 mb-16">
          <div className="border border-gray-200 rounded-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl">{currentStageData.icon}</span>
              <div>
                <h2 className="text-2xl font-bold text-foreground">Problemas CPA - {currentStageData.title}</h2>
                <p className="text-muted-foreground">{currentStageData.description}</p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-foreground">
                  Resolva os problemas interativos
                </h3>
                {currentStage !== 'abstract' && (
                  <Button 
                    variant="outline" 
                    onClick={handleStageComplete} 
                    className="flex items-center gap-2 border-primary text-primary hover:bg-primary hover:text-white"
                  >
                    <ArrowRight className="w-4 h-4" />
                    Próximo Estágio
                  </Button>
                )}
              </div>

              <CPAProblemDisplay stage={currentStage} onComplete={handleStageComplete} />
            </div>
          </div>
        </div>

        {/* Desafio Interativo */}
        {showInteractiveChallenge ? (
          <div className="px-6 mb-16">
            <div className="border border-gray-200 rounded-lg p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-foreground">Desafio Interativo</h2>
                <Button 
                  variant="outline" 
                  onClick={() => setShowInteractiveChallenge(false)}
                  className="border-gray-300"
                >
                  Voltar aos Problemas
                </Button>
              </div>
              <p className="text-muted-foreground mb-4">Experimente este desafio avançado que combina todos os estágios CPA:</p>
              <CPAIntegratedChallenge 
                stage="concrete" 
                onComplete={(challenge) => {
                  toast("🎉 Parabéns! Você completou o desafio integrado CPA!");
                }} 
              />
            </div>
          </div>
        ) : (
          <>
            {/* Botão Desafio Interativo - Design simples */}
            <div className="px-6 mb-16">
              <div className="text-center p-12 border border-gray-200 rounded-lg">
                <h3 className="text-2xl font-bold text-foreground mb-4 flex items-center justify-center gap-3">
                  <span>🧩</span>
                  Desafios Interativos
                </h3>
                <p className="text-muted-foreground mb-8 max-w-2xl mx-auto text-lg">
                  Já resolveu todos os problemas CPA? Experimente nossos desafios interativos que combinam conceitos de <span className="text-primary font-semibold">todos os estágios</span>!
                </p>
                <Button 
                  size="lg" 
                  onClick={() => setShowInteractiveChallenge(true)}
                  className="bg-primary text-white hover:bg-primary/90 px-8 py-3 font-semibold"
                >
                  <PlayCircle className="w-5 h-5 mr-2" />
                  Desafio Interativo
                </Button>
              </div>
            </div>

            {/* Vantagens do Método CPA - Cards padronizados */}
            <div className="px-6 mb-16">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-foreground mb-4">
                  Por que o Método CPA é Revolucionário?
                </h2>
                <p className="text-muted-foreground text-lg">
                  Descubra as vantagens comprovadas do método de Singapura
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    icon: Brain,
                    title: "Compreensão Profunda",
                    desc: "Garante que os alunos desenvolvam uma compreensão conceitual sólida antes de avançarem para a memorização de procedimentos."
                  },
                  {
                    icon: BookOpen,
                    title: "Acessibilidade", 
                    desc: "Torna a matemática mais acessível a uma gama mais ampla de alunos, contemplando diferentes estilos de aprendizagem."
                  },
                  {
                    icon: CheckCircle,
                    title: "Resolução de Problemas",
                    desc: "Fortalece as habilidades de resolução de problemas, pois os alunos aprendem a modelar e visualizar situações antes de aplicar soluções abstratas."
                  }
                ].map((item, index) => (
                  <div key={index} className="p-6 border border-gray-200 rounded-lg hover:border-primary/50 transition-colors">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <item.icon className="w-5 h-5 text-primary" />
                    </div>
                    <h4 className="font-semibold text-foreground mb-3 text-lg">{item.title}</h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CPAMethod;