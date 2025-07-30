import { useState } from "react";
import { DynamicChallengeDisplay } from "./DynamicChallengeDisplay";
import { useToast } from "@/hooks/use-toast";
import { useChallenge } from "@/contexts/ChallengeContext";

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
    const { currentChallenge } = useChallenge();
    if (!currentChallenge) return "Gere um novo desafio para ver dicas personalizadas.";
    
    // Gerar dica baseada na categoria do desafio atual
    switch (currentChallenge.category) {
      case 'mathematics':
        return "Dica: Identifique os dados conhecidos, determine o que precisa calcular e aplique operações matemáticas passo a passo.";
      case 'logic':
        return "Dica: Analise os padrões, elimine as possibilidades impossíveis e use raciocínio dedutivo.";
      case 'life_practical':
        return "Dica: Considere soluções práticas, pense em diferentes alternativas e avalie os prós e contras.";
      case 'emotional':
        return "Dica: Analise os sentimentos envolvidos, identifique as emoções e considere as melhores formas de expressão.";
      default:
        return "Dica: Leia atentamente o problema, organize as informações e desenvolva sua solução passo a passo.";
    }
  };

  const getTutorAdvice = () => {
    const { currentChallenge } = useChallenge();
    if (!currentChallenge) return "Gere um novo desafio para receber orientação do tutor IA.";
    
    // Gerar conselho baseado na categoria do desafio atual
    switch (currentChallenge.category) {
      case 'mathematics':
        return "💡 Tutor IA: Use o método CPA: 1) Concrete - visualize com objetos, 2) Pictorial - desenhe o problema, 3) Abstract - aplique fórmulas matemáticas.";
      case 'logic':
        return "💡 Tutor IA: Para problemas lógicos: 1) Liste o que você sabe, 2) Identifique o que precisa descobrir, 3) Use eliminação e dedução sistemática.";
      case 'life_practical':
        return "💡 Tutor IA: Para situações práticas: 1) Analise o contexto, 2) Liste opções disponíveis, 3) Avalie consequências, 4) Escolha a melhor solução.";
      case 'emotional':
        return "💡 Tutor IA: Para questões emocionais: 1) Identifique os sentimentos, 2) Aceite as emoções, 3) Encontre formas saudáveis de expressão, 4) Busque apoio quando necessário.";
      default:
        return "💡 Tutor IA: Organize suas ideias, analise os dados disponíveis e desenvolva uma solução estruturada passo a passo.";
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <DynamicChallengeDisplay />
      
      {/* Challenge Interaction Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Answer Input Section */}
        <div className="bg-card border border-border rounded-lg p-6 space-y-4">
          <h3 className="text-lg font-semibold text-foreground">💡 Sua Solução Genial</h3>
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Mostre sua estratégia! Cada ideia conta para resolver este desafio..."
            className="w-full h-32 p-4 border border-border rounded-lg resize-none focus:ring-2 focus:ring-primary focus:border-transparent text-foreground bg-background transition-all duration-200 hover:shadow-md"
          />
          
          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleSubmitAnswer}
              className="flex-1 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-all duration-200 font-medium hover-scale"
            >
              🚀 Enviar Minha Solução
            </button>
            <button
              onClick={() => setShowHint(!showHint)}
              className="px-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary/10 transition-all duration-200 hover-scale"
            >
              {showHint ? 'Ocultar Dica' : '💡 Dica Especial'}
            </button>
            <button
              onClick={() => setShowTutorHelp(!showTutorHelp)}
              className="px-4 py-2 border border-secondary text-secondary rounded-lg hover:bg-secondary/10 transition-all duration-200 hover-scale"
            >
              {showTutorHelp ? 'Ocultar Tutor' : '🤖 Tutor IA'}
            </button>
          </div>
        </div>

        {/* Help and Feedback Section */}
        <div className="space-y-4">
          {/* Hint Section */}
          {showHint && (
            <div className="bg-gradient-subtle border border-primary/20 rounded-lg p-4">
              <h4 className="font-medium text-primary mb-2 flex items-center">
                <span className="mr-2">💡</span>
                Dica
              </h4>
              <p className="text-foreground text-sm leading-relaxed">{getHint()}</p>
            </div>
          )}

          {/* Tutor Help Section */}
          {showTutorHelp && (
            <div className="bg-gradient-focus border border-secondary/20 rounded-lg p-4">
              <h4 className="font-medium text-secondary mb-2 flex items-center">
                <span className="mr-2">🤖</span>
                Ajuda do Tutor IA
              </h4>
              <p className="text-foreground text-sm leading-relaxed">{getTutorAdvice()}</p>
            </div>
          )}

          {/* Feedback Section */}
          {feedback && (
            <div className="bg-gradient-achievement border border-primary/20 rounded-lg p-4">
              <h4 className="font-medium text-primary mb-2 flex items-center">
                <span className="mr-2">✅</span>
                Feedback da Resposta
              </h4>
              <p className="text-foreground text-sm leading-relaxed">{feedback}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DailyChallenge;