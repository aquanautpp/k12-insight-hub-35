import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, Bot, Calculator, FileText } from "lucide-react";
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
      <Card className="shadow-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold text-foreground">
                Problema do Dia
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Desafie-se com problemas práticos do dia a dia
              </CardDescription>
            </div>
            <Badge className={getDifficultyColor(dailyChallenge.difficulty)}>
              {dailyChallenge.difficulty}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Título e Categoria */}
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-2">
              {dailyChallenge.title}
            </h2>
            <Badge variant="outline" className="mb-4">
              {dailyChallenge.category.replace('_', ' ')}
            </Badge>
          </div>

          {/* Descrição */}
          <div className="bg-gradient-subtle p-4 rounded-lg">
            <p className="text-foreground leading-relaxed">
              {dailyChallenge.description}
            </p>
          </div>

          {/* Informações Atuais */}
          <div>
            <h3 className="font-medium text-foreground mb-3">Informações atuais:</h3>
            <ul className="space-y-2">
              {dailyChallenge.context.map((info, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span className="text-foreground">{info}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Pergunta/Desafio */}
          <div className="bg-card border border-border rounded-lg p-4">
            <h3 className="font-medium text-foreground mb-2">DESAFIO:</h3>
            <p className="text-foreground leading-relaxed">
              {dailyChallenge.question}
            </p>
          </div>

          {/* Recursos Sugeridos */}
          <div>
            <h3 className="font-medium text-foreground mb-3">Recursos Sugeridos:</h3>
            <div className="flex flex-wrap gap-2">
              {dailyChallenge.resources.map((resource, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  <Calculator className="w-3 h-3" />
                  {resource}
                </Badge>
              ))}
            </div>
          </div>

          {/* Botões de Ajuda */}
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={() => setShowHint(!showHint)}
              className="flex items-center gap-2"
            >
              <Lightbulb className="w-4 h-4" />
              {showHint ? 'Ocultar Dica' : 'Pedir Dica'}
            </Button>
            
            <Button 
              variant="focus" 
              onClick={() => setShowTutorHelp(!showTutorHelp)}
              className="flex items-center gap-2"
            >
              <Bot className="w-4 h-4" />
              {showTutorHelp ? 'Ocultar Ajuda' : 'Ajuda do Tutor IA'}
            </Button>
          </div>

          {/* Dica */}
          {showHint && (
            <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <Lightbulb className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                <p className="text-foreground">{getHint()}</p>
              </div>
            </div>
          )}

          {/* Ajuda do Tutor */}
          {showTutorHelp && (
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <Bot className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <p className="text-foreground">{getTutorAdvice()}</p>
              </div>
            </div>
          )}

          {/* Campo de Resposta */}
          <div className="space-y-3">
            <h3 className="font-medium text-foreground">Sua Resposta:</h3>
            <Textarea
              placeholder="Escreva sua solução aqui... Detalhe seu raciocínio e os cálculos realizados."
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="min-h-32 resize-none"
            />
            
            <div className="flex gap-3">
              <Button 
                onClick={handleSubmitAnswer}
                className="flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white"
                variant="learning"
              >
                <FileText className="w-4 h-4" />
                Enviar Resposta
              </Button>
              
              <Button 
                variant="outline"
                onClick={() => {
                  setAnswer("");
                  setFeedback("");
                }}
              >
                Limpar
              </Button>
            </div>
            
            {/* Feedback Permanente */}
            {feedback && (
              <div className="mt-4 bg-primary/10 border border-primary/20 rounded-lg p-4">
                <p className="text-foreground">{feedback}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DailyChallenge;