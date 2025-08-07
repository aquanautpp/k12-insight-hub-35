import React, { createContext, useContext, useState, ReactNode } from 'react';
import { generateChallenge, AIChallenge } from '@/services/challengeService';

export interface Challenge {
  id: string;
  title: string;
  category: 'mathematics' | 'logic' | 'life_practical' | 'emotional';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  description: string;
  context: string[];
  question: string;
  resources: string[];
  xpReward: number;
  timeEstimate: number; // in minutes
  isCompleted: boolean;
  completedAt?: Date;
  // AI-enhanced (opcionais)
  type?: 'numeric' | 'multiple_choice' | 'open_ended';
  options?: string[];
  answer?: number | string;
  correctIndex?: number;
  explanation?: string;
}

interface ChallengeAttempt {
  challengeId: string;
  isCorrect: boolean;
  timeSec: number;
  timestamp: Date;
  difficulty: Challenge['difficulty'];
  category: Challenge['category'];
}

interface ChallengeContextType {
  challenges: Challenge[];
  currentChallenge: Challenge | null;
  completedChallenges: Challenge[];
  attempts: ChallengeAttempt[];
  generateNewChallenge: (userLevel: number, userStyle: string) => Challenge;
  generateNewChallengeAI: (userLevel: number, userStyle: string, category?: Challenge['category']) => Promise<Challenge>;
  recordAttempt: (isCorrect: boolean) => void;
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
    {
      id: "math-001",
      title: "Orçamento Familiar Inteligente",
      category: "life_practical",
      difficulty: "intermediate",
      description: "A família Silva tem uma renda mensal de R$ 4.500. Eles querem organizar suas finanças de forma inteligente.",
      context: [
        "Gastos fixos (aluguel, contas): R$ 2.200",
        "Alimentação: R$ 800", 
        "Transporte: R$ 400",
        "Lazer: R$ 300"
      ],
      question: "Eles querem economizar 20% da renda para emergências e sonham em fazer uma viagem que custa R$ 3.600 daqui a 8 meses. Crie um plano financeiro para a família Silva.",
      resources: ["Calculadora de orçamento familiar", "Dicas de economia doméstica", "Planilha de controle financeiro"],
      xpReward: 75,
      timeEstimate: 15,
      isCompleted: false
    },
    {
      id: "logic-001",
      title: "Sequência de Padrões",
      category: "logic",
      difficulty: "beginner",
      description: "Identifique o padrão e complete a sequência.",
      context: ["Sequência: 2, 4, 8, 16, ?, 64"],
      question: "Qual é o número que falta na sequência e qual é a regra que governa esta progressão?",
      resources: ["Guia de progressões matemáticas", "Calculadora"],
      xpReward: 50,
      timeEstimate: 10,
      isCompleted: false
    },
    {
      id: "math-002",
      title: "Geometria na Cozinha",
      category: "mathematics",
      difficulty: "intermediate",
      description: "Maria quer fazer pizzas para uma festa e precisa calcular as quantidades.",
      context: [
        "Pizza redonda com 30cm de diâmetro",
        "Cada pessoa come aproximadamente 200cm² de pizza",
        "Haverá 20 pessoas na festa"
      ],
      question: "Quantas pizzas Maria precisa fazer para alimentar todos os convidados adequadamente?",
      resources: ["Fórmula da área do círculo", "Calculadora"],
      xpReward: 60,
      timeEstimate: 12,
      isCompleted: false
    }
  ]);

  const [completedChallenges, setCompletedChallenges] = useState<Challenge[]>([]);
  const [currentChallenge, setCurrentChallenge] = useState<Challenge | null>(challenges[0]);
  const [attempts, setAttempts] = useState<ChallengeAttempt[]>([]);
  const [startedAt, setStartedAt] = useState<number | null>(null);

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

  const generateNewChallengeAI = async (
    userLevel: number,
    userStyle: string,
    category?: Challenge['category']
  ): Promise<Challenge> => {
    // Adaptive level based on recent attempts (last 5)
    const recent = attempts.slice(-5);
    let adjustedLevel = userLevel;
    if (recent.length > 0) {
      const accuracy = recent.filter(a => a.isCorrect).length / recent.length;
      const avgTime = recent.reduce((s, a) => s + a.timeSec, 0) / recent.length;
      if (accuracy >= 0.8 && avgTime <= 120) adjustedLevel = Math.max(1, userLevel + 1);
      else if (accuracy <= 0.5 || avgTime > 180) adjustedLevel = Math.max(1, userLevel - 1);
    }

    const ai: AIChallenge = await generateChallenge({ level: adjustedLevel, style: userStyle, category });
    const mapped: Challenge = {
      id: ai.id,
      title: ai.title,
      category: ai.category,
      difficulty: ai.difficulty,
      description: ai.description,
      context: ai.context,
      question: ai.question,
      resources: ai.resources,
      xpReward: ai.xpReward,
      timeEstimate: ai.timeEstimate,
      isCompleted: false,
      type: ai.type,
      options: ai.options,
      answer: ai.answer,
      correctIndex: ai.correctIndex,
      explanation: ai.explanation,
    };
    setCurrentChallenge(mapped);
    setStartedAt(Date.now());
    return mapped;
  };

  const recordAttempt = (isCorrect: boolean) => {
    const now = Date.now();
    const durationSec = startedAt ? Math.max(1, Math.round((now - startedAt) / 1000)) : 0;
    if (currentChallenge) {
      const attempt: ChallengeAttempt = {
        challengeId: currentChallenge.id,
        isCorrect,
        timeSec: durationSec,
        timestamp: new Date(),
        difficulty: currentChallenge.difficulty,
        category: currentChallenge.category,
      };
      setAttempts(prev => [...prev, attempt]);
    }
    setStartedAt(null);
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
      attempts,
      generateNewChallenge,
      generateNewChallengeAI,
      recordAttempt,
      completeChallenge,
      getChallengesByCategory
    }}>
      {children}
    </ChallengeContext.Provider>
  );
};
