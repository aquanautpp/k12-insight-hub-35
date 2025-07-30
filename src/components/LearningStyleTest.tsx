import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Brain, Eye, Volume2, Hammer, Users, Navigation, Trophy, RotateCcw, BookOpen } from "lucide-react";

interface Question {
  id: number;
  scenario: string;
  options: {
    text: string;
    profile: string;
  }[];
}

const questions: Question[] = [
  {
    id: 1,
    scenario: "Imagine que você e seus amigos estão explorando uma floresta mágica e encontram um mapa antigo que promete levar a um tesouro escondido. O que você faria primeiro para descobrir o caminho?",
    options: [
      { text: "Olharia o mapa com muita atenção, prestando atenção em cada detalhe, desenho e cor para visualizar o percurso.", profile: "visual" },
      { text: "Chamaria seus amigos para conversar sobre o mapa, trocando ideias e ouvindo as sugestões de cada um.", profile: "auditivo" },
      { text: "Pegaria o mapa e começaria a andar pela floresta, testando os caminhos e sentindo o terreno sob seus pés.", profile: "cinestesico" },
      { text: "Tentaria decifrar os símbolos e enigmas do mapa, buscando padrões e conexões lógicas para desvendar o segredo.", profile: "logico" }
    ]
  },
  {
    id: 2,
    scenario: "Você ganhou um kit incrível para montar um robô que pode ser seu novo amigo! O manual de instruções está em uma caixa. Como você prefere aprender a montar o robô?",
    options: [
      { text: "Olharia as imagens e diagramas do manual, seguindo as figuras passo a passo.", profile: "visual" },
      { text: "Pediria para alguém ler as instruções em voz alta para você, ou assistiria a um vídeo onde alguém explica como montar.", profile: "auditivo" },
      { text: "Começaria a mexer nas peças, tentando encaixá-las e descobrindo como funciona na prática.", profile: "cinestesico" },
      { text: "Leria o manual do início ao fim, entendendo a lógica de cada etapa antes de começar a montar.", profile: "logico" }
    ]
  },
  {
    id: 3,
    scenario: "Você descobriu uma biblioteca secreta cheia de livros antigos e misteriosos. Para desvendar um grande segredo escondido em um dos livros, qual seria sua estratégia?",
    options: [
      { text: "Procuraria por ilustrações, mapas ou símbolos nos livros que pudessem dar pistas visuais.", profile: "visual" },
      { text: "Leria trechos em voz alta ou pediria para alguém ler para você, para captar as informações pelo som das palavras.", profile: "auditivo" },
      { text: "Manusearia os livros, sentindo a textura das páginas, e talvez tentasse recriar algo que leu para entender melhor.", profile: "cinestesico" },
      { text: "Analisaria o índice, os títulos dos capítulos e as palavras-chave, buscando a estrutura lógica do livro para encontrar o segredo.", profile: "logico" }
    ]
  },
  {
    id: 4,
    scenario: "Sua avó te ensinou uma receita mágica para fazer biscoitos que dão superpoderes! Como você prefere aprender a fazer esses biscoitos?",
    options: [
      { text: "Observaria sua avó fazendo, prestando atenção em cada movimento e na aparência dos ingredientes.", profile: "visual" },
      { text: "Ouviria atentamente as explicações dela, fazendo perguntas e pedindo para ela repetir as partes mais importantes.", profile: "auditivo" },
      { text: "Colocaria a mão na massa junto com ela, misturando os ingredientes e sentindo a textura da massa.", profile: "cinestesico" },
      { text: "Leria a receita escrita, medindo tudo com precisão e seguindo a ordem exata dos passos.", profile: "logico" }
    ]
  },
  {
    id: 5,
    scenario: "Você e seus amigos estão planejando uma festa surpresa para um colega. Como você prefere contribuir para que a festa seja um sucesso?",
    options: [
      { text: "Criaria um painel de ideias com fotos, desenhos e cores para visualizar a decoração e os detalhes da festa.", profile: "visual" },
      { text: "Participaria ativamente das reuniões, discutindo ideias com o grupo e ouvindo as opiniões de todos.", profile: "social" },
      { text: "Ajudaria a montar a decoração, organizar os jogos e preparar a comida, colocando a mão na massa.", profile: "cinestesico" },
      { text: "Organizaria uma lista de tarefas, definindo prazos e responsabilidades, para garantir que tudo saia perfeito.", profile: "logico" }
    ]
  },
  {
    id: 6,
    scenario: "Seus amigos te chamaram para jogar um jogo de tabuleiro novo e super legal. Como você prefere aprender as regras?",
    options: [
      { text: "Olharia o tabuleiro e as peças, tentando entender a dinâmica do jogo visualmente.", profile: "visual" },
      { text: "Pediria para alguém explicar as regras em voz alta, prestando atenção nas instruções.", profile: "auditivo" },
      { text: "Começaria a jogar, aprendendo as regras na prática e experimentando as diferentes jogadas.", profile: "cinestesico" },
      { text: "Leria o manual de regras, buscando entender a lógica e as estratégias do jogo.", profile: "logico" }
    ]
  },
  {
    id: 7,
    scenario: "Na escola, vocês receberam um desafio para resolver um problema complexo em grupo. Como você prefere abordar esse desafio?",
    options: [
      { text: "Criaria um diagrama ou um mapa mental para organizar as informações e visualizar as possíveis soluções.", profile: "visual" },
      { text: "Participaria de um debate com o grupo, ouvindo diferentes pontos de vista e argumentando suas ideias.", profile: "social" },
      { text: "Faria experimentos ou simulações práticas para testar as soluções e ver qual funciona melhor.", profile: "cinestesico" },
      { text: "Analisaria o problema em partes, buscando a causa raiz e desenvolvendo um plano lógico para a solução.", profile: "logico" }
    ]
  },
  {
    id: 8,
    scenario: "Você precisa contar uma história incrível para seus colegas. Como você se prepara para contar essa história?",
    options: [
      { text: "Pensaria em imagens e cenas para descrever, para que seus colegas pudessem visualizar a história.", profile: "visual" },
      { text: "Ensaiaria a história em voz alta, prestando atenção na entonação e no ritmo da sua fala.", profile: "auditivo" },
      { text: "Usaria gestos e movimentos para dar vida aos personagens e às situações da história.", profile: "cinestesico" },
      { text: "Organizaria a história em uma sequência lógica de eventos, com começo, meio e fim bem definidos.", profile: "logico" }
    ]
  },
  {
    id: 9,
    scenario: "Você está aprendendo sobre um animal novo e fascinante. Como você prefere descobrir mais sobre ele?",
    options: [
      { text: "Olharia fotos e vídeos do animal, observando seu comportamento e suas características físicas.", profile: "visual" },
      { text: "Ouviria um documentário ou um podcast sobre o animal, prestando atenção nos sons que ele faz e nas informações narradas.", profile: "auditivo" },
      { text: "Tentaria imitar os movimentos do animal ou construir um modelo dele para entender como ele se move e vive.", profile: "cinestesico" },
      { text: "Leria um livro ou um artigo científico sobre o animal, buscando entender sua classificação, hábitos e ecossistema.", profile: "logico" }
    ]
  },
  {
    id: 10,
    scenario: "Você precisa fazer uma apresentação para a turma sobre um tema que você adora. Como você prefere preparar sua apresentação?",
    options: [
      { text: "Usaria muitos slides com imagens, gráficos e vídeos para ilustrar suas ideias.", profile: "visual" },
      { text: "Prepararia um roteiro para falar, ensaiando em voz alta e pensando em como sua voz pode prender a atenção da turma.", profile: "auditivo" },
      { text: "Criaria uma maquete ou um objeto interativo para mostrar durante a apresentação, envolvendo a turma de forma prática.", profile: "cinestesico" },
      { text: "Organizaria as informações de forma lógica, com tópicos claros e uma sequência de ideias bem estruturada.", profile: "logico" }
    ]
  },
  {
    id: 11,
    scenario: "Você decidiu aprender a tocar um instrumento musical. Como você prefere começar?",
    options: [
      { text: "Olharia partituras e diagramas de acordes, visualizando as notas e posições dos dedos.", profile: "visual" },
      { text: "Ouviria músicas tocadas no instrumento, prestando atenção nos sons e na melodia.", profile: "auditivo" },
      { text: "Começaria a praticar, experimentando os sons e movimentos com o instrumento nas mãos.", profile: "cinestesico" },
      { text: "Leria sobre a teoria musical e a estrutura do instrumento, entendendo como ele funciona antes de tocar.", profile: "logico" }
    ]
  },
  {
    id: 12,
    scenario: "Seu quarto está uma bagunça e você precisa organizá-lo. Como você prefere fazer isso?",
    options: [
      { text: "Faria um desenho ou um plano de como você quer que seu quarto fique, visualizando a organização.", profile: "visual" },
      { text: "Conversaria com alguém sobre a melhor forma de organizar, pedindo dicas e ouvindo sugestões.", profile: "social" },
      { text: "Começaria a arrumar, movendo as coisas de lugar e experimentando diferentes arranjos até encontrar o ideal.", profile: "cinestesico" },
      { text: "Faria uma lista de tudo o que precisa ser organizado, categorizando os itens e definindo um passo a passo.", profile: "logico" }
    ]
  },
  {
    id: 13,
    scenario: "Você ganhou um quebra-cabeça gigante com mil peças! Como você prefere começar a montá-lo?",
    options: [
      { text: "Olharia a imagem da caixa com muita atenção, tentando memorizar os detalhes e as cores para guiar a montagem.", profile: "visual" },
      { text: "Pediria para alguém te ajudar, conversando sobre as peças e as estratégias para montar.", profile: "social" },
      { text: "Começaria a encaixar as peças, experimentando diferentes combinações até encontrar os encaixes certos.", profile: "cinestesico" },
      { text: "Separaria as peças por cor ou formato, organizando-as de forma lógica antes de começar a montar.", profile: "logico" }
    ]
  },
  {
    id: 14,
    scenario: "Você está planejando uma viagem incrível para um lugar que sempre sonhou conhecer. Como você prefere se preparar?",
    options: [
      { text: "Criaria um mural visual com fotos do destino, mapas e imagens dos lugares que quer visitar.", profile: "visual" },
      { text: "Conversaria com pessoas que já visitaram o lugar, ouvindo histórias e dicas de viagem.", profile: "auditivo" },
      { text: "Faria uma mala de teste, experimentaria roupas e simularia atividades que fará na viagem.", profile: "cinestesico" },
      { text: "Pesquisaria detalhadamente sobre o local, criando um roteiro organizado com horários e atividades planejadas.", profile: "logico" }
    ]
  },
  {
    id: 15,
    scenario: "Você quer aprender uma nova habilidade incrível, como fazer malabarismo. Como você prefere começar a aprender?",
    options: [
      { text: "Assistiria vídeos tutoriais, observando atentamente os movimentos e técnicas.", profile: "visual" },
      { text: "Ouviria as explicações de um instrutor ou de podcasts sobre a técnica.", profile: "auditivo" },
      { text: "Pegaria as bolas e começaria a praticar imediatamente, aprendendo através da experiência.", profile: "cinestesico" },
      { text: "Estudaria a física por trás do malabarismo, entendendo a lógica dos movimentos antes de praticar.", profile: "autonomo" }
    ]
  }
];

