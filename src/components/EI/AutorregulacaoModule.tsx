import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Heart, 
  Wind,
  Target,
  CheckCircle,
  PlayCircle,
  RefreshCw,
  Brain
} from "lucide-react";

interface AutorregulacaoModuleProps {
  onBack: () => void;
}

const AutorregulacaoModule = ({ onBack }: AutorregulacaoModuleProps) => {
  const [currentActivity, setCurrentActivity] = useState<string | null>(null);
  const [breathingPhase, setBreathingPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [breathingCount, setBreathingCount] = useState(4);
  const [isBreathing, setIsBreathing] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);

  const activities = [
    {
      id: 'breathing_exercise',
      title: 'Respiração Consciente',
      description: 'Aprenda técnicas de respiração para se acalmar',
      icon: <Wind className="w-5 h-5" />,
      isCompleted: false,
      estimatedTime: 8
    },
    {
      id: 'scenario_simulation',
      title: 'Situações Desafiadoras',
      description: 'Pratique como reagir em momentos difíceis',
      icon: <Target className="w-5 h-5" />,
      isCompleted: true,
      estimatedTime: 15
    },
    {
      id: 'thought_redirect',
      title: 'Redirecionamento de Pensamentos',
      description: 'Transforme pensamentos negativos em positivos',
      icon: <Brain className="w-5 h-5" />,
      isCompleted: false,
      estimatedTime: 12
    }
  ];

  const scenarios = [
    {
      id: 'bad_grade',
      title: 'Tirei uma nota ruim na prova',
      situation: 'Você estudou muito para uma prova importante, mas mesmo assim tirou uma nota baixa. Está se sentindo frustrado e desapontado.',
      options: [
        { id: 'option1', text: 'Desisto, não sou bom nisso mesmo', reaction: 'negative' },
        { id: 'option2', text: 'Fico bravo e culpo o professor', reaction: 'negative' },
        { id: 'option3', text: 'Analiso onde errei e busco ajuda', reaction: 'positive' },
        { id: 'option4', text: 'Converso com meus pais sobre como me sinto', reaction: 'positive' }
      ]
    },
    {
      id: 'friend_conflict',
      title: 'Briga com um amigo',
      situation: 'Seu melhor amigo disse algo que te magoou muito na frente de outras pessoas. Você está se sentindo traído e com raiva.',
      options: [
        { id: 'option1', text: 'Paro de falar com ele para sempre', reaction: 'negative' },
        { id: 'option2', text: 'Falo mal dele para outros amigos', reaction: 'negative' },
        { id: 'option3', text: 'Respiro fundo e converso com ele depois', reaction: 'positive' },
        { id: 'option4', text: 'Digo como me senti de forma respeitosa', reaction: 'positive' }
      ]
    }
  ];

  useEffect(() => {
    if (isBreathing) {
      const timer = setInterval(() => {
        setBreathingCount(prev => {
          if (prev === 1) {
            switch (breathingPhase) {
              case 'inhale':
                setBreathingPhase('hold');
                return 4;
              case 'hold':
                setBreathingPhase('exhale');
                return 4;
              case 'exhale':
                setBreathingPhase('inhale');
                return 4;
            }
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isBreathing, breathingPhase]);

  const renderBreathingExercise = () => (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wind className="w-6 h-6 text-blue-500" />
          Exercício de Respiração 4-4-4
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-muted-foreground">
          Esta é uma técnica simples que ajuda a acalmar o sistema nervoso e reduzir o estresse. 
          Siga o ritmo visual e respire junto.
        </p>
        
        <div className="text-center">
          <div className={`w-32 h-32 rounded-full mx-auto mb-6 flex items-center justify-center transition-all duration-1000 ${
            breathingPhase === 'inhale' ? 'bg-blue-300 scale-110' :
            breathingPhase === 'hold' ? 'bg-yellow-300 scale-100' :
            'bg-green-300 scale-90'
          }`}>
            <div className="text-white text-2xl font-bold">{breathingCount}</div>
          </div>
          
          <div className="space-y-2">
            <div className="text-2xl font-bold">
              {breathingPhase === 'inhale' ? 'Inspire' :
               breathingPhase === 'hold' ? 'Segure' :
               'Expire'}
            </div>
            <div className="text-muted-foreground">
              {breathingPhase === 'inhale' ? 'Puxe o ar pelo nariz lentamente' :
               breathingPhase === 'hold' ? 'Mantenha o ar nos pulmões' :
               'Solte o ar pela boca devagar'}
            </div>
          </div>
        </div>
        
        <div className="flex justify-center gap-4">
          <Button
            onClick={() => setIsBreathing(!isBreathing)}
            variant={isBreathing ? 'destructive' : 'learning'}
          >
            {isBreathing ? 'Pausar' : 'Começar'}
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setIsBreathing(false);
              setBreathingPhase('inhale');
              setBreathingCount(4);
            }}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Reiniciar
          </Button>
        </div>
        
        <div className="bg-blue-50 rounded-lg p-4">
          <h4 className="font-semibold text-blue-800 mb-2">💡 Dica:</h4>
          <p className="text-sm text-blue-700">
            Pratique este exercício sempre que se sentir nervoso, ansioso ou estressado. 
            Apenas 2-3 minutos podem fazer uma grande diferença no seu estado emocional!
          </p>
        </div>
        
        <Button className="w-full" variant="learning">
          <CheckCircle className="w-4 h-4 mr-2" />
          Concluir Exercício
        </Button>
      </CardContent>
    </Card>
  );

  const renderScenarioSimulation = () => {
    const currentScenario = scenarios.find(s => s.id === selectedScenario);
    
    if (!currentScenario) {
      return (
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-6 h-6 text-orange-500" />
              Escolha uma Situação para Praticar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {scenarios.map((scenario) => (
                <Card 
                  key={scenario.id}
                  className="cursor-pointer hover:shadow-md transition-shadow border-2 border-transparent hover:border-primary"
                  onClick={() => setSelectedScenario(scenario.id)}
                >
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2">{scenario.title}</h3>
                    <p className="text-sm text-muted-foreground">{scenario.situation}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-6 h-6 text-orange-500" />
            {currentScenario.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-orange-50 rounded-lg p-4 border-l-4 border-orange-400">
            <h4 className="font-semibold text-orange-800 mb-2">📖 Situação:</h4>
            <p className="text-orange-700">{currentScenario.situation}</p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Como você reagiria? Escolha a melhor opção:</h4>
            <div className="space-y-3">
              {currentScenario.options.map((option) => (
                <Card 
                  key={option.id}
                  className="cursor-pointer hover:shadow-md transition-all"
                  onClick={() => {}}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-sm ${
                        option.reaction === 'positive' ? 'bg-green-500' : 'bg-red-500'
                      }`}>
                        {option.reaction === 'positive' ? '✓' : '✗'}
                      </div>
                      <p className="text-sm">{option.text}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          
          <div className="bg-green-50 rounded-lg p-4">
            <h4 className="font-semibold text-green-800 mb-2">🌟 Estratégias de Autorregulação:</h4>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• Pause e respire antes de reagir</li>
              <li>• Identifique o que você está sentindo</li>
              <li>• Pense nas consequências das suas ações</li>
              <li>• Escolha uma resposta, não uma reação impulsiva</li>
            </ul>
          </div>
          
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={() => setSelectedScenario(null)}
            >
              Voltar aos Cenários
            </Button>
            <Button variant="learning">
              Próximo Cenário
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  const completedCount = activities.filter(a => a.isCompleted).length;
  const progressPercentage = (completedCount / activities.length) * 100;

  if (currentActivity) {
    return (
      <div className="min-h-screen bg-gradient-subtle">
        <div className="max-w-4xl mx-auto p-6">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="outline" onClick={() => setCurrentActivity(null)}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                {activities.find(a => a.id === currentActivity)?.title}
              </h1>
            </div>
          </div>

          {currentActivity === 'breathing_exercise' && renderBreathingExercise()}
          {currentActivity === 'scenario_simulation' && renderScenarioSimulation()}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-foreground">Autorregulação Emocional</h1>
            <p className="text-muted-foreground">Desenvolva o controle das suas emoções</p>
          </div>
        </div>

        {/* Progresso */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-foreground">Seu Progresso</h2>
              <Badge variant="secondary">{completedCount}/{activities.length} concluídas</Badge>
            </div>
            <Progress value={progressPercentage} className="h-3 mb-2" />
            <p className="text-sm text-muted-foreground">
              Continue praticando para melhorar sua autorregulação emocional
            </p>
          </CardContent>
        </Card>

        {/* Conceito */}
        <Card className="mb-8 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800">
              <Heart className="w-6 h-6" />
              O que é Autorregulação Emocional?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-green-700 mb-4">
              A autorregulação é a capacidade de gerenciar suas emoções e comportamentos de forma consciente e positiva. 
              É como ter um "botão de pausa" interno antes de agir.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/80 rounded-lg p-4">
                <h4 className="font-semibold text-green-800 mb-2">Benefícios:</h4>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• Menos conflitos e discussões</li>
                  <li>• Melhores decisões</li>
                  <li>• Relacionamentos mais saudáveis</li>
                  <li>• Maior bem-estar pessoal</li>
                </ul>
              </div>
              <div className="bg-white/80 rounded-lg p-4">
                <h4 className="font-semibold text-green-800 mb-2">Técnicas principais:</h4>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• Respiração consciente</li>
                  <li>• Pausa antes de reagir</li>
                  <li>• Redirecionamento de pensamentos</li>
                  <li>• Busca por perspectivas diferentes</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Atividades */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-6 h-6 text-primary" />
              Atividades Práticas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activities.map((activity) => (
                <Card key={activity.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {activity.icon}
                        {activity.isCompleted && (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        )}
                      </div>
                      <Badge variant={activity.isCompleted ? "secondary" : "outline"}>
                        {activity.estimatedTime} min
                      </Badge>
                    </div>
                    
                    <h3 className="font-semibold mb-2">{activity.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{activity.description}</p>
                    
                    <Button 
                      variant={activity.isCompleted ? "outline" : "learning"}
                      className="w-full"
                      onClick={() => setCurrentActivity(activity.id)}
                    >
                      {activity.isCompleted ? (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Revisar
                        </>
                      ) : (
                        <>
                          <PlayCircle className="w-4 h-4 mr-2" />
                          Começar
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AutorregulacaoModule;