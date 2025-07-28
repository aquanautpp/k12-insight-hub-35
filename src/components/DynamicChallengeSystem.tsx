import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { 
  Calculator, 
  Brain, 
  Target, 
  Clock, 
  Star, 
  Lightbulb, 
  Zap,
  RefreshCw,
  Trophy
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Challenge {
  id: string;
  title: string;
  category: 'mathematics' | 'logic' | 'creativity' | 'daily_life' | 'emotional';
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  description: string;
  problem: string;
  hints: string[];
  solution: string;
  xpReward: number;
  timeLimit?: number; // em minutos
  unlockLevel: number;
}

interface DynamicChallengeSystemProps {
  userLevel: number;
  userPreferences: string[];
  completedChallenges: string[];
  onChallengeComplete: (challengeId: string, solution: string, timeSpent: number) => void;
}

const DynamicChallengeSystem: React.FC<DynamicChallengeSystemProps> = ({
  userLevel,
  userPreferences,
  completedChallenges,
  onChallengeComplete
}) => {
  const [currentChallenge, setCurrentChallenge] = useState<Challenge | null>(null);
  const [userSolution, setUserSolution] = useState('');
  const [hintsUsed, setHintsUsed] = useState(0);
  const [timeSpent, setTimeSpent] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const { toast } = useToast();

  // Base de desafios dinâmicos
  const challengePool: Challenge[] = [
    {
      id: 'math_001',
      title: 'Orçamento Inteligente',
      category: 'mathematics',
      difficulty: 'intermediate',
      description: 'Resolva um problema de gestão financeira pessoal',
      problem: 'João ganha R$ 3.000 mensais. Ele gasta 40% com moradia, 25% com alimentação, 15% com transporte. Quer economizar R$ 600 por mês. É possível? Se não, quanto precisa cortar dos gastos?',
      hints: [
        'Calcule primeiro todos os gastos atuais',
        'Verifique quanto sobra após os gastos',
        'Compare com a meta de economia'
      ],
      solution: 'Gastos: R$ 1.200 (moradia) + R$ 750 (alimentação) + R$ 450 (transporte) = R$ 2.400. Sobra: R$ 600. Como quer economizar R$ 600, ele consegue exatamente atingir a meta sem cortes.',
      xpReward: 150,
      timeLimit: 15,
      unlockLevel: 1
    },
    {
      id: 'logic_001', 
      title: 'Padrão de Sequência',
      category: 'logic',
      difficulty: 'intermediate',
      description: 'Encontre o padrão e complete a sequência',
      problem: 'Complete a sequência: 2, 6, 12, 20, 30, ?',
      hints: [
        'Observe as diferenças entre os números',
        'As diferenças formam uma sequência',
        'Diferenças: 4, 6, 8, 10...'
      ],
      solution: '42. A sequência são números da forma n(n+1), onde n = 1,2,3,4,5,6. Próximo seria 6×7 = 42.',
      xpReward: 120,
      timeLimit: 10,
      unlockLevel: 3
    },
    {
      id: 'creativity_001',
      title: 'Solução Criativa',
      category: 'creativity',
      difficulty: 'advanced',
      description: 'Use criatividade para resolver um problema prático',
      problem: 'Você tem 3 jarros: um de 8L, um de 5L e um de 3L. Como medir exatamente 4L usando apenas esses jarros?',
      hints: [
        'Você pode encher, esvaziar e transferir água entre jarros',
        'Comece enchendo o jarro de 8L',
        'Use o jarro de 5L como intermediário'
      ],
      solution: '1) Encha o jarro de 8L. 2) Transfira para o de 5L (sobram 3L no de 8L). 3) Transfira os 5L para o jarro de 3L (sobram 2L no de 5L). 4) Esvazie o de 3L e coloque os 2L do jarro de 5L nele. 5) Encha novamente o de 5L do jarro de 8L (que agora tem 3L, então o de 5L ficará com 3L). 6) Complete o jarro de 3L com os 2L já nele (usa 1L do jarro de 5L). Sobram 4L no jarro de 5L.',
      xpReward: 200,
      timeLimit: 20,
      unlockLevel: 5
    },
    {
      id: 'daily_001',
      title: 'Otimização de Tempo',
      category: 'daily_life',
      difficulty: 'beginner',
      description: 'Organize seu dia de forma eficiente',
      problem: 'Você tem 8 horas livres e precisa: estudar (3h), exercitar-se (1h), preparar refeições (1.5h), tempo social (2h), e relaxar. Como distribuiria o tempo restante? Justifique sua escolha.',
      hints: [
        'Some primeiro as atividades obrigatórias',
        'Calcule quanto tempo sobra',
        'Considere a importância do relaxamento'
      ],
      solution: 'Atividades definidas: 3h + 1h + 1.5h + 2h = 7.5h. Sobra 0.5h (30 min) para relaxar. Sugestão: reserve mais tempo para relaxamento reduzindo o tempo social para 1.5h, deixando 1h para relaxar.',
      xpReward: 100,
      timeLimit: 12,
      unlockLevel: 1
    },
    {
      id: 'emotional_001',
      title: 'Gestão de Conflitos',
      category: 'emotional',
      difficulty: 'intermediate',
      description: 'Resolva uma situação de conflito interpessoal',
      problem: 'Dois colegas de trabalho estão em conflito sobre a abordagem de um projeto. Um prefere rapidez, outro qualidade. Como mediador, que estratégia você usaria?',
      hints: [
        'Identifique os pontos em comum',
        'Considere uma abordagem híbrida',
        'Foque nos objetivos do projeto'
      ],
      solution: 'Estratégia: 1) Reunir ambos para ouvir suas perspectivas. 2) Identificar que ambos querem o sucesso do projeto. 3) Propor fases: início com foco na qualidade (fundação sólida), depois acelerar com base estabelecida. 4) Definir marcos claros combinando qualidade e prazo. 5) Atribuir responsabilidades que aproveitem os pontos fortes de cada um.',
      xpReward: 180,
      timeLimit: 18,
      unlockLevel: 7
    }
  ];

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && currentChallenge) {
      interval = setInterval(() => {
        setTimeSpent(time => time + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, currentChallenge]);

  // Gerar desafio baseado no nível e preferências
  const generateChallenge = () => {
    const availableChallenges = challengePool.filter(challenge => 
      challenge.unlockLevel <= userLevel &&
      !completedChallenges.includes(challenge.id)
    );

    if (availableChallenges.length === 0) {
      toast({
        title: "Parabéns!",
        description: "Você completou todos os desafios disponíveis no seu nível!",
      });
      return;
    }

    // Priorizar desafios baseados nas preferências do usuário
    let selectedChallenge;
    const preferredChallenges = availableChallenges.filter(challenge =>
      userPreferences.includes(challenge.category)
    );

    if (preferredChallenges.length > 0) {
      selectedChallenge = preferredChallenges[Math.floor(Math.random() * preferredChallenges.length)];
    } else {
      selectedChallenge = availableChallenges[Math.floor(Math.random() * availableChallenges.length)];
    }

    setCurrentChallenge(selectedChallenge);
    setUserSolution('');
    setHintsUsed(0);
    setTimeSpent(0);
    setIsActive(true);
    setShowHint(false);
    setShowSolution(false);
  };

  const submitSolution = () => {
    if (!currentChallenge || !userSolution.trim()) return;

    setIsActive(false);
    onChallengeComplete(currentChallenge.id, userSolution, timeSpent);
    
    // Calcular XP baseado em performance
    let finalXP = currentChallenge.xpReward;
    if (hintsUsed === 0) finalXP *= 1.2; // Bonus por não usar hints
    if (currentChallenge.timeLimit && timeSpent < currentChallenge.timeLimit * 60 * 0.7) {
      finalXP *= 1.1; // Bonus por velocidade
    }

    toast({
      title: "Desafio Concluído!",
      description: `Você ganhou ${Math.round(finalXP)} XP!`,
    });
  };

  const useHint = () => {
    if (hintsUsed < currentChallenge!.hints.length) {
      setHintsUsed(prev => prev + 1);
      setShowHint(true);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-500';
      case 'intermediate': return 'bg-yellow-500';
      case 'advanced': return 'bg-orange-500';
      case 'expert': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'mathematics': return <Calculator className="w-4 h-4" />;
      case 'logic': return <Brain className="w-4 h-4" />;
      case 'creativity': return <Lightbulb className="w-4 h-4" />;
      case 'daily_life': return <Target className="w-4 h-4" />;
      case 'emotional': return <Star className="w-4 h-4" />;
      default: return <Zap className="w-4 h-4" />;
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!currentChallenge) {
    return (
      <Card className="p-6 text-center">
        <div className="space-y-4">
          <Trophy className="w-16 h-16 mx-auto text-gold-500" />
          <h3 className="text-xl font-bold">Desafios Dinâmicos</h3>
          <p className="text-muted-foreground">
            Desafios adaptativos baseados no seu nível e preferências
          </p>
          <Button onClick={generateChallenge} className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            Gerar Novo Desafio
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="shadow-learning">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 ${getDifficultyColor(currentChallenge.difficulty)} rounded-lg flex items-center justify-center text-white`}>
                {getCategoryIcon(currentChallenge.category)}
              </div>
              <div>
                <CardTitle className="text-lg">{currentChallenge.title}</CardTitle>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline">{currentChallenge.category}</Badge>
                  <Badge className={getDifficultyColor(currentChallenge.difficulty) + " text-white"}>
                    {currentChallenge.difficulty}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                {formatTime(timeSpent)}
              </div>
              <div className="text-green-600 font-semibold">
                +{currentChallenge.xpReward} XP
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-muted-foreground">{currentChallenge.description}</p>
          
          <div className="bg-gradient-subtle p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Problema:</h4>
            <p className="text-foreground">{currentChallenge.problem}</p>
          </div>

          {currentChallenge.timeLimit && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Tempo Limite</span>
                <span>{currentChallenge.timeLimit} minutos</span>
              </div>
              <Progress 
                value={(timeSpent / (currentChallenge.timeLimit * 60)) * 100} 
                className="h-2"
              />
            </div>
          )}

          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={useHint}
              disabled={hintsUsed >= currentChallenge.hints.length}
              className="flex items-center gap-1"
            >
              <Lightbulb className="w-4 h-4" />
              Dica ({hintsUsed}/{currentChallenge.hints.length})
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowSolution(!showSolution)}
              className="flex items-center gap-1"
            >
              <Target className="w-4 h-4" />
              Ver Solução
            </Button>
          </div>

          {showHint && hintsUsed > 0 && (
            <div className="bg-accent/10 border border-accent/20 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <Lightbulb className="w-4 h-4 text-accent mt-0.5" />
                <p className="text-sm">{currentChallenge.hints[hintsUsed - 1]}</p>
              </div>
            </div>
          )}

          {showSolution && (
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-3">
              <h5 className="font-semibold mb-2">Solução:</h5>
              <p className="text-sm">{currentChallenge.solution}</p>
            </div>
          )}

          <div className="space-y-3">
            <h4 className="font-semibold">Sua Solução:</h4>
            <Textarea
              placeholder="Descreva sua abordagem e solução..."
              value={userSolution}
              onChange={(e) => setUserSolution(e.target.value)}
              className="min-h-24"
            />
            
            <div className="flex gap-2">
              <Button 
                onClick={submitSolution}
                disabled={!userSolution.trim()}
                className="flex items-center gap-2"
              >
                <Trophy className="w-4 h-4" />
                Enviar Solução
              </Button>
              
              <Button 
                variant="outline" 
                onClick={generateChallenge}
                className="flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Novo Desafio
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DynamicChallengeSystem;