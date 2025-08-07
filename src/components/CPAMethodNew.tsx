import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { BookOpen, CheckCircle, PlayCircle, ArrowRight, Brain, Eye, Calculator, Users, Puzzle, Heart, Trophy, EyeOff } from "lucide-react";
import cpaMethodHero from "@/assets/cpa-method-hero.jpg";
import { CPAProblemDisplay } from "./CPAProblemDisplay";
import { CPAExplanationTooltip } from "./CPAExplanationTooltip";
import { useFeatureFlags } from "@/contexts/FeatureFlagsContext";
import { motion } from "framer-motion";
type Stage = 'concrete' | 'pictorial' | 'abstract';
const CPAMethod = () => {
  const [currentStage, setCurrentStage] = useState<Stage>('concrete');
  const [completedStages, setCompletedStages] = useState<Stage[]>([]);
  const [currentExampleIndex, setCurrentExampleIndex] = useState(0);
  const [showInteractiveChallenge, setShowInteractiveChallenge] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const {
    isEnabled
  } = useFeatureFlags();
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
  return <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto p-6">
        {/* Hero Section com Glassmorphism Avançado */}
        <motion.div initial={{
        opacity: 0,
        y: 30
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.8,
        ease: "easeOut"
      }} className="relative mb-8 rounded-2xl overflow-hidden">
          <div className="relative">
             {/* Fundo sólido com cor primária */}
             <div className="absolute inset-0 bg-primary"></div>
            
            {/* Mais Elementos Flutuantes Geométricos */}
            <div className="absolute inset-0 overflow-hidden">
              {[...Array(20)].map((_, i) => <motion.div key={i} className={`absolute ${i % 3 === 0 ? 'w-3 h-3 rounded-full bg-white/15' : i % 3 === 1 ? 'w-2 h-2 rotate-45 bg-white/20' : 'w-1 h-6 bg-white/10 rounded-full'}`} style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }} animate={{
              y: [0, -20, 0],
              x: [0, 10, 0],
              opacity: [0.1, 0.6, 0.1],
              rotate: i % 2 === 0 ? [0, 360, 0] : [360, 0, 360]
            }} transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 3,
              ease: "easeInOut"
            }} />)}
            </div>
            
            {/* Card Glassmorphism Premium */}
            <motion.div className="relative backdrop-blur-xl bg-white/15 border border-white/25 p-8 md:p-12 m-4 rounded-2xl shadow-2xl group" style={{
            background: "linear-gradient(145deg, rgba(255,255,255,0.15), rgba(255,255,255,0.05))",
            backdropFilter: "blur(15px)"
          }} whileHover={{
            y: -8,
            scale: 1.02,
            boxShadow: "0 30px 60px -12px rgba(0, 0, 0, 0.3), 0 0 30px rgba(255, 255, 255, 0.15)",
            borderColor: "rgba(255, 255, 255, 0.4)"
          }} transition={{
            duration: 0.4,
            ease: "easeOut"
          }}>
              {/* Brilho Dinâmico nas Bordas */}
              <motion.div style={{
              background: "linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent, rgba(255,255,255,0.1), transparent)",
              backgroundSize: "200% 200%"
            }} animate={{
              backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"]
            }} transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear"
            }} className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[#7d8e4d]/[0.72] rounded-2xl"></motion.div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-6 mb-8">
                  {/* Ícone com Pulsação Avançada - Tamanho Reduzido */}
                  <motion.div animate={{
                  scale: [1, 1.05, 1],
                  boxShadow: ["0 4px 20px rgba(255,255,255,0.1)", "0 8px 30px rgba(255,255,255,0.2)", "0 4px 20px rgba(255,255,255,0.1)"]
                }} transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }} whileHover={{
                  rotate: [0, 5, -5, 0],
                  scale: 1.1,
                  transition: {
                    duration: 0.5
                  }
                }} className="w-16 h-16 bg-white/20 flex items-center justify-center backdrop-blur-sm border border-white/30 shadow-lg rounded-lg">
                    <Brain className="w-8 h-8 text-white filter drop-shadow-lg" />
                  </motion.div>
                  
                  <div className="flex-1">
                    {/* Título com Efeito de Surgimento - Tamanho Reduzido */}
                    <motion.h1 initial={{
                    opacity: 0,
                    y: -20
                  }} animate={{
                    opacity: 1,
                    y: 0
                  }} transition={{
                    duration: 0.8,
                    delay: 0.3
                  }} style={{
                    textShadow: "0 4px 20px rgba(0,0,0,0.3), 0 0 20px rgba(255,255,255,0.1)"
                  }} className="text-3xl text-white mb-3 tracking-tight text-justify md:text-3xl font-semibold">Método CPA: a abordagem de matemática que colocou um país no topo do mundo</motion.h1>
                    
                    {/* Subtítulo com Animações Sequenciais Melhoradas */}
                    <div className="text-xl text-white/95 flex items-center gap-3 flex-wrap">
                      <motion.span initial={{
                      opacity: 0,
                      y: 15,
                      rotateX: -90
                    }} animate={{
                      opacity: 1,
                      y: 0,
                      rotateX: 0
                    }} transition={{
                      duration: 0.5,
                      delay: 0.6,
                      type: "spring"
                    }} className="font-semibold px-3 py-1 bg-white/10 rounded-lg backdrop-blur-sm border border-white/20 text-white">
                        Concreto
                      </motion.span>
                      
                      <motion.span initial={{
                      opacity: 0,
                      scale: 0,
                      rotate: -180
                    }} animate={{
                      opacity: 1,
                      scale: 1,
                      rotate: 0
                    }} transition={{
                      duration: 0.4,
                      delay: 0.9,
                      type: "spring",
                      stiffness: 200
                    }} className="text-white/80 text-2xl">
                        →
                      </motion.span>
                      
                      <motion.span initial={{
                      opacity: 0,
                      y: 15,
                      rotateX: -90
                    }} animate={{
                      opacity: 1,
                      y: 0,
                      rotateX: 0
                    }} transition={{
                      duration: 0.5,
                      delay: 1.1,
                      type: "spring"
                    }} className="font-semibold px-3 py-1 bg-white/10 rounded-lg backdrop-blur-sm border border-white/20">
                        Pictórico
                      </motion.span>
                      
                      <motion.span initial={{
                      opacity: 0,
                      scale: 0,
                      rotate: -180
                    }} animate={{
                      opacity: 1,
                      scale: 1,
                      rotate: 0
                    }} transition={{
                      duration: 0.4,
                      delay: 1.4,
                      type: "spring",
                      stiffness: 200
                    }} className="text-white/80 text-2xl">
                        →
                      </motion.span>
                      
                      <motion.span initial={{
                      opacity: 0,
                      y: 15,
                      rotateX: -90
                    }} animate={{
                      opacity: 1,
                      y: 0,
                      rotateX: 0
                    }} transition={{
                      duration: 0.5,
                      delay: 1.6,
                      type: "spring"
                    }} className="font-semibold px-3 py-1 bg-white/10 rounded-lg backdrop-blur-sm border border-white/20">
                        Abstrato
                      </motion.span>
                    </div>
                  </div>
                  
                  {isEnabled('cpaExplanationTooltip') && <CPAExplanationTooltip />}
                </div>
                
                {/* Descrição com Animação de Texto Avançada */}
                <motion.div initial={{
                opacity: 0,
                y: 30
              }} animate={{
                opacity: 1,
                y: 0
              }} transition={{
                duration: 0.8,
                delay: 0.7
              }} className="max-w-5xl">
                  <motion.p initial={{
                  opacity: 0
                }} animate={{
                  opacity: 1
                }} transition={{
                  duration: 1,
                  delay: 1
                }} style={{
                  textShadow: "0 2px 10px rgba(0,0,0,0.2)"
                }} className="leading-relaxed text-justify text-white font-normal text-xl">
                    Abordagem pedagógica comprovada do Sistema Educacional de Singapura que{" "}
                    <motion.span initial={{
                    opacity: 0.7
                  }} animate={{
                    opacity: [0.7, 1, 0.7]
                  }} transition={{
                    duration: 2,
                    repeat: Infinity
                  }} className="font-medium text-white">
                      revoluciona o ensino da matemática
                    </motion.span>
                    {" "}através de uma progressão natural e intuitiva.
                  </motion.p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* O que é o Método CPA - Com Animações Avançadas */}
        <motion.div initial={{
        opacity: 0,
        y: 50
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.8,
        delay: 0.3
      }}>
          <Card className="mb-4 shadow-2xl border-0 bg-gradient-to-br from-background via-background/95 to-background/90 backdrop-blur-sm">
            <CardContent className="p-4">
              <motion.h2 initial={{
              opacity: 0,
              y: -20
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              duration: 0.6,
              delay: 0.5
            }} className="text-3xl font-bold text-foreground mb-6 text-center">
                O que é o Método CPA?
              </motion.h2>
              
              <motion.p initial={{
              opacity: 0,
              y: 15
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              duration: 0.6,
              delay: 0.7
            }} className="text-lg text-muted-foreground mb-8 max-w-4xl mx-auto leading-relaxed text-justify">Você já se perguntou porque alguns países dominam as olimpíadas internacionais de matemática? O Método CPA, inspirado no modelo educacional de Singapura, é uma forma diferente (e muito mais legal!) de aprender matemática. Em vez de começar direto com números e fórmulas, você passa por três etapas:</motion.p>
              
              {/* Cards com Animações de Entrada Sequencial */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                {[{
                icon: "🧱",
                title: "1. Concreto",
                desc: "Você manipula objetos reais, como cubos, blocos ou fichas.",
                delay: 0.9,
                borderColor: "border-l-primary",
                glowColor: "hover:shadow-primary/20"
              }, {
                icon: "🎨",
                title: "2. Pictórico",
                desc: "Você vê desenhos e imagens, como os famosos modelos de barras.",
                delay: 1.1,
                borderColor: "border-l-primary/80",
                glowColor: "hover:shadow-primary/15"
              }, {
                icon: "🔢",
                title: "3. Abstrato",
                desc: "Só depois você usa números e símbolos, como fazemos em contas.",
                delay: 1.3,
                borderColor: "border-l-primary/60",
                glowColor: "hover:shadow-primary/10"
              }].map((item, index) => <motion.div key={index} initial={{
                opacity: 0,
                x: -50,
                rotateY: -20
              }} animate={{
                opacity: 1,
                x: 0,
                rotateY: 0
              }} transition={{
                duration: 0.7,
                delay: item.delay,
                type: "spring",
                stiffness: 100
              }} whileHover={{
                x: 15,
                scale: 1.05,
                rotateY: 5,
                transition: {
                  duration: 0.3
                }
              }} className={`group relative p-4 rounded-2xl bg-gradient-to-br from-card/50 to-card/80 border-l-4 ${item.borderColor} border border-primary/10 hover:border-primary/30 transition-all duration-500 hover:shadow-2xl ${item.glowColor} text-center backdrop-blur-sm`}>
                    {/* Glow Effect Background */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    <motion.div className="text-5xl mb-4 inline-block" whileHover={{
                  rotate: [0, -10, 10, -5, 0],
                  scale: [1, 1.2, 1]
                }} transition={{
                  duration: 0.5
                }}>
                      {item.icon}
                    </motion.div>
                    
                    <motion.h3 initial={{
                  opacity: 0
                }} animate={{
                  opacity: 1
                }} transition={{
                  delay: item.delay + 0.3
                }} className="text-xl font-bold text-foreground mb-3 relative z-10">
                      {item.title}
                    </motion.h3>
                    
                    <motion.p initial={{
                  opacity: 0
                }} animate={{
                  opacity: 1
                }} transition={{
                  delay: item.delay + 0.5
                }} className="text-muted-foreground leading-relaxed relative z-10">
                      {item.desc}
                    </motion.p>
                  </motion.div>)}
              </div>
              
              {/* Seção de Sucesso com Animação */}
              <motion.div initial={{
              opacity: 0,
              scale: 0.9
            }} animate={{
              opacity: 1,
              scale: 1
            }} transition={{
              duration: 0.6,
              delay: 1.5
            }} className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-2xl p-4 border border-primary/30 relative overflow-hidden">
                {/* Efeito de Brilho Animado */}
                <motion.div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent" animate={{
                x: ["-100%", "100%"]
              }} transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear"
              }}></motion.div>
                
                <motion.p initial={{
                opacity: 0,
                y: 10
              }} animate={{
                opacity: 1,
                y: 0
              }} transition={{
                delay: 1.7
              }} className="text-foreground text-center text-lg leading-relaxed relative z-10">
                  <motion.strong animate={{
                  color: ["hsl(var(--primary))", "hsl(var(--primary-foreground))", "hsl(var(--primary))"]
                }} transition={{
                  duration: 2,
                  repeat: Infinity
                }}>
                    🏆 Sucesso Internacional:
                  </motion.strong> Essa ideia veio de estudos sobre como aprendemos melhor. 
                  Singapura foi um dos primeiros países a usar esse método em todas as escolas, e deu super certo: 
                  os alunos de lá estão entre os melhores do mundo em matemática!
                </motion.p>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>


        {/* Por que isso funciona */}
        <Card className="mb-8 shadow-card">
          <CardContent className="p-8">
            <h2 className="text-3xl font-bold text-foreground mb-6 text-center">Por que isso funciona?</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="flex items-start gap-4 p-4 rounded-xl bg-gradient-soft border border-primary/20 transition-transform duration-200 hover:scale-105 hover:-translate-y-1">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Brain className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Compreensão Real</h4>
                  <p className="text-muted-foreground text-sm">Você entende melhor, em vez de só memorizar.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 p-4 rounded-xl bg-gradient-soft border border-primary/20 transition-transform duration-200 hover:scale-105 hover:-translate-y-1">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Puzzle className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Autonomia</h4>
                  <p className="text-muted-foreground text-sm">Aprende a resolver problemas sozinho, sem decorar fórmula.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 p-4 rounded-xl bg-gradient-soft border border-primary/20 transition-transform duration-200 hover:scale-105 hover:-translate-y-1">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Clareza</h4>
                  <p className="text-muted-foreground text-sm">Evita confusões porque cada passo tem sentido.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 p-4 rounded-xl bg-gradient-soft border border-primary/20 transition-transform duration-200 hover:scale-105 hover:-translate-y-1">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Trophy className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Confiança</h4>
                  <p className="text-muted-foreground text-sm">Fica mais confiante para usar a matemática no mundo real.</p>
                </div>
              </div>
            </div>
            
            <div className="bg-primary/10 rounded-lg p-6 border border-primary/30 text-center">
              <p className="text-foreground text-justify">
                <strong>🏆 Resultados Comprovados:</strong> O CPA é usado em Singapura há décadas — e os alunos de lá sempre estão no topo dos rankings internacionais. 
                Não é porque são gênios: é porque o método respeita o seu tempo de aprender e ajuda você a realmente pensar com a matemática, e não só repetir.
              </p>
            </div>
          </CardContent>
        </Card>

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
          return <Card key={key} className={`cursor-pointer transition-all duration-300 hover:shadow-learning rounded-xl ${isActive ? 'ring-2 ring-primary shadow-learning' : ''} ${isCompleted ? 'bg-gradient-achievement' : ''}`} onClick={() => handleStageClick(stageKey)}>
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
              </Card>;
        })}
        </div>

        {/* Problemas CPA */}
        <Card className="mb-8 shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <span className="text-3xl">{currentStageData.icon}</span>
              <div>
                <h2 className="text-2xl font-bold text-foreground">Problemas CPA - {currentStageData.title}</h2>
                <p className="text-muted-foreground">{currentStageData.description}</p>
              </div>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Stage Navigation */}
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">
                Resolva os problemas interativos
              </h3>
              {currentStage !== 'abstract' && <div className="flex justify-end">
                <Button variant="outline" onClick={handleStageComplete} className="flex items-center gap-2">
                  <ArrowRight className="w-4 h-4" />
                  Próximo Estágio
                </Button>
              </div>}
            </div>

            {/* CPA Problem Display */}
            <CPAProblemDisplay stage={currentStage} onComplete={handleStageComplete} />
          </CardContent>
        </Card>

        {/* Desafio Interativo Opcional */}
        {showInteractiveChallenge && 
          <Card className="mb-8 shadow-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl font-bold text-foreground">Desafio Extra Avançado</CardTitle>
                <Button variant="outline" onClick={() => setShowInteractiveChallenge(false)}>
                  Voltar aos Problemas
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">Experimente este desafio avançado que combina todos os estágios CPA:</p>
              <div className="bg-gradient-subtle rounded-lg p-6">
                <p className="text-center text-muted-foreground">Desafio avançado em desenvolvimento...</p>
              </div>
            </CardContent>
          </Card>
        }
        
        {!showInteractiveChallenge && (
          <>
            {/* Call to Action para Desafio Extra */}
            <Card className="shadow-card border-2 border-primary bg-gradient-soft rounded-2xl">
              <CardContent className="p-8 text-center">
                <h3 className="text-2xl font-bold mb-4 text-foreground">Desafio Extra Avançado</h3>
                <p className="text-lg mb-6 text-muted-foreground">
                  Já resolveu todos os problemas CPA? Experimente nosso desafio avançado 
                  que combina conceitos de todos os estágios!
                </p>
                <Button size="lg" variant="outline" onClick={() => setShowInteractiveChallenge(true)} className="flex items-center gap-2 text-primary border-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 shadow-lg">
                  <PlayCircle className="w-5 h-5" />
                  Desafio Avançado
                </Button>
              </CardContent>
            </Card>

            {/* Vantagens do Método CPA */}
            <Card className="shadow-card mt-8">
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-3xl font-bold text-foreground mb-2">
                  Por que o Método CPA é Revolucionário?
                </CardTitle>
                <p className="text-muted-foreground text-lg">
                  Descubra as vantagens comprovadas do método de Singapura
                </p>
              </CardHeader>
              <CardContent className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="group p-6 rounded-xl bg-gradient-soft border border-primary hover:border-primary transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                      <Brain className="w-6 h-6 text-primary" />
                    </div>
                    <h4 className="font-semibold text-foreground mb-3 text-lg">Compreensão Profunda</h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Garante que os alunos desenvolvam uma compreensão conceitual sólida antes de avançarem para a memorização de procedimentos.
                    </p>
                  </div>
                  
                  <div className="group p-6 rounded-xl bg-gradient-soft border border-primary hover:border-primary transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                      <Users className="w-6 h-6 text-primary" />
                    </div>
                    <h4 className="font-semibold text-foreground mb-3 text-lg">Acessibilidade</h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Torna a matemática mais acessível a uma gama mais ampla de alunos, contemplando diferentes estilos de aprendizagem.
                    </p>
                  </div>
                  
                  <div className="group p-6 rounded-xl bg-gradient-soft border border-primary hover:border-primary transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                      <Puzzle className="w-6 h-6 text-primary" />
                    </div>
                    <h4 className="font-semibold text-foreground mb-3 text-lg">Resolução de Problemas</h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Fortalece as habilidades de resolução de problemas, pois os alunos aprendem a modelar e visualizar situações antes de aplicar soluções abstratas.
                    </p>
                  </div>
                  
                  <div className="group p-6 rounded-xl bg-gradient-soft border border-primary hover:border-primary transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                      <Heart className="w-6 h-6 text-primary" />
                    </div>
                    <h4 className="font-semibold text-foreground mb-3 text-lg">Redução da Ansiedade</h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Ao construir confiança por meio de etapas tangíveis, o método CPA contribui para a redução da ansiedade em relação à matemática.
                    </p>
                  </div>
                  
                  <div className="group p-6 rounded-xl bg-gradient-soft border border-primary hover:border-primary transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                      <Trophy className="w-6 h-6 text-primary" />
                    </div>
                    <h4 className="font-semibold text-foreground mb-3 text-lg">Retenção a Longo Prazo</h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      A progressão lógica e a construção de significado resultam em uma retenção significativamente maior do conhecimento matemático.
                    </p>
                  </div>
                  
                  <div className="group p-6 rounded-xl bg-gradient-soft border border-primary hover:border-primary transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                      <CheckCircle className="w-6 h-6 text-primary" />
                    </div>
                    <h4 className="font-semibold text-foreground mb-3 text-lg">Resumo</h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      O método CPA de Singapura constrói o conhecimento matemático de forma incremental e significativa, promovendo uma compreensão duradoura e aplicável.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>;
};
export default CPAMethod;