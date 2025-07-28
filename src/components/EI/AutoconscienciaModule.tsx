import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  ArrowLeft, 
  Brain, 
  Heart,
  BookOpen,
  CheckCircle,
  PlayCircle,
  PenTool,
  Lightbulb
} from "lucide-react";

interface AutoconscienciaModuleProps {
  onBack: () => void;
}

type ActivityType = 'quiz' | 'reflection' | 'diary' | 'emotion_naming';

interface Activity {
  id: string;
  title: string;
  type: ActivityType;
  description: string;
  icon: React.ReactNode;
  isCompleted: boolean;
  estimatedTime: number;
}

const AutoconscienciaModule = ({ onBack }: AutoconscienciaModuleProps) => {
  const [currentActivity, setCurrentActivity] = useState<string | null>(null);
  const [emotionDiary, setEmotionDiary] = useState('');
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);

  const activities: Activity[] = [
    {
      id: 'emotion_quiz_1',
      title: 'Quiz: Reconhecendo Emoções',
      type: 'quiz',
      description: 'Identifique emoções através de expressões faciais e situações',
      icon: <Brain className="w-5 h-5" />,
      isCompleted: true,
      estimatedTime: 10
    },
    {
      id: 'emotion_naming',
      title: 'Como Estou Me Sentindo Agora?',
      type: 'emotion_naming',
      description: 'Pratique nomear suas emoções do momento presente',
      icon: <Heart className="w-5 h-5" />,
      isCompleted: true,
      estimatedTime: 5
    },
    {
      id: 'emotion_diary',
      title: 'Diário Emocional',
      type: 'diary',
      description: 'Registre suas emoções e reflita sobre elas',
      icon: <PenTool className="w-5 h-5" />,
      isCompleted: false,
      estimatedTime: 15
    },
    {
      id: 'emotion_triggers',
      title: 'Identificando Gatilhos Emocionais',
      type: 'reflection',
      description: 'Descubra o que desperta suas diferentes emoções',
      icon: <Lightbulb className="w-5 h-5" />,
      isCompleted: false,
      estimatedTime: 12
    }
  ];

  const emotions = [
    { name: 'Feliz', emoji: '😊', color: 'bg-yellow-200' },
    { name: 'Triste', emoji: '😢', color: 'bg-blue-200' },
    { name: 'Bravo', emoji: '😠', color: 'bg-red-200' },
    { name: 'Ansioso', emoji: '😰', color: 'bg-purple-200' },
    { name: 'Calmo', emoji: '😌', color: 'bg-green-200' },
    { name: 'Animado', emoji: '🤩', color: 'bg-orange-200' },
    { name: 'Confuso', emoji: '😕', color: 'bg-gray-200' },
    { name: 'Orgulhoso', emoji: '😊', color: 'bg-pink-200' }
  ];

  const completedCount = activities.filter(a => a.isCompleted).length;
  const progressPercentage = (completedCount / activities.length) * 100;

  const renderEmotionNamingActivity = () => (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="w-6 h-6 text-red-500" />
          Como Estou Me Sentindo Agora?
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-muted-foreground">
          Pare um momento e perceba como você está se sentindo neste exato momento. 
          Escolha a emoção que melhor descreve seu estado atual:
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {emotions.map((emotion) => (
            <div
              key={emotion.name}
              className={`${emotion.color} rounded-lg p-4 cursor-pointer transition-all hover:scale-105 border-2 ${
                selectedEmotion === emotion.name ? 'border-primary' : 'border-transparent'
              }`}
              onClick={() => setSelectedEmotion(emotion.name)}
            >
              <div className="text-center">
                <div className="text-3xl mb-2">{emotion.emoji}</div>
                <p className="text-sm font-medium">{emotion.name}</p>
              </div>
            </div>
          ))}
        </div>
        
        {selectedEmotion && (
          <div className="bg-gradient-subtle rounded-lg p-4">
            <h4 className="font-semibold mb-2">Muito bem! Você escolheu: {selectedEmotion}</h4>
            <p className="text-sm text-muted-foreground mb-3">
              Agora reflita: O que pode ter contribuído para você se sentir assim hoje?
            </p>
            <Textarea 
              placeholder="Escreva sobre o que pode ter influenciado este sentimento..."
              className="min-h-24"
            />
            <Button className="mt-3" variant="learning">
              Registrar Reflexão
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );

  const renderDiaryActivity = () => (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PenTool className="w-6 h-6 text-purple-500" />
          Diário Emocional - Hoje
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-muted-foreground">
          Use este espaço para registrar como foi seu dia emocionalmente. 
          Não existem respostas certas ou erradas - apenas sua experiência única.
        </p>
        
        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Como foi meu dia hoje?</h4>
            <div className="flex gap-2 mb-3">
              {['😢', '😐', '🙂', '😊', '🤩'].map((emoji, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="text-2xl h-12 w-12"
                  onClick={() => {}}
                >
                  {emoji}
                </Button>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-2">O que senti hoje?</h4>
            <Textarea
              placeholder="Conte sobre suas emoções, momentos marcantes, o que te deixou feliz ou preocupado..."
              value={emotionDiary}
              onChange={(e) => setEmotionDiary(e.target.value)}
              className="min-h-32"
            />
          </div>
          
          <div>
            <h4 className="font-medium mb-2">Gratidão do dia</h4>
            <Textarea
              placeholder="Pelo que você é grato hoje? Mesmo nas coisas pequenas..."
              className="min-h-20"
            />
          </div>
        </div>
        
        <Button className="w-full" variant="learning">
          <CheckCircle className="w-4 h-4 mr-2" />
          Salvar no Meu Diário
        </Button>
      </CardContent>
    </Card>
  );

  const renderReflectionActivity = () => (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="w-6 h-6 text-yellow-500" />
          Identificando Gatilhos Emocionais
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-muted-foreground">
          Gatilhos emocionais são situações, pessoas ou pensamentos que despertam emoções fortes em nós. 
          Identificá-los é o primeiro passo para ter mais controle emocional.
        </p>
        
        <div className="space-y-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 mb-3">🔍 Situações que me deixam feliz:</h4>
            <Textarea
              placeholder="Ex: Quando alguém me elogia, quando consigo resolver um problema difícil..."
              className="bg-white"
            />
          </div>
          
          <div className="bg-red-50 rounded-lg p-4">
            <h4 className="font-semibold text-red-800 mb-3">⚡ Situações que me irritam:</h4>
            <Textarea
              placeholder="Ex: Quando não me escutam, quando as coisas não saem como planejei..."
              className="bg-white"
            />
          </div>
          
          <div className="bg-purple-50 rounded-lg p-4">
            <h4 className="font-semibold text-purple-800 mb-3">😰 Situações que me deixam ansioso:</h4>
            <Textarea
              placeholder="Ex: Antes de apresentações, quando tenho muitas tarefas para fazer..."
              className="bg-white"
            />
          </div>
        </div>
        
        <div className="bg-gradient-subtle rounded-lg p-4">
          <h4 className="font-semibold mb-2">💡 Dica para Casa:</h4>
          <p className="text-sm text-muted-foreground">
            Durante a próxima semana, observe quando você sente emoções intensas e anote: 
            "O que estava acontecendo quando me senti assim?" Isso te ajudará a conhecer melhor seus padrões emocionais.
          </p>
        </div>
        
        <Button className="w-full" variant="learning">
          Concluir Atividade
        </Button>
      </CardContent>
    </Card>
  );

  if (currentActivity) {
    const activity = activities.find(a => a.id === currentActivity);
    if (!activity) return null;

    return (
      <div className="min-h-screen bg-gradient-subtle">
        <div className="max-w-4xl mx-auto p-6">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="outline" onClick={() => setCurrentActivity(null)}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">{activity.title}</h1>
              <p className="text-muted-foreground">Tempo estimado: {activity.estimatedTime} minutos</p>
            </div>
          </div>

          {activity.type === 'emotion_naming' && renderEmotionNamingActivity()}
          {activity.type === 'diary' && renderDiaryActivity()}
          {activity.type === 'reflection' && renderReflectionActivity()}
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
            <h1 className="text-3xl font-bold text-foreground">Autoconsciência Emocional</h1>
            <p className="text-muted-foreground">Aprenda a reconhecer e nomear suas emoções</p>
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
              Continue praticando para desenvolver sua autoconsciência emocional
            </p>
          </CardContent>
        </Card>

        {/* Conceito */}
        <Card className="mb-8 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <Brain className="w-6 h-6" />
              O que é Autoconsciência Emocional?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-blue-700 mb-4">
              A autoconsciência emocional é a habilidade de reconhecer e compreender suas próprias emoções. 
              É como ter um "radar emocional" interno que te ajuda a entender o que você está sentindo e por quê.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/80 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-2">Por que é importante?</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Ajuda a tomar melhores decisões</li>
                  <li>• Melhora relacionamentos</li>
                  <li>• Reduz conflitos internos</li>
                  <li>• Aumenta a autoestima</li>
                </ul>
              </div>
              <div className="bg-white/80 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-2">Como desenvolver?</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Praticar mindfulness</li>
                  <li>• Manter um diário emocional</li>
                  <li>• Refletir sobre situações</li>
                  <li>• Nomear emoções específicas</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Atividades */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-primary" />
              Atividades Práticas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

export default AutoconscienciaModule;