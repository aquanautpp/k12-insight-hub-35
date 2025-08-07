import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Eye, EyeOff, Brain, ChevronLeft, ChevronRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import MathText from "./MathText";

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
    visualizacao: "$3x - 7 = 11$",
    educatorInstruction: "Oriente o aluno a isolar a variável 'x' usando operações inversas. Comece adicionando 7 a ambos os lados da equação e, em seguida, divida por 3. Reforce a importância de manter o equilíbrio da equação ao realizar operações.",
    expectedAnswer: "6"
  },
  {
    id: "abstract-2",
    title: "O Círculo Perfeito",
    stage: "abstract",
    enunciado: "Um designer está criando um logotipo circular. Ele precisa que a área do círculo seja de aproximadamente 78.5 cm². Se ele usar π ≈ 3.14, qual deve ser o raio desse círculo?",
    visualizacao: "$A = \\pi \\times r^2$\n$78.5 = 3.14 \\times r^2$",
    educatorInstruction: "Guie o aluno a usar a fórmula da área do círculo. Primeiro, ele deve dividir a área por π (3.14) e, em seguida, encontrar a raiz quadrada do resultado para obter o raio. Explique a aplicação da fórmula em situações práticas.",
    expectedAnswer: "5"
  },
  {
    id: "abstract-3",
    title: "A Função Secreta",
    stage: "abstract",
    enunciado: "Uma máquina secreta transforma números. Se você coloca um número 'x' na máquina, ela calcula 2x + 5. Se você colocar o número 4 na máquina, qual será o resultado?",
    visualizacao: "$f(x) = 2x + 5$\n$f(4) = ?$",
    educatorInstruction: "Instrua o aluno a substituir o valor de 'x' (que é 4) na função e realizar as operações matemáticas na ordem correta (multiplicação antes da adição). Reforce o conceito de função como uma regra que relaciona valores de entrada e saída.",
    expectedAnswer: "13"
  },
  {
    id: "abstract-4", 
    title: "O Sistema de Códigos",
    stage: "abstract",
    enunciado: "Em um jogo de enigmas, você precisa descobrir dois números secretos. A soma deles é 15, e a diferença entre eles é 3. Quais são esses dois números?",
    visualizacao: "$x + y = 15$\n$x - y = 3$",
    educatorInstruction: "Sugira ao aluno que use o método de adição ou substituição para resolver o sistema de equações. Explique como a combinação das duas equações pode levar à descoberta dos valores de 'x' e 'y'.",
    expectedAnswer: "9 e 6"
  },
  {
    id: "abstract-5",
    title: "O Limite da Velocidade",
    stage: "abstract",
    enunciado: "Em um experimento de física, a velocidade de um objeto é descrita por uma função. Conforme o tempo 't' se aproxima de 3 segundos, a velocidade é dada pela expressão (t² - 9) / (t - 3). Qual é a velocidade do objeto quando o tempo se aproxima de 3 segundos?",
    visualizacao: "$\\lim_{t \\to 3} \\frac{t^2 - 9}{t - 3}$",
    educatorInstruction: "Oriente o aluno a simplificar a expressão algébrica antes de substituir o valor de 't'. Explique que (t² - 9) pode ser fatorado como (t - 3)(t + 3), permitindo o cancelamento do termo (t - 3). Em seguida, o aluno pode substituir t=3 na expressão simplificada. Introduza o conceito de limite de forma intuitiva, mostrando como a simplificação ajuda a evitar a divisão por zero.",
    expectedAnswer: "6"
  }
];

interface CPAProblemDisplayProps {
  stage: 'concrete' | 'pictorial' | 'abstract';
  onComplete?: (problem: CPAChallenge) => void;
}

