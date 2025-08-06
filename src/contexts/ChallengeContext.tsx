import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Challenge {
  id: string;
  title: string;
  category: 'mathematics' | 'logic' | 'life_practical' | 'emotional';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  stage: 'concreto' | 'pictorico' | 'abstrato';
  enunciado: string;
  visualizacao: string;
  educatorInstruction: string;
  xpReward: number;
  timeEstimate: number; // in minutes
  isCompleted: boolean;
  completedAt?: Date;
  userAnswer?: string;
}

interface ChallengeContextType {
  challenges: Challenge[];
  currentChallenge: Challenge | null;
  completedChallenges: Challenge[];
  generateNewChallenge: (userLevel: number, userStyle: string) => Challenge;
  completeChallenge: (challengeId: string, userAnswer: string) => void;
  getChallengesByCategory: (category: string) => Challenge[];
}

const ChallengeContext = createContext<ChallengeContextType | undefined>(undefined);

export const useChallenge = () => {
  const context = useContext(ChallengeContext);
  if (!context) {
    throw new Error('useChallenge must be used within a ChallengeProvider');
  }
  return context;
};

interface ChallengeProviderProps {
  children: ReactNode;
}

export const ChallengeProvider: React.FC<ChallengeProviderProps> = ({ children }) => {
  const [challenges, setChallenges] = useState<Challenge[]>([
    // Desafios Concretos
    {
      id: "concreto-001",
      title: "As Maçãs do Pomar",
      category: "mathematics",
      difficulty: "beginner",
      stage: "concreto",
      enunciado: "No pomar da Vovó, havia 7 maçãs maduras em uma cesta. Depois que os netos brincaram, algumas maçãs foram colhidas e adicionadas à cesta, e agora há um total de 12 maçãs. Quantas maçãs os netos colheram?",
      visualizacao: "🍎🍎🍎🍎🍎🍎🍎",
      educatorInstruction: "Peça ao aluno para usar 7 objetos físicos (maçãs de brinquedo, blocos, etc.) para representar as maçãs iniciais. Em seguida, instrua-o a adicionar mais objetos até atingir um total de 12, contando quantos objetos foram adicionados para encontrar a resposta. Reforce o conceito de adição e a relação entre parte-todo.",
      xpReward: 50,
      timeEstimate: 10,
      isCompleted: false
    },
    {
      id: "concreto-002",
      title: "Os Brinquedos Perdidos",
      category: "mathematics",
      difficulty: "beginner",
      stage: "concreto",
      enunciado: "Lucas tinha 10 carrinhos de brinquedo. Ao arrumar seu quarto, ele percebeu que alguns carrinhos estavam faltando. Se ele encontrou apenas 6 carrinhos, quantos carrinhos ainda estão escondidos?",
      visualizacao: "🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗",
      educatorInstruction: "Forneça 10 objetos físicos (carrinhos de brinquedo, cubos, etc.) ao aluno. Peça para ele remover 6 objetos e, então, contar quantos restaram para simular os carrinhos perdidos. Discuta a ideia de subtração como 'tirar' ou 'encontrar a diferença'.",
      xpReward: 50,
      timeEstimate: 10,
      isCompleted: false
    },
    {
      id: "concreto-003",
      title: "Os Lápis Coloridos",
      category: "mathematics",
      difficulty: "beginner",
      stage: "concreto",
      enunciado: "Na caixa de lápis de cor de Ana, havia 8 lápis. Para um novo desenho, ela pegou mais alguns lápis de outra caixa, e agora ela tem 14 lápis no total. Quantos lápis Ana pegou da outra caixa?",
      visualizacao: "✏️✏️✏️✏️✏️✏️✏️✏️",
      educatorInstruction: "Utilize 8 lápis reais ou objetos similares para representar a quantidade inicial. Peça ao aluno para adicionar mais lápis, um por um, até que o total seja 14. O aluno deve contar quantos lápis foram adicionados para chegar à resposta. Enfatize a relação entre adição e a busca pelo número desconhecido.",
      xpReward: 50,
      timeEstimate: 10,
      isCompleted: false
    },
    {
      id: "concreto-004",
      title: "Os Biscoitos da Festa",
      category: "mathematics",
      difficulty: "beginner",
      stage: "concreto",
      enunciado: "Para a festa de aniversário, mamãe assou 15 biscoitos e quer distribuí-los igualmente em 3 pratos. Quantos biscoitos cada prato terá?",
      visualizacao: "🍪🍪🍪🍪🍪🍪🍪🍪🍪🍪🍪🍪🍪🍪🍪",
      educatorInstruction: "Providencie 15 biscoitos de brinquedo ou fichas e 3 pratos. Oriente o aluno a distribuir um biscoito por vez em cada prato, de forma alternada, até que todos os biscoitos sejam distribuídos. Em seguida, peça para contar quantos biscoitos há em cada prato. Isso reforça o conceito de divisão como distribuição equitativa.",
      xpReward: 60,
      timeEstimate: 12,
      isCompleted: false
    },
    {
      id: "concreto-005",
      title: "As Bolas da Cesta",
      category: "mathematics",
      difficulty: "beginner",
      stage: "concreto",
      enunciado: "Em uma cesta, havia algumas bolas. Pedro tirou 5 bolas para brincar, e agora restam 9 bolas na cesta. Quantas bolas havia na cesta antes de Pedro tirar algumas?",
      visualizacao: "⚽⚽⚽⚽⚽ + ⚽⚽⚽⚽⚽⚽⚽⚽⚽",
      educatorInstruction: "Peça ao aluno para usar 9 objetos para representar as bolas restantes e 5 objetos para representar as bolas que Pedro tirou. Em seguida, instrua-o a juntar todos os objetos e contar o total para descobrir a quantidade inicial. Este exercício ajuda a compreender a relação inversa entre adição e subtração.",
      xpReward: 60,
      timeEstimate: 12,
      isCompleted: false
    },
    // Desafios Pictóricos
    {
      id: "pictorico-001",
      title: "As Vacas da Fazenda Feliz",
      category: "mathematics",
      difficulty: "intermediate",
      stage: "pictorico",
      enunciado: "Na Fazenda Feliz, o fazendeiro tem 4 cercados, e em cada um vivem 3 vacas. Quantas vacas o fazendeiro tem no total?",
      visualizacao: "🐄🐄🐄 🐄🐄🐄 🐄🐄🐄 🐄🐄🐄",
      educatorInstruction: "Incentive o aluno a desenhar os grupos de vacas ou a usar emojis para representar cada grupo. Peça para que ele conte o total de vacas desenhadas para chegar à resposta. Explique que a visualização ajuda a entender a multiplicação como a soma de grupos iguais.",
      xpReward: 70,
      timeEstimate: 15,
      isCompleted: false
    },
    {
      id: "pictorico-002",
      title: "A Pizza do Aniversário",
      category: "mathematics",
      difficulty: "intermediate",
      stage: "pictorico",
      enunciado: "Para a festa de aniversário, uma pizza foi dividida em 8 fatias iguais. Se 3 fatias já foram comidas, qual fração da pizza ainda resta?",
      visualizacao: "🍕🍕🍕🍕🍕🍕🍕🍕",
      educatorInstruction: "Peça ao aluno para desenhar um círculo dividido em 8 partes iguais, representando as fatias da pizza. Em seguida, instrua-o a colorir ou marcar 3 fatias como comidas e contar as fatias restantes para expressar a fração. Enfatize a representação visual de frações e a relação entre o todo e suas partes.",
      xpReward: 70,
      timeEstimate: 15,
      isCompleted: false
    },
    {
      id: "pictorico-003",
      title: "Carros no Estacionamento",
      category: "mathematics",
      difficulty: "intermediate",
      stage: "pictorico",
      enunciado: "Em um estacionamento, há 6 fileiras de carros, e em cada fileira há 5 carros. Quantos carros estão estacionados no total?",
      visualizacao: "🚗🚗🚗🚗🚗\n🚗🚗🚗🚗🚗\n🚗🚗🚗🚗🚗\n🚗🚗🚗🚗🚗\n🚗🚗🚗🚗🚗\n🚗🚗🚗🚗🚗",
      educatorInstruction: "Oriente o aluno a desenhar uma grade ou usar emojis de carros para representar as fileiras e colunas. Peça para que ele conte o número total de carros. Explique como essa visualização ajuda a entender a multiplicação como a organização em grupos ou arranjos retangulares.",
      xpReward: 70,
      timeEstimate: 15,
      isCompleted: false
    },
    {
      id: "pictorico-004",
      title: "O Jardim Secreto",
      category: "mathematics",
      difficulty: "intermediate",
      stage: "pictorico",
      enunciado: "O jardineiro quer plantar flores em um canteiro retangular que tem 7 metros de comprimento e 4 metros de largura. Qual é a área total que ele tem para plantar?",
      visualizacao: "📐 Retângulo: 7m × 4m",
      educatorInstruction: "Peça ao aluno para desenhar um retângulo e dividi-lo em pequenos quadrados unitários, representando cada metro quadrado. Ele deve contar quantos quadrados há no total para encontrar a área. Reforce a ideia de área como a quantidade de superfície coberta e a relação com a multiplicação.",
      xpReward: 80,
      timeEstimate: 18,
      isCompleted: false
    },
    {
      id: "pictorico-005",
      title: "Os Pássaros no Ninho",
      category: "mathematics",
      difficulty: "intermediate",
      stage: "pictorico",
      enunciado: "Em um ninho, havia alguns ovos. Nasceram 3 filhotes, e agora restam 4 ovos no ninho. Quantos ovos havia no ninho antes de os filhotes nascerem?",
      visualizacao: "🐣🐣🐣 + 🥚🥚🥚🥚",
      educatorInstruction: "Oriente o aluno a desenhar os filhotes e os ovos restantes. Em seguida, peça para que ele junte os desenhos e conte o total para descobrir a quantidade inicial de ovos. Este desafio ajuda a visualizar a adição como a união de conjuntos e a reconstrução de um todo a partir de suas partes.",
      xpReward: 80,
      timeEstimate: 18,
      isCompleted: false
    },
    // Desafios Abstratos
    {
      id: "abstrato-001",
      title: "A Equação Misteriosa",
      category: "mathematics",
      difficulty: "advanced",
      stage: "abstrato",
      enunciado: "Existe um número misterioso. Se você multiplicar esse número por 3 e depois subtrair 7, o resultado será 11. Qual é o número misterioso?",
      visualizacao: "3x - 7 = 11",
      educatorInstruction: "Oriente o aluno a isolar a variável 'x' usando operações inversas. Comece adicionando 7 a ambos os lados da equação e, em seguida, divida por 3. Reforce a importância de manter o equilíbrio da equação ao realizar operações.",
      xpReward: 100,
      timeEstimate: 20,
      isCompleted: false
    },
    {
      id: "abstrato-002",
      title: "O Círculo Perfeito",
      category: "mathematics",
      difficulty: "advanced",
      stage: "abstrato",
      enunciado: "Um designer está criando um logotipo circular. Ele precisa que a área do círculo seja de aproximadamente 78.5 cm². Se ele usar π ≈ 3.14, qual deve ser o raio desse círculo?",
      visualizacao: "A = π × r²\n78.5 = 3.14 × r²",
      educatorInstruction: "Guie o aluno a usar a fórmula da área do círculo. Primeiro, ele deve dividir a área por π (3.14) e, em seguida, encontrar a raiz quadrada do resultado para obter o raio. Explique a aplicação da fórmula em situações práticas.",
      xpReward: 100,
      timeEstimate: 20,
      isCompleted: false
    },
    {
      id: "abstrato-003",
      title: "A Função Secreta",
      category: "mathematics",
      difficulty: "advanced",
      stage: "abstrato",
      enunciado: "Uma máquina secreta transforma números. Se você coloca um número 'x' na máquina, ela calcula 2x + 5. Se você colocar o número 4 na máquina, qual será o resultado?",
      visualizacao: "f(x) = 2x + 5\nf(4) = ?",
      educatorInstruction: "Instrua o aluno a substituir o valor de 'x' (que é 4) na função e realizar as operações matemáticas na ordem correta (multiplicação antes da adição). Reforce o conceito de função como uma regra que relaciona valores de entrada e saída.",
      xpReward: 90,
      timeEstimate: 18,
      isCompleted: false
    },
    {
      id: "abstrato-004",
      title: "O Sistema de Códigos",
      category: "mathematics",
      difficulty: "advanced",
      stage: "abstrato",
      enunciado: "Em um jogo de enigmas, você precisa descobrir dois números secretos. A soma deles é 15, e a diferença entre eles é 3. Quais são esses dois números?",
      visualizacao: "x + y = 15\nx - y = 3",
      educatorInstruction: "Sugira ao aluno que use o método de adição ou substituição para resolver o sistema de equações. Explique como a combinação das duas equações pode levar à descoberta dos valores de 'x' e 'y'.",
      xpReward: 110,
      timeEstimate: 25,
      isCompleted: false
    },
    {
      id: "abstrato-005",
      title: "O Limite da Velocidade",
      category: "mathematics",
      difficulty: "advanced",
      stage: "abstrato",
      enunciado: "Em um experimento de física, a velocidade de um objeto é descrita por uma função. Conforme o tempo 't' se aproxima de 3 segundos, a velocidade é dada pela expressão (t² - 9) / (t - 3). Qual é a velocidade do objeto quando o tempo se aproxima de 3 segundos?",
      visualizacao: "lim(t→3) (t² - 9) / (t - 3)",
      educatorInstruction: "Oriente o aluno a simplificar a expressão algébrica antes de substituir o valor de 't'. Explique que (t² - 9) pode ser fatorado como (t - 3)(t + 3), permitindo o cancelamento do termo (t - 3). Em seguida, o aluno pode substituir t=3 na expressão simplificada. Introduza o conceito de limite de forma intuitiva, mostrando como a simplificação ajuda a evitar a divisão por zero.",
      xpReward: 120,
      timeEstimate: 30,
      isCompleted: false
    }
  ]);

  const [completedChallenges, setCompletedChallenges] = useState<Challenge[]>([]);
  const [currentChallenge, setCurrentChallenge] = useState<Challenge | null>(challenges[0]);

  const generateNewChallenge = (userLevel: number, userStyle: string) => {
    // Simple algorithm to select appropriate challenge based on user level and learning style
    const availableChallenges = challenges.filter(c => !c.isCompleted);
    const difficultyMap = {
      'beginner': userLevel < 5,
      'intermediate': userLevel >= 5 && userLevel < 15,
      'advanced': userLevel >= 15
    };
    
    const suitableChallenges = availableChallenges.filter(c => {
      return Object.entries(difficultyMap).some(([diff, condition]) => 
        c.difficulty === diff && condition
      );
    });

    const selectedChallenge = suitableChallenges[Math.floor(Math.random() * suitableChallenges.length)] || challenges[0];
    setCurrentChallenge(selectedChallenge);
    return selectedChallenge;
  };

  const completeChallenge = (challengeId: string, userAnswer: string) => {
    const challenge = challenges.find(c => c.id === challengeId);
    if (challenge) {
      const completedChallenge = {
        ...challenge,
        isCompleted: true,
        completedAt: new Date()
      };

      // mark challenge as completed in main list
      setChallenges(prev =>
        prev.map(c => (c.id === challengeId ? completedChallenge : c))
      );

      // add to completed list
      setCompletedChallenges(prev => [...prev, completedChallenge]);

      // reset current challenge
      setCurrentChallenge(null);      
    }
  };

  const getChallengesByCategory = (category: string) => {
    return challenges.filter(c => c.category === category);
  };

  return (
    <ChallengeContext.Provider value={{
      challenges,
      currentChallenge,
      completedChallenges,
      generateNewChallenge,
      completeChallenge,
      getChallengesByCategory
    }}>
      {children}
    </ChallengeContext.Provider>
  );
};