const profiles = {
  visual: {
    title: "Explorador Visual",
    icon: Eye,
    description: "Seu superpoder é aprender com os olhos! Imagens, gráficos e vídeos são suas ferramentas secretas.",
    tips: "Use mapas mentais, post-its coloridos, diagramas e desenhos para estudar melhor.",
    color: "text-blue-600"
  },
  auditivo: {
    title: "Comunicador Auditivo",
    icon: Volume2,
    description: "Você aprende melhor através dos sons! Sua mente absorve informações pelo que você ouve.",
    tips: "Grave resumos, estude ouvindo música, participe de discussões e explique em voz alta.",
    color: "text-green-600"
  },
  cinestesico: {
    title: "Construtor Cinestésico",
    icon: Hammer,
    description: "Você precisa tocar, mover e experimentar para aprender! Suas mãos são suas melhores professoras.",
    tips: "Use objetos manipuláveis, faça experimentos, caminhe enquanto estuda e pratique bastante.",
    color: "text-orange-600"
  },
  logico: {
    title: "Pensador Lógico",
    icon: Brain,
    description: "Sua mente adora padrões, sequências e estruturas organizadas! Você é um detetive do conhecimento.",
    tips: "Organize informações em listas, use esquemas, procure conexões lógicas e faça resumos estruturados.",
    color: "text-purple-600"
  },
  social: {
    title: "Colaborador Social",
    icon: Users,
    description: "Você brilha quando aprende com outras pessoas! Trabalhos em grupo são seu forte.",
    tips: "Estude em grupos, ensine outros colegas, participe de debates e projetos colaborativos.",
    color: "text-pink-600"
  },
  autonomo: {
    title: "Navegador Autônomo",
    icon: Navigation,
    description: "Você prefere descobrir as coisas por conta própria! Sua independência é seu superpoder.",
    tips: "Crie seu próprio ritmo de estudos, use técnicas de autodisciplina e defina suas próprias metas.",
    color: "text-indigo-600"
  }
};

