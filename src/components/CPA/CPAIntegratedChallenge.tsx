import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, ArrowLeft, RotateCcw, Brain, Timer } from "lucide-react";
import { EnhancedVirtualTenBlocks } from "./EnhancedVirtualTenBlocks";
import { AdvancedBarModelEditor } from "./AdvancedBarModelEditor";
import { InteractiveEquationEditor } from "./InteractiveEquationEditor";

type CPAStage = 'concrete' | 'pictorial' | 'abstract';

interface CPAChallenge {
  id: string;
  title: string;
  stage: 'concrete' | 'pictorial' | 'abstract';
  enunciado: string;
  visualizacao: string;
  educatorInstruction: string;
  expectedAnswer: string;
}

// Problemas CPA seguindo o Método de Singapura
const cpaProblems: CPAChallenge[] = [
  // Estágio Concreto
  {
    id: "concrete-1",
    title: "As Maçãs do Pomar",
    stage: "concrete",
    enunciado: "No pomar da Vovó, havia 7 maçãs maduras em uma cesta. Depois que os netos brincaram, algumas maçãs foram colhidas e adicionadas à cesta, e agora há um total de 12 maçãs. Quantas maçãs os netos colheram?",
    visualizacao: "🍎🍎🍎🍎🍎🍎🍎 (maçãs iniciais)",
    educatorInstruction: "Peça ao aluno para usar 7 objetos físicos (maçãs de brinquedo, blocos, etc.) para representar as maçãs iniciais. Em seguida, instrua-o a adicionar mais objetos até atingir um total de 12, contando quantos objetos foram adicionados para encontrar a resposta. Reforce o conceito de adição e a relação entre parte-todo.",
    expectedAnswer: "5"
  },
  {
    id: "concrete-2", 
    title: "Os Brinquedos Perdidos",
    stage: "concrete",
    enunciado: "Lucas tinha 10 carrinhos de brinquedo. Ao arrumar seu quarto, ele percebeu que alguns carrinhos estavam faltando. Se ele encontrou apenas 6 carrinhos, quantos carrinhos ainda estão escondidos?",
    visualizacao: "🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗 (carrinhos iniciais)",
    educatorInstruction: "Forneça 10 objetos físicos (carrinhos de brinquedo, cubos, etc.) ao aluno. Peça para ele remover 6 objetos e, então, contar quantos restaram para simular os carrinhos perdidos. Discuta a ideia de subtração como 'tirar' ou 'encontrar a diferença'.",
    expectedAnswer: "4"
  },
  {
    id: "concrete-3",
    title: "Os Lápis Coloridos", 
    stage: "concrete",
    enunciado: "Na caixa de lápis de cor de Ana, havia 8 lápis. Para um novo desenho, ela pegou mais alguns lápis de outra caixa, e agora ela tem 14 lápis no total. Quantos lápis Ana pegou da outra caixa?",
    visualizacao: "✏️✏️✏️✏️✏️✏️✏️✏️ (lápis iniciais)",
    educatorInstruction: "Utilize 8 lápis reais ou objetos similares para representar a quantidade inicial. Peça ao aluno para adicionar mais lápis, um por um, até que o total seja 14. O aluno deve contar quantos lápis foram adicionados para chegar à resposta. Enfatize a relação entre adição e a busca pelo número desconhecido.",
    expectedAnswer: "6"
  },
  {
    id: "concrete-4",
    title: "Os Biscoitos da Festa",
    stage: "concrete", 
    enunciado: "Para a festa de aniversário, mamãe assou 15 biscoitos e quer distribuí-los igualmente em 3 pratos. Quantos biscoitos cada prato terá?",
    visualizacao: "🍪🍪🍪🍪🍪🍪🍪🍪🍪🍪🍪🍪🍪🍪🍪 (biscoitos)",
    educatorInstruction: "Providencie 15 biscoitos de brinquedo ou fichas e 3 pratos. Oriente o aluno a distribuir um biscoito por vez em cada prato, de forma alternada, até que todos os biscoitos sejam distribuídos. Em seguida, peça para contar quantos biscoitos há em cada prato. Isso reforça o conceito de divisão como distribuição equitativa.",
    expectedAnswer: "5"
  },
  {
    id: "concrete-5",
    title: "As Bolas da Cesta",
    stage: "concrete",
    enunciado: "Em uma cesta, havia algumas bolas. Pedro tirou 5 bolas para brincar, e agora restam 9 bolas na cesta. Quantas bolas havia na cesta antes de Pedro tirar algumas?",
    visualizacao: "⚽⚽⚽⚽⚽ (bolas que Pedro tirou) + ⚽⚽⚽⚽⚽⚽⚽⚽⚽ (bolas restantes)",
    educatorInstruction: "Peça ao aluno para usar 9 objetos para representar as bolas restantes e 5 objetos para representar as bolas que Pedro tirou. Em seguida, instrua-o a juntar todos os objetos e contar o total para descobrir a quantidade inicial. Este exercício ajuda a compreender a relação inversa entre adição e subtração.",
    expectedAnswer: "14"
  },
  // Estágio Pictórico
  {
    id: "pictorial-1",
    title: "As Vacas da Fazenda Feliz",
    stage: "pictorial",
    enunciado: "Na Fazenda Feliz, o fazendeiro tem 4 cercados, e em cada um vivem 3 vacas. Quantas vacas o fazendeiro tem no total?",
    visualizacao: "🐄🐄🐄 🐄🐄🐄 🐄🐄🐄 🐄🐄🐄",
    educatorInstruction: "Incentive o aluno a desenhar os grupos de vacas ou a usar emojis para representar cada grupo. Peça para que ele conte o total de vacas desenhadas para chegar à resposta. Explique que a visualização ajuda a entender a multiplicação como a soma de grupos iguais.",
    expectedAnswer: "12"
  },
  {
    id: "pictorial-2",
    title: "A Pizza do Aniversário",
    stage: "pictorial",
    enunciado: "Para a festa de aniversário, uma pizza foi dividida em 8 fatias iguais. Se 3 fatias já foram comidas, qual fração da pizza ainda resta?",
    visualizacao: "🍕🍕🍕🍕🍕🍕🍕🍕 (pizza inteira)",
    educatorInstruction: "Peça ao aluno para desenhar um círculo dividido em 8 partes iguais, representando as fatias da pizza. Em seguida, instrua-o a colorir ou marcar 3 fatias como comidas e contar as fatias restantes para expressar a fração. Enfatize a representação visual de frações e a relação entre o todo e suas partes.",
    expectedAnswer: "5/8"
  },
  {
    id: "pictorial-3",
    title: "Carros no Estacionamento",
    stage: "pictorial",
    enunciado: "Em um estacionamento, há 6 fileiras de carros, e em cada fileira há 5 carros. Quantos carros estão estacionados no total?",
    visualizacao: "🚗🚗🚗🚗🚗\n🚗🚗🚗🚗🚗\n🚗🚗🚗🚗🚗\n🚗🚗🚗🚗🚗\n🚗🚗🚗🚗🚗\n🚗🚗🚗🚗🚗",
    educatorInstruction: "Oriente o aluno a desenhar uma grade ou usar emojis de carros para representar as fileiras e colunas. Peça para que ele conte o número total de carros. Explique como essa visualização ajuda a entender a multiplicação como a organização em grupos ou arranjos retangulares.",
    expectedAnswer: "30"
  },
  {
    id: "pictorial-4",
    title: "O Jardim Secreto",
    stage: "pictorial",
    enunciado: "O jardineiro quer plantar flores em um canteiro retangular que tem 7 metros de comprimento e 4 metros de largura. Qual é a área total que ele tem para plantar?",
    visualizacao: "□□□□□□□\n□□□□□□□\n□□□□□□□\n□□□□□□□ (retângulo 7x4)",
    educatorInstruction: "Peça ao aluno para desenhar um retângulo e dividi-lo em pequenos quadrados unitários, representando cada metro quadrado. Ele deve contar quantos quadrados há no total para encontrar a área. Reforce a ideia de área como a quantidade de superfície coberta e a relação com a multiplicação.",
    expectedAnswer: "28"
  },
  {
    id: "pictorial-5",
    title: "Os Pássaros no Ninho",
    stage: "pictorial",
    enunciado: "Em um ninho, havia alguns ovos. Nasceram 3 filhotes, e agora restam 4 ovos no ninho. Quantos ovos havia no ninho antes de os filhotes nascerem?",
    visualizacao: "🐣🐣🐣 (filhotes que nasceram) + 🥚🥚🥚🥚 (ovos restantes)",
    educatorInstruction: "Oriente o aluno a desenhar os filhotes e os ovos restantes. Em seguida, peça para que ele junte os desenhos e conte o total para descobrir a quantidade inicial de ovos. Este desafio ajuda a visualizar a adição como a união de conjuntos e a reconstrução de um todo a partir de suas partes.",
    expectedAnswer: "7"
  },
  // Estágio Abstrato
  {
    id: "abstract-1",
    title: "A Equação Misteriosa",
    stage: "abstract",
    enunciado: "Existe um número misterioso. Se você multiplicar esse número por 3 e depois subtrair 7, o resultado será 11. Qual é o número misterioso?",
    visualizacao: "3x - 7 = 11",
    educatorInstruction: "Oriente o aluno a isolar a variável 'x' usando operações inversas. Comece adicionando 7 a ambos os lados da equação e, em seguida, divida por 3. Reforce a importância de manter o equilíbrio da equação ao realizar operações.",
    expectedAnswer: "6"
  },
  {
    id: "abstract-2",
    title: "O Círculo Perfeito",
    stage: "abstract",
    enunciado: "Um designer está criando um logotipo circular. Ele precisa que a área do círculo seja de aproximadamente 78.5 cm². Se ele usar π ≈ 3.14, qual deve ser o raio desse círculo?",
    visualizacao: "A = π × r²\n78.5 = 3.14 × r²",
    educatorInstruction: "Guie o aluno a usar a fórmula da área do círculo. Primeiro, ele deve dividir a área por π (3.14) e, em seguida, encontrar a raiz quadrada do resultado para obter o raio. Explique a aplicação da fórmula em situações práticas.",
    expectedAnswer: "5"
  },
  {
    id: "abstract-3",
    title: "A Função Secreta",
    stage: "abstract",
    enunciado: "Uma máquina secreta transforma números. Se você coloca um número 'x' na máquina, ela calcula 2x + 5. Se você colocar o número 4 na máquina, qual será o resultado?",
    visualizacao: "f(x) = 2x + 5\nf(4) = ?",
    educatorInstruction: "Instrua o aluno a substituir o valor de 'x' (que é 4) na função e realizar as operações matemáticas na ordem correta (multiplicação antes da adição). Reforce o conceito de função como uma regra que relaciona valores de entrada e saída.",
    expectedAnswer: "13"
  },
  {
    id: "abstract-4", 
    title: "O Sistema de Códigos",
    stage: "abstract",
    enunciado: "Em um jogo de enigmas, você precisa descobrir dois números secretos. A soma deles é 15, e a diferença entre eles é 3. Quais são esses dois números?",
    visualizacao: "x + y = 15\nx - y = 3",
    educatorInstruction: "Sugira ao aluno que use o método de adição ou substituição para resolver o sistema de equações. Explique como a combinação das duas equações pode levar à descoberta dos valores de 'x' e 'y'.",
    expectedAnswer: "9 e 6"
  },
  {
    id: "abstract-5",
    title: "O Limite da Velocidade",
    stage: "abstract",
    enunciado: "Em um experimento de física, a velocidade de um objeto é descrita por uma função. Conforme o tempo 't' se aproxima de 3 segundos, a velocidade é dada pela expressão (t² - 9) / (t - 3). Qual é a velocidade do objeto quando o tempo se aproxima de 3 segundos?",
    visualizacao: "lim(t→3) (t² - 9) / (t - 3)",
    educatorInstruction: "Oriente o aluno a simplificar a expressão algébrica antes de substituir o valor de 't'. Explique que (t² - 9) pode ser fatorado como (t - 3)(t + 3), permitindo o cancelamento do termo (t - 3). Em seguida, o aluno pode substituir t=3 na expressão simplificada. Introduza o conceito de limite de forma intuitiva, mostrando como a simplificação ajuda a evitar a divisão por zero.",
    expectedAnswer: "6"
  }
];

