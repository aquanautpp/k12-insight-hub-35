import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  ArrowLeft, 
  Target, 
  Trophy,
  Calendar,
  CheckCircle,
  PlayCircle,
  Plus,
  Star,
  TrendingUp
} from "lucide-react";

interface AutomotivacaoModuleProps {
  onBack: () => void;
}

const AutomotivacaoModule = ({ onBack }: AutomotivacaoModuleProps) => {
  const [currentActivity, setCurrentActivity] = useState<string | null>(null);
  const [newGoal, setNewGoal] = useState('');
  const [goals, setGoals] = useState([
    { id: 1, text: 'Melhorar minhas notas em matemática', completed: false, progress: 60 },
    { id: 2, text: 'Fazer novos amigos na escola', completed: true, progress: 100 },
    { id: 3, text: 'Aprender a tocar violão', completed: false, progress: 30 }
  ]);

  const activities = [
    {
      id: 'goal_setting',
      title: 'Definindo Metas Pessoais',
      description: 'Aprenda a criar metas realistas e motivadoras',
      icon: <Target className="w-5 h-5" />,
      isCompleted: false,
      estimatedTime: 12
    },
    {
      id: 'resilience_stories',
      title: 'Histórias de Superação',
      description: 'Inspire-se com histórias reais de perseverança',
      icon: <Trophy className="w-5 h-5" />,
      isCompleted: true,
      estimatedTime: 10
    },
    {
      id: 'emotional_timeline',
      title: 'Linha do Tempo Emocional',
      description: 'Reflita sobre momentos de persistência em sua vida',
      icon: <Calendar className="w-5 h-5" />,
      isCompleted: false,
      estimatedTime: 15
    }
  ];

  const inspirationalStories = [
    {
      id: 1,
      title: 'Maria e o Sonho da Medicina',
      story: 'Maria sempre sonhou em ser médica, mas vinha de uma família simples. Estudou muito, trabalhou para pagar os estudos e enfrentou várias reprovações em vestibulares. Hoje, ela é pediatra e ajuda crianças todos os dias.',
      lesson: 'A persistência e o trabalho duro podem transformar sonhos em realidade.',
      questions: [
        'O que você acha que motivou Maria a continuar tentando?',
        'Que obstáculos você já superou em sua vida?',
        'Como você se sente quando enfrenta dificuldades?'
      ]
    },
    {
      id: 2,
      title: 'João e a Superação da Timidez',
      story: 'João era muito tímido e tinha medo de falar em público. Ele decidiu que queria mudar e começou pequeno: falando mais na sala de aula, participando de grupos, praticando em casa. Hoje ele é líder estudantil.',
      lesson: 'Pequenos passos consistentes levam a grandes transformações.',
      questions: [
        'Como João conseguiu vencer sua timidez?',
        'Que pequenos passos você poderia dar para alcançar seus objetivos?',
        'O que significa persistência para você?'
      ]
    }
  ];

  const renderGoalSetting = () => (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="w-6 h-6 text-green-500" />
          Definindo Metas Pessoais
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-muted-foreground">
          Metas bem definidas são como um mapa que nos guia rumo ao sucesso. 
          Vamos criar metas que sejam específicas, possíveis de alcançar e motivadoras para você.
        </p>
        
        {/* Minhas Metas Atuais */}
        <div>
          <h4 className="font-semibold mb-3">🎯 Minhas Metas Atuais:</h4>
          <div className="space-y-3">
            {goals.map((goal) => (
              <Card key={goal.id} className="border-l-4 border-l-primary">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-sm ${goal.completed ? 'line-through text-muted-foreground' : ''}`}>
                      {goal.text}
                    </span>
                    {goal.completed ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <Badge variant="outline">{goal.progress}%</Badge>
                    )}
                  </div>
                  {!goal.completed && (
                    <Progress value={goal.progress} className="h-2" />
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        
        {/* Adicionar Nova Meta */}
        <div className="bg-blue-50 rounded-lg p-4">
          <h4 className="font-semibold text-blue-800 mb-3">➕ Adicionar Nova Meta:</h4>
          <div className="space-y-3">
            <Input
              placeholder="Ex: Aprender a tocar piano, Melhorar em educação física..."
              value={newGoal}
              onChange={(e) => setNewGoal(e.target.value)}
            />
            <Button 
              onClick={() => {
                if (newGoal.trim()) {
                  setGoals([...goals, { 
                    id: goals.length + 1, 
                    text: newGoal, 
                    completed: false, 
                    progress: 0 
                  }]);
                  setNewGoal('');
                }
              }}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Meta
            </Button>
          </div>
        </div>
        
        {/* Dicas para Metas Eficazes */}
        <div className="bg-yellow-50 rounded-lg p-4">
          <h4 className="font-semibold text-yellow-800 mb-2">💡 Dicas para Metas Eficazes:</h4>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• <strong>Específica:</strong> "Melhorar em matemática" → "Tirar nota 8 na próxima prova de matemática"</li>
            <li>• <strong>Possível:</strong> Escolha algo desafiador, mas que você consegue alcançar</li>
            <li>• <strong>Com prazo:</strong> "Este mês", "até as férias", "no próximo semestre"</li>
            <li>• <strong>Dividida:</strong> Quebre metas grandes em pequenos passos</li>
          </ul>
        </div>
        
        <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
          <CheckCircle className="w-4 h-4 mr-2" />
          Salvar Minhas Metas
        </Button>
      </CardContent>
    </Card>
  );

  const renderResilienceStories = () => (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-6 h-6 text-gold-500" />
          Histórias de Superação
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-muted-foreground">
          Essas histórias mostram como a persistência e a motivação podem nos ajudar a superar qualquer obstáculo. 
          Que tal se inspirar e refletir sobre sua própria jornada?
        </p>
        
        {inspirationalStories.map((story, index) => (
          <Card key={story.id} className="border-l-4 border-l-gold">
            <CardContent className="p-6">
              <h3 className="text-lg font-bold text-gold-700 mb-3">{story.title}</h3>
              
              <div className="bg-gold-50 rounded-lg p-4 mb-4">
                <p className="text-gold-800 text-sm leading-relaxed">{story.story}</p>
              </div>
              
              <div className="bg-green-50 rounded-lg p-3 mb-4">
                <h4 className="font-semibold text-green-800 mb-1">🌟 Lição Aprendida:</h4>
                <p className="text-sm text-green-700">{story.lesson}</p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3">💭 Reflexões:</h4>
                <div className="space-y-3">
                  {story.questions.map((question, qIndex) => (
                    <div key={qIndex}>
                      <p className="text-sm font-medium text-muted-foreground mb-2">{question}</p>
                      <Textarea 
                        placeholder="Escreva sua reflexão aqui..."
                        className="min-h-20 text-sm"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
          <Star className="w-4 h-4 mr-2" />
          Salvar Minhas Reflexões
        </Button>
      </CardContent>
    </Card>
  );

  const renderEmotionalTimeline = () => (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-6 h-6 text-purple-500" />
          Minha Linha do Tempo de Superação
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-muted-foreground">
          Todos nós já enfrentamos desafios e os superamos. Esta atividade te ajuda a lembrar 
          de momentos em que você foi persistente e alcançou seus objetivos.
        </p>
        
        <div className="space-y-6">
          <div className="bg-purple-50 rounded-lg p-4">
            <h4 className="font-semibold text-purple-800 mb-3">🌟 Quando eu era pequeno(a):</h4>
            <p className="text-sm text-purple-600 mb-2">
              Pense em algo que foi difícil no começo, mas você não desistiu (ex: aprender a andar de bicicleta, ler, nadar...)
            </p>
            <Textarea 
              placeholder="Conte sobre esse momento de superação..."
              className="bg-white"
            />
          </div>
          
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 mb-3">📚 Na escola:</h4>
            <p className="text-sm text-blue-600 mb-2">
              Alguma matéria que era difícil mas você melhorou? Um projeto desafiador que completou?
            </p>
            <Textarea 
              placeholder="Descreva esse desafio escolar que você superou..."
              className="bg-white"
            />
          </div>
          
          <div className="bg-green-50 rounded-lg p-4">
            <h4 className="font-semibold text-green-800 mb-3">👥 Com amigos/família:</h4>
            <p className="text-sm text-green-600 mb-2">
              Algum conflito que você resolveu? Uma situação social difícil que enfrentou?
            </p>
            <Textarea 
              placeholder="Compartilhe como superou esse desafio social..."
              className="bg-white"
            />
          </div>
          
          <div className="bg-gold-50 rounded-lg p-4">
            <h4 className="font-semibold text-gold-800 mb-3">🎯 Recentemente:</h4>
            <p className="text-sm text-gold-600 mb-2">
              Qual foi o último obstáculo que você enfrentou e não desistiu?
            </p>
            <Textarea 
              placeholder="Conte sobre sua superação mais recente..."
              className="bg-white"
            />
          </div>
        </div>
        
        <div className="bg-gradient-subtle rounded-lg p-4">
          <h4 className="font-semibold mb-2">🚀 Reflexão Final:</h4>
          <p className="text-sm text-muted-foreground mb-3">
            Olhando para todas essas experiências, o que você percebe sobre sua capacidade de persistir e superar desafios?
          </p>
          <Textarea 
            placeholder="O que você aprendeu sobre sua própria força e persistência?"
            className="min-h-24"
          />
        </div>
        
        <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
          <TrendingUp className="w-4 h-4 mr-2" />
          Concluir Linha do Tempo
        </Button>
      </CardContent>
    </Card>
  );

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

          {currentActivity === 'goal_setting' && renderGoalSetting()}
          {currentActivity === 'resilience_stories' && renderResilienceStories()}
          {currentActivity === 'emotional_timeline' && renderEmotionalTimeline()}
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
            <h1 className="text-3xl font-bold text-foreground">Automotivação & Resiliência</h1>
            <p className="text-muted-foreground">Fortaleça sua motivação e persistência</p>
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
              Continue desenvolvendo sua automotivação e resiliência
            </p>
          </CardContent>
        </Card>

        {/* Conceito */}
        <Card className="mb-8 bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <Target className="w-6 h-6" />
              Automotivação & Resiliência
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-orange-700 mb-4">
              A automotivação é a energia interna que nos move em direção aos nossos objetivos, 
              enquanto a resiliência é nossa capacidade de se recuperar e aprender com as dificuldades.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/80 rounded-lg p-4">
                <h4 className="font-semibold text-orange-800 mb-2">Automotivação inclui:</h4>
                <ul className="text-sm text-orange-700 space-y-1">
                  <li>• Definir metas pessoais</li>
                  <li>• Manter o foco nos objetivos</li>
                  <li>• Celebrar pequenas conquistas</li>
                  <li>• Encontrar propósito no que faz</li>
                </ul>
              </div>
              <div className="bg-white/80 rounded-lg p-4">
                <h4 className="font-semibold text-orange-800 mb-2">Resiliência envolve:</h4>
                <ul className="text-sm text-orange-700 space-y-1">
                  <li>• Ver erros como aprendizado</li>
                  <li>• Adaptar-se a mudanças</li>
                  <li>• Manter esperança em dificuldades</li>
                  <li>• Buscar apoio quando necessário</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Atividades */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-6 h-6 text-primary" />
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

export default AutomotivacaoModule;