const generatePersonalizedActivities = (profile: string) => {
  const activitiesByProfile = {
    visual: [
      "Criar mapas mentais coloridos para conceitos matemáticos",
      "Usar gráficos e diagramas para resolver problemas",
      "Desenhar representações visuais de frações",
      "Assistir vídeos educativos com animações"
    ],
    auditivo: [
      "Explicar problemas matemáticos em voz alta",
      "Criar músicas ou rimas para memorizar fórmulas",
      "Participar de discussões em grupo sobre conceitos",
      "Ouvir podcasts educativos"
    ],
    cinestesico: [
      "Usar blocos e objetos físicos para aprender",
      "Resolver problemas andando pela sala",
      "Criar experimentos práticos",
      "Usar jogos de movimento para aprender"
    ],
    logico: [
      "Resolver problemas passo a passo com lógica",
      "Criar tabelas e esquemas organizados",
      "Analisar padrões e sequências",
      "Usar métodos sistemáticos de resolução"
    ],
    social: [
      "Trabalhar em grupos de estudo",
      "Ensinar conceitos para outros colegas",
      "Participar de projetos colaborativos",
      "Discutir ideias em fóruns educativos"
    ],
    autonomo: [
      "Criar cronogramas pessoais de estudo",
      "Definir metas individuais de aprendizagem",
      "Explorar recursos educativos independentemente",
      "Desenvolver projetos pessoais de pesquisa"
    ]
  };
  
  return activitiesByProfile[profile] || activitiesByProfile.visual;
};

