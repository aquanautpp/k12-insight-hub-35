import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  ArrowLeft, 
  Users, 
  Ear,
  Eye,
  CheckCircle,
  PlayCircle,
  Heart,
  MessageCircle
} from "lucide-react";

interface EmpatiaModuleProps {
  onBack: () => void;
}

const EmpatiaModule = ({ onBack }: EmpatiaModuleProps) => {
  const [currentActivity, setCurrentActivity] = useState<string | null>(null);
  const [selectedStory, setSelectedStory] = useState<string | null>(null);
  const [listeningAnswers, setListeningAnswers] = useState<string[]>(['', '', '']);

  const activities = [
    {
      id: 'active_listening',
      title: 'Escuta Ativa',
      description: 'Pratique como ouvir verdadeiramente os outros',
      icon: <Ear className="w-5 h-5" />,
      isCompleted: false,
      estimatedTime: 10
    },
    {
      id: 'perspective_stories',
      title: 'Múltiplas Perspectivas',
      description: 'Veja situações através dos olhos de diferentes pessoas',
      icon: <Eye className="w-5 h-5" />,
      isCompleted: false,
      estimatedTime: 15
    },
    {
      id: 'empathy_practice',
      title: 'Colocando-se no Lugar do Outro',
      description: 'Dinâmicas para desenvolver compreensão emocional',
      icon: <Heart className="w-5 h-5" />,
      isCompleted: true,
      estimatedTime: 12
    }
  ];

  const listeningScenarios = [
    {
      audio: "🎵 Áudio 1: Ana falando sobre sua dificuldade em matemática",
      context: "Ana está explicando como se sente perdida nas aulas de matemática e tem medo de fazer perguntas.",
      questions: [
        "Como Ana está se sentindo em relação à matemática?",
        "O que você acha que ela mais precisa ouvir neste momento?",
        "Que tipo de apoio você ofereceria para Ana?"
      ]
    },
    {
      audio: "🎵 Áudio 2: Carlos contando sobre conflito com amigos",
      context: "Carlos está triste porque seus amigos fizeram planos sem incluí-lo e ele não sabe como conversar sobre isso.",
      questions: [
        "Quais emoções Carlos está demonstrando?",
        "Por que ele pode estar com dificuldade de conversar com os amigos?",
        "Como você ajudaria Carlos a lidar com essa situação?"
      ]
    }
  ];

  const perspectiveStories = [
    {
      id: 'school_project',
      title: 'O Projeto Escolar',
      situation: 'Em um projeto em grupo, Maria ficou responsável pela pesquisa, João pelos desenhos e Ana pela apresentação. No dia da entrega, Maria não trouxe a pesquisa completa.',
      characters: [
        {
          name: 'Maria',
          perspective: 'Estava passando por problemas familiares em casa e não conseguiu se concentrar nos estudos. Sente-se culpada e com vergonha de decepcionar os amigos.',
          emotion: 'Culpa e ansiedade'
        },
        {
          name: 'João',
          perspective: 'Ficou irritado porque dependia da pesquisa da Maria para fazer os desenhos. Sente que ela não se importa com o grupo.',
          emotion: 'Raiva e frustração'
        },
        {
          name: 'Ana',
          perspective: 'Está preocupada com a nota e nervosa para apresentar um projeto incompleto. Quer encontrar uma solução para todos.',
          emotion: 'Preocupação e stress'
        }
      ]
    },
    {
      id: 'lunch_conflict',
      title: 'O Conflito no Recreio',
      situation: 'Durante o recreio, Pedro estava jogando futebol quando acidentalmente chutou a bola muito forte e acertou Lucas, que estava lendo um livro debaixo da árvore.',
      characters: [
        {
          name: 'Pedro',
          perspective: 'Foi um acidente e ele se sente mal por ter machucado Lucas. Quer se desculpar mas não sabe como, pois Lucas parece muito bravo.',
          emotion: 'Arrependimento e nervosismo'
        },
        {
          name: 'Lucas',
          perspective: 'Estava tendo um dia difícil e a leitura era seu momento de paz. Sente que Pedro não respeitou seu espaço e está irritado.',
          emotion: 'Irritação e tristeza'
        },
        {
          name: 'Amigos observando',
          perspective: 'Viram o que aconteceu e querem ajudar, mas não sabem como intervir na situação sem piorar as coisas.',
          emotion: 'Confusão e vontade de ajudar'
        }
      ]
    }
  ];

  const renderActiveListening = () => (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Ear className="w-6 h-6 text-blue-500" />
          Praticando Escuta Ativa
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-muted-foreground">
          A escuta ativa é mais do que apenas ouvir palavras - é prestar atenção completa à pessoa, 
          entender suas emoções e responder de forma empática. Vamos praticar!
        </p>
        
        <div className="bg-blue-50 rounded-lg p-4">
          <h4 className="font-semibold text-blue-800 mb-2">📝 Regras da Escuta Ativa:</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• <strong>Foque totalmente</strong> na pessoa que está falando</li>
            <li>• <strong>Não interrompa</strong> ou tente dar soluções imediatamente</li>
            <li>• <strong>Observe</strong> linguagem corporal e tom de voz</li>
            <li>• <strong>Faça perguntas</strong> para entender melhor</li>
            <li>• <strong>Reflita</strong> o que ouviu para confirmar entendimento</li>
          </ul>
        </div>
        
        {listeningScenarios.map((scenario, index) => (
          <Card key={index} className="border-l-4 border-l-blue-400">
            <CardContent className="p-4">
              <div className="mb-4">
                <div className="bg-blue-100 rounded-lg p-3 mb-3">
                  <p className="text-blue-800 font-medium">{scenario.audio}</p>
                  <p className="text-blue-600 text-sm mt-1">{scenario.context}</p>
                </div>
                <Button variant="outline" className="mb-3">
                  <PlayCircle className="w-4 h-4 mr-2" />
                  Reproduzir Áudio
                </Button>
              </div>
              
              <div className="space-y-4">
                {scenario.questions.map((question, qIndex) => (
                  <div key={qIndex}>
                    <p className="font-medium text-sm mb-2">{question}</p>
                    <Textarea 
                      placeholder="Sua resposta..."
                      value={listeningAnswers[qIndex] || ''}
                      onChange={(e) => {
                        const newAnswers = [...listeningAnswers];
                        newAnswers[qIndex] = e.target.value;
                        setListeningAnswers(newAnswers);
                      }}
                      className="min-h-20"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
        
        <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
          <CheckCircle className="w-4 h-4 mr-2" />
          Concluir Exercício de Escuta
        </Button>
      </CardContent>
    </Card>
  );

  const renderPerspectiveStories = () => {
    const currentStory = perspectiveStories.find(s => s.id === selectedStory);
    
    if (!currentStory) {
      return (
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-6 h-6 text-purple-500" />
              Escolha uma História para Explorar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Cada situação pode ser vista de diferentes ângulos. Vamos praticar olhar através dos olhos de cada pessoa envolvida.
            </p>
            <div className="space-y-4">
              {perspectiveStories.map((story) => (
                <Card 
                  key={story.id}
                  className="cursor-pointer hover:shadow-md transition-shadow border-2 border-transparent hover:border-primary"
                  onClick={() => setSelectedStory(story.id)}
                >
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2">{story.title}</h3>
                    <p className="text-sm text-muted-foreground">{story.situation}</p>
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
            <Eye className="w-6 h-6 text-purple-500" />
            {currentStory.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-purple-50 rounded-lg p-4 border-l-4 border-purple-400">
            <h4 className="font-semibold text-purple-800 mb-2">📖 Situação:</h4>
            <p className="text-purple-700">{currentStory.situation}</p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">👥 Perspectivas dos Envolvidos:</h4>
            <div className="space-y-4">
              {currentStory.characters.map((character, index) => (
                <Card key={index} className="border-l-4 border-l-indigo-400">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="font-semibold text-indigo-800">{character.name}</h5>
                      <Badge variant="outline" className="text-indigo-600">
                        {character.emotion}
                      </Badge>
                    </div>
                    <p className="text-sm text-indigo-700 mb-4">{character.perspective}</p>
                    
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium mb-1">💭 Como você acha que {character.name} se sente?</p>
                        <Textarea placeholder="Descreva as emoções..." className="min-h-16" />
                      </div>
                      <div>
                        <p className="text-sm font-medium mb-1">🤝 O que você diria para {character.name}?</p>
                        <Textarea placeholder="Sua resposta empática..." className="min-h-16" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          
          <div className="bg-green-50 rounded-lg p-4">
            <h4 className="font-semibold text-green-800 mb-2">🌟 Reflexão Final:</h4>
            <p className="text-sm text-green-700 mb-3">
              Agora que você viu a situação através dos olhos de cada pessoa, como isso mudou sua compreensão do conflito?
            </p>
            <Textarea 
              placeholder="Compartilhe suas reflexões sobre as diferentes perspectivas..."
              className="bg-white min-h-24"
            />
          </div>
          
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={() => setSelectedStory(null)}
            >
              Voltar às Histórias
            </Button>
            <Button variant="learning">
              Salvar Reflexões
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderEmpathyPractice = () => (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="w-6 h-6 text-red-500" />
          Dinâmica: Colocando-se no Lugar do Outro
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-muted-foreground">
          Esta atividade te ajuda a praticar a empatia através de exercícios de imaginação e reflexão.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="border-l-4 border-l-red-400">
            <CardContent className="p-4">
              <h4 className="font-semibold text-red-800 mb-3">🎭 Exercício de Papel</h4>
              <p className="text-sm text-red-700 mb-3">
                Imagine que você é uma criança nova na escola. É seu primeiro dia e você não conhece ninguém.
              </p>
              <div className="space-y-2">
                <p className="text-xs font-medium">Como você se sentiria?</p>
                <Textarea placeholder="Descreva seus sentimentos..." className="min-h-16" />
                <p className="text-xs font-medium">O que gostaria que os outros fizessem?</p>
                <Textarea placeholder="Como os outros poderiam te ajudar..." className="min-h-16" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-blue-400">
            <CardContent className="p-4">
              <h4 className="font-semibold text-blue-800 mb-3">👨‍👩‍👧‍👦 Perspectiva Familiar</h4>
              <p className="text-sm text-blue-700 mb-3">
                Imagine como seus pais se sentem quando você tira uma nota baixa.
              </p>
              <div className="space-y-2">
                <p className="text-xs font-medium">Que emoções eles podem sentir?</p>
                <Textarea placeholder="Preocupação, tristeza, frustração..." className="min-h-16" />
                <p className="text-xs font-medium">Por que eles reagem assim?</p>
                <Textarea placeholder="O que motiva a reação deles..." className="min-h-16" />
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="bg-yellow-50 rounded-lg p-4">
          <h4 className="font-semibold text-yellow-800 mb-3">🎯 Desafio da Semana:</h4>
          <p className="text-sm text-yellow-700 mb-3">
            Durante esta semana, escolha uma pessoa que te irritou ou com quem você teve um conflito. 
            Tente entender o ponto de vista dela:
          </p>
          <ul className="text-sm text-yellow-700 space-y-1 mb-3">
            <li>• O que ela pode estar passando?</li>
            <li>• Que pressões ou problemas ela pode ter?</li>
            <li>• Como você se sentiria na situação dela?</li>
          </ul>
          <Textarea 
            placeholder="Escreva sobre sua experiência com este desafio..."
            className="bg-white"
          />
        </div>
        
        <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
          <Heart className="w-4 h-4 mr-2" />
          Aceitar Desafio da Empatia
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

          {currentActivity === 'active_listening' && renderActiveListening()}
          {currentActivity === 'perspective_stories' && renderPerspectiveStories()}
          {currentActivity === 'empathy_practice' && renderEmpathyPractice()}
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
            <h1 className="text-3xl font-bold text-foreground">Empatia & Consciência Social</h1>
            <p className="text-muted-foreground">Compreenda melhor os sentimentos dos outros</p>
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
              Continue desenvolvendo sua capacidade de empatia
            </p>
          </CardContent>
        </Card>

        {/* Conceito */}
        <Card className="mb-8 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-800">
              <Users className="w-6 h-6" />
              O que é Empatia?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-purple-700 mb-4">
              A empatia é a habilidade de compreender e compartilhar os sentimentos de outras pessoas. 
              É como ter "óculos emocionais" que nos permitem ver o mundo através dos olhos dos outros.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/80 rounded-lg p-4">
                <h4 className="font-semibold text-purple-800 mb-2">Benefícios da Empatia:</h4>
                <ul className="text-sm text-purple-700 space-y-1">
                  <li>• Relacionamentos mais profundos</li>
                  <li>• Menos conflitos e mal-entendidos</li>
                  <li>• Maior capacidade de ajudar outros</li>
                  <li>• Melhor trabalho em equipe</li>
                </ul>
              </div>
              <div className="bg-white/80 rounded-lg p-4">
                <h4 className="font-semibold text-purple-800 mb-2">Como desenvolver:</h4>
                <ul className="text-sm text-purple-700 space-y-1">
                  <li>• Praticar escuta ativa</li>
                  <li>• Observar linguagem corporal</li>
                  <li>• Fazer perguntas sobre sentimentos</li>
                  <li>• Imaginar-se no lugar do outro</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Atividades */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="w-6 h-6 text-primary" />
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
                      variant="outline"
                      className="w-full text-black border-black hover:bg-gray-50"
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

export default EmpatiaModule;