interface CPAIntegratedChallengeProps {
  stage?: CPAStage;
  onComplete?: (challenge: CPAChallenge) => void;
}

export const CPAIntegratedChallenge = ({ 
  stage = 'concrete',
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
  }, []);

  useEffect(() => {
    setStageStartTime(new Date());
  }, [currentStage]);

  const handleStageComplete = (success: boolean) => {
    if (success) {
      setCompletedStages(prev => [...new Set([...prev, currentStage])]);
      
      // Chamar callback se fornecido
      const currentProblem = cpaProblems.find(p => p.stage === currentStage);
      if (currentProblem) {
        onComplete?.(currentProblem);
      }
      
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
                  Problemas CPA - {getStageTitle(currentStage)}
                </CardTitle>
                <p className="text-white mt-2">Desenvolva suas habilidades através do Método de Singapura</p>
              </div>
              <div className="flex items-center gap-3">
                <Badge className="bg-white/30 text-white border-white/40">
                  Interativo
                </Badge>
                <Button variant="ghost" size="sm" onClick={resetChallenge} className="bg-primary text-primary-foreground hover:bg-primary-hover shadow-primary">
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
                      ? 'bg-primary text-primary-foreground hover:bg-primary-hover shadow-primary' 
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

        {/* Componente do estágio atual - Problemas CPA Interativos */}
        <div className="animate-fade-in">
          {currentStage === 'concrete' && (
            <EnhancedVirtualTenBlocks
              problem={{
                description: "Resolva este problema usando blocos: Ana tinha 12 balas e ganhou mais 8 balas da sua avó. Quantas balas Ana tem agora?",
                initialValue1: 12,
                initialValue2: 8,
                expectedResult: 20,
                operation: "add" as const
              }}
              onComplete={() => handleStageComplete(true)}
            />
          )}
          
          {currentStage === 'pictorial' && (
            <AdvancedBarModelEditor
              problem={{
                description: "Use o modelo de barras para resolver: Em uma escola há 4 salas, cada uma com 6 alunos. Quantos alunos há no total?",
                expectedResult: 24,
                type: 'addition',
                hints: [
                  'Desenhe uma barra grande para representar o total',
                  'Divida em 4 partes iguais (uma para cada sala)',
                  'Cada parte deve conter 6 alunos',
                  'Use cores diferentes para distinguir conhecido vs incógnita'
                ]
              }}
              onComplete={() => handleStageComplete(true)}
            />
          )}
          
          {currentStage === 'abstract' && (
            <InteractiveEquationEditor
              problem={{
                description: "Resolva a equação para encontrar o valor de x:",
                equation: "2x + 5 = 13",
                expectedResult: 4,
                hints: [
                  "Primeiro, isole o termo com x subtraindo 5 de ambos os lados", 
                  "Depois, divida ambos os lados por 2 para encontrar x", 
                  "Lembre-se: o que fizer de um lado, faça do outro!",
                  "Sempre simplifique quando possível"
                ]
              }}
              onComplete={() => handleStageComplete(true)}
              onReturnToPictorial={() => goToStage('pictorial')}
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
              Aceita um Desafio!
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