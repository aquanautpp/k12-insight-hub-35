import { useState } from "react";
import { DynamicChallengeDisplay } from "./DynamicChallengeDisplay";
import { useToast } from "@/hooks/use-toast";

interface DailyChallenge {
  id: string;
  title: string;
  category: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  description: string;
  context: string[];
  question: string;
  resources: string[];
}

const dailyChallenge: DailyChallenge = {
  id: "challenge-001",
  title: "Orçamento Familiar Inteligente",
  category: "personal_finance",
  difficulty: "intermediate",
  description: "A família Silva tem uma renda mensal de R$ 4.500. Eles querem organizar suas finanças de forma inteligente.",
  context: [
    "Gastos fixos (aluguel, contas): R$ 2.200",
    "Alimentação: R$ 800", 
    "Transporte: R$ 400",
    "Lazer: R$ 300"
  ],
  question: "Eles querem economizar 20% da renda para emergências e sonham em fazer uma viagem que custa R$ 3.600 daqui a 8 meses. DESAFIO: Crie um plano financeiro para a família Silva. É possível atingir a meta de poupança E economizar para a viagem? Se não, que ajustes você sugere?",
  resources: [
    "Calculadora de orçamento familiar",
    "Dicas de economia doméstica", 
    "Planilha de controle financeiro"
  ]
};

const DailyChallenge = () => {
  const [answer, setAnswer] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [showTutorHelp, setShowTutorHelp] = useState(false);
  const [feedback, setFeedback] = useState("");
  const { toast } = useToast();

  const handleSubmitAnswer = () => {
    if (!answer.trim()) {
      toast({
        title: "Resposta vazia",
        description: "Por favor, escreva sua resposta antes de enviar.",
        variant: "destructive"
      });
      return;
    }

    // Feedback detalhado
    const expectedAnswer = "💡 Solução Sugerida: A família Silva tem renda de R$ 4.500. Gastos totais: R$ 3.700. Sobram R$ 800. Para 20% de emergência precisam de R$ 900/mês. Para a viagem precisam de R$ 450/mês. Total necessário: R$ 1.350. Como só sobram R$ 800, precisam cortar R$ 550 nos gastos, especialmente lazer (de R$ 300 para R$ 50) e transporte (de R$ 400 para R$ 200).";
    
    setFeedback(expectedAnswer);
    
    toast({
      title: "✅ Resposta Avaliada!",
      description: "Sua solução foi analisada. Veja o feedback abaixo.",
    });

    console.log("Resposta enviada:", answer);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner": return "bg-gradient-focus text-primary";
      case "intermediate": return "bg-gradient-learning text-white";
      case "advanced": return "bg-gradient-achievement text-white";
      default: return "bg-secondary";
    }
  };

  const getHint = () => {
    return "Dica: Primeiro calcule quanto sobra após os gastos atuais. Depois determine se é possível atingir ambas as metas (20% para emergência + R$ 450/mês para viagem). Se não for possível, identifique onde cortar gastos.";
  };

  const getTutorAdvice = () => {
    return "💡 Tutor IA: Para resolver este problema, siga estes passos: 1) Calcule a renda disponível após gastos fixos, 2) Determine quanto precisa poupar mensalmente para cada meta, 3) Compare com o que sobra, 4) Se necessário, sugira ajustes nos gastos não-essenciais como lazer.";
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <DynamicChallengeDisplay />
    </div>
  );
};

export default DailyChallenge;