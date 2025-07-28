import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  ArrowLeft, 
  Sparkles, 
  MessageSquare,
  Users,
  CheckCircle,
  PlayCircle,
  Lightbulb,
  UserCheck
} from "lucide-react";

interface HabilidadesSociaisModuleProps {
  onBack: () => void;
}

const HabilidadesSociaisModule = ({ onBack }: HabilidadesSociaisModuleProps) => {
  const [currentActivity, setCurrentActivity] = useState<string | null>(null);
  const [selectedConflict, setSelectedConflict] = useState<string | null>(null);
  const [selectedCommunication, setSelectedCommunication] = useState<string | null>(null);

  const activities = [
    {
      id: 'conflict_resolution',
      title: 'Resolução de Conflitos',
      description: 'Aprenda estratégias para resolver problemas com outras pessoas',
      icon: <Users className="w-5 h-5" />,
      isCompleted: false,
      estimatedTime: 18
    },
    {
      id: 'effective_communication',
      title: 'Comunicação Eficaz',
      description: 'Pratique como se expressar de forma clara e respeitosa',
      icon: <MessageSquare className="w-5 h-5" />,
      isCompleted: false,
      estimatedTime: 15
    },
    {
      id: 'collaboration_missions',
      title: 'Missões de Colaboração',
      description: 'Atividades para melhorar o trabalho em equipe',
      icon: <UserCheck className="w-5 h-5" />,
      isCompleted: false,
      estimatedTime: 20
    }
  ];

  const conflictScenarios = [
    {
      id: 'playground_dispute',
      title: 'Disputa no Recreio',
      situation: 'Você e seu amigo querem usar a mesma quadra para jogar esportes diferentes no recreio.',
      challenge: 'Como resolver essa situação de forma que ambos fiquem satisfeitos?',
      options: [
        {
          id: 'option1',
          text: 'Insistir que sua ideia é melhor e convencer o amigo',
          effectiveness: 'baixa',
          explanation: 'Isso pode gerar mais conflito e fazer seu amigo se sentir ignorado.'
        },
        {
          id: 'option2',
          text: 'Propor dividir o tempo: metade para cada esporte',
          effectiveness: 'alta',
          explanation: 'Solução justa que considera as necessidades de ambos.'
        },
        {
          id: 'option3',
          text: 'Desistir completamente e deixar só o amigo jogar',
          effectiveness: 'baixa',
          explanation: 'Você pode ficar frustrado e isso não resolve o problema de forma equilibrada.'
        },
        {
          id: 'option4',
          text: 'Procurar uma atividade que vocês dois gostem',
          effectiveness: 'alta',
          explanation: 'Criativo e pode fortalecer a amizade ao encontrar interesses comuns.'
        }
      ]
    },
    {
      id: 'group_project',
      title: 'Desentendimento no Projeto',
      situation: 'Em um projeto escolar, um colega não está fazendo sua parte e isso está prejudicando todo o grupo.',
      challenge: 'Como abordar essa situação de forma construtiva?',
      options: [
        {
          id: 'option1',
          text: 'Falar mal dele para outros colegas',
          effectiveness: 'baixa',
          explanation: 'Fofoca só piora a situação e pode destruir relacionamentos.'
        },
        {
          id: 'option2',
          text: 'Conversar em particular e oferecer ajuda',
          effectiveness: 'alta',
          explanation: 'Abordagem empática que pode revelar dificuldades não percebidas.'
        },
        {
          id: 'option3',
          text: 'Fazer a parte dele sem falar nada',
          effectiveness: 'baixa',
          explanation: 'Não resolve o problema e pode criar ressentimento.'
        },
        {
          id: 'option4',
          text: 'Conversar com o professor sobre a situação',
          effectiveness: 'média',
          explanation: 'Pode ser necessário, mas é melhor tentar resolver diretamente primeiro.'
        }
      ]
    }
  ];

  const communicationScenarios = [
    {
      id: 'disagree_friend',
      title: 'Discordando de um Amigo',
      situation: 'Seu melhor amigo quer assistir um filme que você não gosta. Como expressar sua opinião?',
      options: [
        {
          text: 'Esse filme é horrível, não vou assistir!',
          tone: 'agressivo',
          better: 'Não sou muito fã desse gênero. Que tal escolhermos algo que ambos gostemos?'
        },
        {
          text: 'Tudo bem... (mas fica chateado)',
          tone: 'passivo',
          better: 'Preferiria algo diferente. Posso sugerir algumas opções?'
        },
        {
          text: 'Não gosto muito desse filme. Podemos ver as opções juntos?',
          tone: 'assertivo',
          better: 'Perfeito! Essa é uma comunicação clara e respeitosa.'
        }
      ]
    },
    {
      id: 'ask_help',
      title: 'Pedindo Ajuda',
      situation: 'Você está com dificuldade em uma matéria e precisa pedir ajuda ao professor.',
      options: [
        {
          text: 'Professor, não entendo nada dessa matéria!',
          tone: 'dramático',
          better: 'Professor, estou com dificuldade em alguns conceitos. Poderia me ajudar?'
        },
        {
          text: '(Não fala nada e continua com dificuldade)',
          tone: 'evitativo',
          better: 'É importante buscar ajuda quando precisamos. Professores estão lá para isso!'
        },
        {
          text: 'Professor, poderia me explicar melhor este tópico? Estudei mas ainda tenho dúvidas.',
          tone: 'assertivo',
          better: 'Excelente! Mostra que você se esforçou e é específico sobre o que precisa.'
        }
      ]
    }
  ];

  const collaborationMissions = [
    {
      id: 'school_mission',
      title: 'Missão: Organizar Evento Escolar',
      description: 'Sua turma precisa organizar uma feira de ciências. Como trabalhar em equipe?',
      steps: [
        'Dividir tarefas de acordo com os talentos de cada um',
        'Criar um cronograma com prazos claros',
        'Ter reuniões regulares para acompanhar o progresso',
        'Apoiar colegas que estão com dificuldades',
        'Celebrar conquistas pequenas durante o processo'
      ],
      reflection: 'Como você pode aplicar essas habilidades em projetos da vida real?'
    },
    {
      id: 'family_mission',
      title: 'Missão: Projeto Familiar',
      description: 'Organize uma atividade especial para sua família (limpeza, festa, viagem).',
      steps: [
        'Conversar com todos sobre ideias e preferências',
        'Fazer uma lista das tarefas necessárias',
        'Distribuir responsabilidades de forma justa',
        'Estabelecer um sistema de comunicação',
        'Planejar como lidar com imprevistos juntos'
      ],
      reflection: 'O que você aprendeu sobre liderança e colaboração em família?'
    }
  ];

  const renderConflictResolution = () => {
    const currentConflict = conflictScenarios.find(c => c.id === selectedConflict);
    
    if (!currentConflict) {
      return (
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-6 h-6 text-blue-500" />
              Escolha um Conflito para Resolver
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Vamos praticar estratégias de resolução de conflitos através de situações realistas.
            </p>
            <div className="space-y-4">
              {conflictScenarios.map((scenario) => (
                <Card 
                  key={scenario.id}
                  className="cursor-pointer hover:shadow-md transition-shadow border-2 border-transparent hover:border-primary"
                  onClick={() => setSelectedConflict(scenario.id)}
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
            <Users className="w-6 h-6 text-blue-500" />
            {currentConflict.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-400">
            <h4 className="font-semibold text-blue-800 mb-2">📖 Situação:</h4>
            <p className="text-blue-700 mb-3">{currentConflict.situation}</p>
            <p className="text-blue-600 font-medium">{currentConflict.challenge}</p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">🤔 Como você resolveria? Analise as opções:</h4>
            <div className="space-y-3">
              {currentConflict.options.map((option) => (
                <Card key={option.id} className="cursor-pointer hover:shadow-md transition-all">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-sm ${
                        option.effectiveness === 'alta' ? 'bg-green-500' : 
                        option.effectiveness === 'média' ? 'bg-yellow-500' : 'bg-red-500'
                      }`}>
                        {option.effectiveness === 'alta' ? '✓' : 
                         option.effectiveness === 'média' ? '~' : '✗'}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium mb-2">{option.text}</p>
                        <p className="text-xs text-muted-foreground">{option.explanation}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          
          <div className="bg-green-50 rounded-lg p-4">
            <h4 className="font-semibold text-green-800 mb-2">🌟 Estratégias de Resolução de Conflitos:</h4>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• <strong>Escute</strong> todas as partes envolvidas</li>
              <li>• <strong>Encontre</strong> pontos em comum</li>
              <li>• <strong>Busque</strong> soluções win-win (todos ganham)</li>
              <li>• <strong>Mantenha</strong> o respeito durante a conversa</li>
              <li>• <strong>Foque</strong> no problema, não na pessoa</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">💭 Sua Reflexão:</h4>
            <Textarea 
              placeholder="Como você aplicaria essas estratégias em situações similares na sua vida?"
              className="min-h-24"
            />
          </div>
          
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={() => setSelectedConflict(null)}
            >
              Voltar aos Cenários
            </Button>
            <Button className="bg-green-600 hover:bg-green-700 text-white">
              Próximo Conflito
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderEffectiveCommunication = () => {
    const currentScenario = communicationScenarios.find(s => s.id === selectedCommunication);
    
    if (!currentScenario) {
      return (
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-6 h-6 text-green-500" />
              Pratique Comunicação Eficaz
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              A forma como nos comunicamos pode fazer toda a diferença nos nossos relacionamentos. 
              Vamos praticar diferentes estilos de comunicação.
            </p>
            
            <div className="bg-green-50 rounded-lg p-4 mb-6">
              <h4 className="font-semibold text-green-800 mb-2">📝 Estilos de Comunicação:</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="bg-red-100 rounded p-3">
                  <h5 className="font-medium text-red-800 mb-1">🔥 Agressivo</h5>
                  <p className="text-xs text-red-700">Impõe opinião, desrespeita outros</p>
                </div>
                <div className="bg-blue-100 rounded p-3">
                  <h5 className="font-medium text-blue-800 mb-1">😶 Passivo</h5>
                  <p className="text-xs text-blue-700">Evita conflito, não expressa necessidades</p>
                </div>
                <div className="bg-green-100 rounded p-3">
                  <h5 className="font-medium text-green-800 mb-1">✅ Assertivo</h5>
                  <p className="text-xs text-green-700">Claro, respeitoso, direto</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              {communicationScenarios.map((scenario) => (
                <Card 
                  key={scenario.id}
                  className="cursor-pointer hover:shadow-md transition-shadow border-2 border-transparent hover:border-primary"
                  onClick={() => setSelectedCommunication(scenario.id)}
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
            <MessageSquare className="w-6 h-6 text-green-500" />
            {currentScenario.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-green-50 rounded-lg p-4 border-l-4 border-green-400">
            <h4 className="font-semibold text-green-800 mb-2">💬 Situação:</h4>
            <p className="text-green-700">{currentScenario.situation}</p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">🗣️ Analise essas formas de comunicação:</h4>
            <div className="space-y-4">
              {currentScenario.options.map((option, index) => (
                <Card key={index} className="border-l-4 border-l-indigo-400">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant={
                        option.tone === 'assertivo' ? 'default' :
                        option.tone === 'passivo' ? 'secondary' : 'destructive'
                      }>
                        {option.tone}
                      </Badge>
                    </div>
                    <p className="text-sm font-medium mb-2">"{option.text}"</p>
                    <div className="bg-indigo-50 rounded p-3">
                      <p className="text-xs text-indigo-700">
                        <strong>Melhor forma:</strong> {option.better}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          
          <div className="bg-yellow-50 rounded-lg p-4">
            <h4 className="font-semibold text-yellow-800 mb-2">💡 Dicas para Comunicação Assertiva:</h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Use "eu sinto" em vez de "você sempre"</li>
              <li>• Seja específico sobre o que incomoda</li>
              <li>• Proponha soluções, não apenas problemas</li>
              <li>• Mantenha tom de voz calmo e respeitoso</li>
              <li>• Escolha o momento certo para conversar</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">🎯 Pratique Agora:</h4>
            <p className="text-sm text-muted-foreground mb-2">
              Escreva como você se comunicaria de forma assertiva em uma situação similar:
            </p>
            <Textarea 
              placeholder="Exemplo: 'Entendo seu ponto de vista, mas gostaria de compartilhar uma perspectiva diferente...'"
              className="min-h-24"
            />
          </div>
          
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={() => setSelectedCommunication(null)}
            >
              Voltar aos Exercícios
            </Button>
            <Button className="bg-green-600 hover:bg-green-700 text-white">
              Salvar Prática
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderCollaborationMissions = () => (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserCheck className="w-6 h-6 text-purple-500" />
          Missões de Colaboração
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-muted-foreground">
          Estas missões ajudam você a praticar habilidades de liderança e trabalho em equipe em situações reais.
        </p>
        
        {collaborationMissions.map((mission) => (
          <Card key={mission.id} className="border-l-4 border-l-purple-400">
            <CardContent className="p-6">
              <h3 className="text-lg font-bold text-purple-800 mb-3">{mission.title}</h3>
              <p className="text-purple-700 mb-4">{mission.description}</p>
              
              <div className="mb-4">
                <h4 className="font-semibold mb-3">📋 Passos para o Sucesso:</h4>
                <div className="space-y-2">
                  {mission.steps.map((step, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-purple-200 flex items-center justify-center text-purple-800 text-sm font-bold">
                        {index + 1}
                      </div>
                      <p className="text-sm text-foreground">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-purple-50 rounded-lg p-4">
                <h4 className="font-semibold text-purple-800 mb-2">🤔 Reflexão:</h4>
                <p className="text-sm text-purple-700 mb-3">{mission.reflection}</p>
                <Textarea 
                  placeholder="Compartilhe suas experiências e aprendizados..."
                  className="bg-white"
                />
              </div>
              
              <Button className="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white">
                <Lightbulb className="w-4 h-4 mr-2" />
                Aceitar Missão
              </Button>
            </CardContent>
          </Card>
        ))}
        
        <div className="bg-gold-50 rounded-lg p-4">
          <h4 className="font-semibold text-gold-800 mb-2">🏆 Desafio Extra:</h4>
          <p className="text-sm text-gold-700 mb-3">
            Crie sua própria missão de colaboração! Pense em um projeto que você gostaria de liderar 
            ou em que gostaria de participar na escola, em casa ou na comunidade.
          </p>
          <Textarea 
            placeholder="Descreva seu projeto colaborativo..."
            className="bg-white"
          />
        </div>
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

          {currentActivity === 'conflict_resolution' && renderConflictResolution()}
          {currentActivity === 'effective_communication' && renderEffectiveCommunication()}
          {currentActivity === 'collaboration_missions' && renderCollaborationMissions()}
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
            <h1 className="text-3xl font-bold text-foreground">Habilidades Sociais</h1>
            <p className="text-muted-foreground">Melhore sua comunicação e relacionamentos</p>
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
              Continue desenvolvendo suas habilidades sociais
            </p>
          </CardContent>
        </Card>

        {/* Conceito */}
        <Card className="mb-8 bg-gradient-to-br from-pink-50 to-rose-50 border-pink-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-pink-800">
              <Sparkles className="w-6 h-6" />
              Habilidades Sociais Essenciais
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-pink-700 mb-4">
              As habilidades sociais são competências que nos permitem interagir de forma eficaz e harmoniosa com outras pessoas. 
              Elas são fundamentais para o sucesso pessoal e profissional.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/80 rounded-lg p-4">
                <h4 className="font-semibold text-pink-800 mb-2">Habilidades incluem:</h4>
                <ul className="text-sm text-pink-700 space-y-1">
                  <li>• Comunicação clara e respeitosa</li>
                  <li>• Resolução pacífica de conflitos</li>
                  <li>• Trabalho eficaz em equipe</li>
                  <li>• Liderança positiva</li>
                </ul>
              </div>
              <div className="bg-white/80 rounded-lg p-4">
                <h4 className="font-semibold text-pink-800 mb-2">Benefícios:</h4>
                <ul className="text-sm text-pink-700 space-y-1">
                  <li>• Relacionamentos mais saudáveis</li>
                  <li>• Maior sucesso em projetos</li>
                  <li>• Menos estresse em interações</li>
                  <li>• Oportunidades de liderança</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Atividades */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-6 h-6 text-primary" />
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

export default HabilidadesSociaisModule;