const LearningStyleTest = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [testCompleted, setTestCompleted] = useState(false);
  const [results, setResults] = useState<{ [key: string]: number }>({});

  const handleAnswerSelect = (profile: string) => {
    setSelectedAnswer(profile);
  };

  const handleNextQuestion = () => {
    if (!selectedAnswer) return;

    const newAnswers = [...answers, selectedAnswer];
    setAnswers(newAnswers);
    setSelectedAnswer("");

    if (currentQuestion === questions.length - 1) {
      // Calculate results
      const counts: { [key: string]: number } = {};
      newAnswers.forEach(answer => {
        counts[answer] = (counts[answer] || 0) + 1;
      });
      setResults(counts);
      setTestCompleted(true);
    } else {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const resetTest = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setSelectedAnswer("");
    setTestCompleted(false);
    setResults({});
  };

  const getDominantProfiles = () => {
    const maxScore = Math.max(...Object.values(results));
    return Object.entries(results)
      .filter(([_, score]) => score === maxScore)
      .map(([profile, _]) => profile);
  };

  if (testCompleted) {
    const dominantProfiles = getDominantProfiles();
    const mainProfile = dominantProfiles[0];
    const profileData = profiles[mainProfile as keyof typeof profiles];

    return (
      <div className="min-h-screen bg-gradient-subtle p-6">
        <div className="max-w-4xl mx-auto">
          <Card className="border-0 shadow-card">
            <CardHeader className="text-center bg-gradient-achievement rounded-t-lg">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                  <Trophy className="w-8 h-8 text-white" />
                </div>
              </div>
               <CardTitle className="text-2xl text-green-700 mb-2 animate-fade-in">
                  🎯 Descubra Seu Superpoder de Aprender!
                </CardTitle>
            </CardHeader>
            
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <div className="flex justify-center mb-4">
                  <div className={`w-20 h-20 rounded-full bg-gradient-learning flex items-center justify-center`}>
                    <profileData.icon className="w-10 h-10 text-white" />
                  </div>
                </div>
                <h2 className="text-3xl font-bold text-foreground mb-4 animate-scale-in">
                  🎉 Você é um {profileData.title}!
                </h2>
                <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto animate-fade-in">
                  {profileData.description} Agora você tem o poder de aprender de forma ainda mais eficaz! ✨
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <Card className="bg-gradient-focus border-0">
                  <CardHeader>
                    <CardTitle className="text-primary">💡 Dicas para Estudar</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{profileData.tips}</p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-learning border-0">
                  <CardHeader>
                    <CardTitle className="text-primary">📊 Seus Resultados</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {Object.entries(results)
                        .sort(([,a], [,b]) => b - a)
                        .map(([profile, score]) => {
                          const profileInfo = profiles[profile as keyof typeof profiles];
                          return (
                            <div key={profile} className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <profileInfo.icon className="w-4 h-4" />
                                <span className="text-sm font-medium">{profileInfo.title}</span>
                              </div>
                              <span className="text-sm text-muted-foreground">
                                {score}/{questions.length}
                              </span>
                            </div>
                          );
                        })}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {dominantProfiles.length > 1 && (
                <Card className="bg-gradient-achievement border-0 mb-6">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-bold text-white mb-2">
                      🌟 Superpoder Combinado!
                    </h3>
                    <p className="text-white/90">
                      Você tem características equilibradas entre diferentes estilos de aprendizagem. 
                      Isso é fantástico! Significa que você pode adaptar sua forma de estudar conforme a situação.
                    </p>
                  </CardContent>
                </Card>
              )}

              <div className="text-center">
                <Button onClick={resetTest} variant="outline">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Refazer Teste
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle p-6">
      <div className="max-w-4xl mx-auto">
        <Card className="border-0 shadow-card">
          <CardHeader className="bg-gradient-learning rounded-t-lg">
            <div className="flex items-center justify-between text-green-700">
              <div>
                <CardTitle className="text-xl mb-2 text-green-700">Descobrir Como Eu Aprendo! 🧠</CardTitle>
                <p className="text-green-700">
                  Pergunta {currentQuestion + 1} de {questions.length}
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-700">{Math.round(((currentQuestion) / questions.length) * 100)}%</div>
                <div className="text-sm text-green-700">Completo</div>
              </div>
            </div>
            <Progress value={(currentQuestion / questions.length) * 100} className="mt-4" />
          </CardHeader>
          
          <CardContent className="p-8">
            <div className="mb-8">
              <h2 className="text-xl font-bold text-foreground mb-6 leading-relaxed">
                {questions[currentQuestion].scenario}
              </h2>
              
              <RadioGroup value={selectedAnswer} onValueChange={handleAnswerSelect}>
                <div className="space-y-4">
                  {questions[currentQuestion].options.map((option, index) => (
                    <div
                      key={index}
                      className={`rounded-lg border-2 p-4 cursor-pointer transition-all duration-200 ${
                        selectedAnswer === option.profile
                          ? 'border-primary bg-gradient-focus'
                          : 'border-border hover:border-primary/50 bg-white'
                      }`}
                      onClick={() => handleAnswerSelect(option.profile)}
                    >
                      <div className="flex items-center space-x-3">
                        <RadioGroupItem value={option.profile} id={`option-${index}`} />
                        <Label 
                          htmlFor={`option-${index}`} 
                          className="flex-1 cursor-pointer text-foreground leading-relaxed"
                        >
                          {option.text}
                        </Label>
                      </div>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </div>

            <div className="flex justify-between items-center">
              <Button
                variant="outline"
                onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                disabled={currentQuestion === 0}
              >
                Voltar
              </Button>
              
              <Button
                onClick={handleNextQuestion}
                disabled={!selectedAnswer}
                variant="outline"
                className="text-green-700 border-green-700 hover:bg-green-50"
              >
                {currentQuestion === questions.length - 1 ? 'Ver Resultado' : 'Próxima'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LearningStyleTest;