export const CPAProblemDisplay = ({ stage, onComplete }: CPAProblemDisplayProps) => {
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [showEducatorInstruction, setShowEducatorInstruction] = useState(false);
  const [completedProblems, setCompletedProblems] = useState<string[]>([]);
  const { toast } = useToast();

  const stageProblems = cpaProblems.filter(problem => problem.stage === stage);
  const currentProblem = stageProblems[currentProblemIndex];

  if (!currentProblem) {
    return (
      <Card className="shadow-card">
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">Nenhum problema disponível para este estágio.</p>
        </CardContent>
      </Card>
    );
  }

  const handleAnswerSubmit = () => {
    if (!userAnswer.trim()) {
      toast({
        title: "Digite sua resposta",
        description: "Por favor, insira uma resposta antes de verificar.",
        variant: "destructive",
      });
      return;
    }

    const isCorrect = userAnswer.trim().toLowerCase() === currentProblem.expectedAnswer.toLowerCase();
    
    if (isCorrect) {
      setCompletedProblems(prev => [...prev, currentProblem.id]);
      onComplete?.(currentProblem);
      toast({
        title: "🎉 Resposta correta!",
        description: "Parabéns! Você resolveu o problema.",
      });
    } else {
      toast({
        title: "Resposta incorreta",
        description: "Tente novamente! Observe bem a visualização.",
        variant: "destructive",
      });
    }
  };

  const goToNextProblem = () => {
    if (currentProblemIndex < stageProblems.length - 1) {
      setCurrentProblemIndex(prev => prev + 1);
      setUserAnswer("");
    }
  };

  const goToPreviousProblem = () => {
    if (currentProblemIndex > 0) {
      setCurrentProblemIndex(prev => prev - 1);
      setUserAnswer("");
    }
  };

  const getStageIcon = (stage: string) => {
    switch (stage) {
      case 'concrete': return '🧱';
      case 'pictorial': return '🎨';
      case 'abstract': return '🔢';
      default: return '📚';
    }
  };

  const getStageTitle = (stage: string) => {
    switch (stage) {
      case 'concrete': return 'Estágio Concreto';
      case 'pictorial': return 'Estágio Pictórico';
      case 'abstract': return 'Estágio Abstrato';
      default: return stage;
    }
  };

  const getStageDescription = (stage: string) => {
    switch (stage) {
      case 'concrete': return 'Aprendizagem através da manipulação física de objetos';
      case 'pictorial': return 'Representação visual através de desenhos e diagramas';
      case 'abstract': return 'Uso de símbolos e operações matemáticas formais';
      default: return '';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header do estágio */}
      <Card className="shadow-card border-2 border-primary/20">
        <CardHeader className="bg-gradient-to-r from-primary to-primary/90 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{getStageIcon(stage)}</span>
              <div>
                <CardTitle className="text-2xl">{getStageTitle(stage)}</CardTitle>
                <p className="text-white/90 mt-1">{getStageDescription(stage)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                Exemplo {currentProblemIndex + 1} de {stageProblems.length}
              </Badge>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={goToPreviousProblem}
                  disabled={currentProblemIndex === 0}
                  className="text-white hover:bg-white/20 disabled:opacity-50"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={goToNextProblem}
                  disabled={currentProblemIndex === stageProblems.length - 1}
                  className="text-white hover:bg-white/20 disabled:opacity-50"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Problema atual */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary" />
            {currentProblem.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Enunciado */}
          <div className="bg-muted/50 rounded-lg p-4">
            <h3 className="font-semibold text-foreground mb-2">📍 Enunciado:</h3>
            <p className="text-foreground leading-relaxed">{currentProblem.enunciado}</p>
          </div>

          {/* Visualização */}
          <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg p-4 border border-primary/20">
            <h3 className="font-semibold text-foreground mb-3">🎨 Visualização:</h3>
            <div className="bg-white rounded-lg p-4 text-center">
              <MathText className="text-lg text-foreground">
                {currentProblem.visualizacao}
              </MathText>
            </div>
          </div>

          {/* Campo de resposta */}
          <div className="bg-card border border-border rounded-lg p-4">
            <h3 className="font-semibold text-foreground mb-3">✏️ Sua Resposta:</h3>
            <div className="flex gap-3">
              <Input
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Digite sua resposta aqui..."
                className="flex-1"
                onKeyPress={(e) => e.key === 'Enter' && handleAnswerSubmit()}
              />
              <Button onClick={handleAnswerSubmit} className="min-w-[120px]">
                Verificar
              </Button>
            </div>
          </div>

          {/* Instrução ao educador (toggle) */}
          <div className="border-t pt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowEducatorInstruction(!showEducatorInstruction)}
              className="mb-3"
            >
              {showEducatorInstruction ? (
                <>
                  <EyeOff className="w-4 h-4 mr-2" />
                  Ocultar Instrução ao Educador
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4 mr-2" />
                  Mostrar Instrução ao Educador
                </>
              )}
            </Button>
            
            {showEducatorInstruction && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <h4 className="font-semibold text-amber-800 mb-2">📚 Instrução ao Educador:</h4>
                <p className="text-amber-700 text-sm leading-relaxed">
                  {currentProblem.educatorInstruction}
                </p>
              </div>
            )}
          </div>

          {/* Progresso */}
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              {completedProblems.length} problemas resolvidos
            </div>
            <div>
              {currentProblemIndex + 1} / {stageProblems.length}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};