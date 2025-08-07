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

    // Palavras-chave que indicam uma resposta correta
    const correctKeywords = [
      "cortar", "reduzir", "diminuir", "economizar",
      "550", "900", "450", "1350", "lazer", "transporte",
      "não é possível", "insuficiente", "ajustar"
    ];

    // Verifica se a resposta contém elementos da solução correta
    const answerLower = answer.toLowerCase();
    const hasCorrectKeywords = correctKeywords.some(keyword => 
      answerLower.includes(keyword.toLowerCase())
    );

    // Verifica se mencionou cálculos básicos corretos
    const mentionedCalculations = answerLower.includes("3700") || 
                                 answerLower.includes("800") ||
                                 (answerLower.includes("4500") && answerLower.includes("gasto"));

    const isCorrectAnswer = hasCorrectKeywords && mentionedCalculations;

    if (isCorrectAnswer) {
      // Resposta correta
      setFeedback("🎉 Excelente análise! Você identificou corretamente que a família precisa reduzir gastos em R$ 550 para atingir ambas as metas. Sua solução demonstra boa compreensão de planejamento financeiro.");
      
      toast({
        title: "✅ Resposta Correta!",
        description: "Parabéns! Sua solução está no caminho certo.",
      });
    } else {
      // Resposta incorreta - dar dicas
      setFeedback("❌ Sua resposta precisa de alguns ajustes. Dica: Calcule primeiro quanto sobra após os gastos (R$ 4.500 - R$ 3.700 = R$ 800). Depois veja quanto precisam: 20% de emergência (R$ 900/mês) + viagem (R$ 450/mês) = R$ 1.350/mês. Como só sobram R$ 800, precisam cortar R$ 550 nos gastos. Tente novamente!");
      
      toast({
        title: "❌ Resposta Incorreta",
        description: "Revise os cálculos e tente novamente. Veja as dicas no feedback.",
        variant: "destructive"
      });
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner": return "bg-gradient-focus text-primary";
      case "intermediate": return "bg-gradient-learning text-white";
      case "advanced": return "bg-gradient-achievement text-white";
      default: return "bg-secondary";
    }
  };

  const translateDifficulty = (difficulty: string) => {
    switch (difficulty) {
      case "beginner": return "Iniciante";
      case "intermediate": return "Intermediário";
      case "advanced": return "Avançado";
      default: return difficulty;
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
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <DynamicChallengeDisplay />
      
      {/* Challenge Interaction Section - Layout Horizontal */}
      <div className="space-y-6">
        {/* Botões de Dica e Ajuda acima da caixa de resposta */}
        <div className="flex gap-3 justify-start">
          <button
            onClick={() => setShowHint(!showHint)}
            className="px-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary/10 transition-all duration-200 hover-scale flex items-center gap-2"
          >
            <span>💡</span>
            {showHint ? 'Ocultar Dica' : 'Pedir Dica'}
          </button>
          <button
            onClick={() => setShowTutorHelp(!showTutorHelp)}
            className="px-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary/10 transition-all duration-200 hover-scale flex items-center gap-2"
          >
            <span>🤖</span>
            {showTutorHelp ? 'Ocultar Ajuda' : 'Ajuda do Tutor IA'}
          </button>
        </div>

        {/* Seções de Dica e Tutor IA específicas para o desafio atual */}
        {showHint && (
          <div className="bg-gradient-subtle border border-primary/20 rounded-lg p-4">
            <h4 className="font-medium text-primary mb-2 flex items-center">
              <span className="mr-2">💡</span>
              Dica
            </h4>
            <p className="text-foreground text-sm leading-relaxed">
              Primeiro calcule quanto sobra após os gastos atuais. Depois determine se é possível atingir ambas as metas (20% para emergência + R$ 450/mês para viagem). Se não for possível, identifique onde cortar gastos.
            </p>
          </div>
        )}

        {showTutorHelp && (
          <div className="bg-gradient-focus border border-primary/20 rounded-lg p-4">
            <h4 className="font-medium text-primary mb-2 flex items-center">
              <span className="mr-2">💡</span>
              Tutor IA
            </h4>
            <p className="text-foreground text-sm leading-relaxed">
              Para resolver este problema, siga estes passos: 1) Calcule a renda disponível após gastos fixos, 2) Determine quanto precisa poupar mensalmente para cada meta, 3) Compare com o que sobra, 4) Se necessário, sugira ajustes nos gastos não-essenciais como lazer.
            </p>
          </div>
        )}

        {/* Caixa de Resposta Grande e Horizontal */}
        <div className="bg-card border border-border rounded-lg p-6 space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Sua Resposta:</h3>
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Escreva sua solução aqui... Detalhe seu raciocínio e os cálculos realizados."
            className="w-full h-40 p-4 border border-border rounded-lg resize-none focus:ring-2 focus:ring-primary focus:border-transparent text-foreground bg-background transition-all duration-200 hover:shadow-md"
          />
          
          {/* Botões de Ação */}
          <div className="flex gap-3">
            <button
              onClick={handleSubmitAnswer}
              className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90 transition-all duration-200 font-medium hover-scale flex items-center gap-2"
            >
              <span>📝</span>
              Enviar Resposta
            </button>
            <button
              onClick={() => {
                setAnswer('');
                setFeedback('');
              }}
              className="px-4 py-2 border border-border text-foreground rounded-lg hover:bg-muted transition-all duration-200 hover-scale"
            >
              Limpar
            </button>
          </div>
        </div>

        {/* Feedback Section */}
        {feedback && (
          <div className="bg-primary border border-primary/20 rounded-lg p-4">
            <h4 className="font-medium text-white mb-2 flex items-center">
              <span className="mr-2">✅</span>
              Feedback da Resposta
            </h4>
            <p className="text-white text-sm leading-relaxed">{feedback}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DailyChallenge;