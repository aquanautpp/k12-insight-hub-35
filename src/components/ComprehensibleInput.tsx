import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Play, 
  Clock, 
  TrendingUp, 
  ArrowUp, 
  ArrowDown, 
  CheckCircle, 
  Globe,
  Headphones,
  BookOpen,
  Tv,
  Music,
  MessageCircle,
  Star,
  Timer,
  Target,
  Volume2,
  Eye,
  Lightbulb,
  Heart
} from 'lucide-react';

const ComprehensibleInput = () => {
  const [currentLevel, setCurrentLevel] = useState('iniciante');
  const [dailyMinutes, setDailyMinutes] = useState(0);
  const [weeklyGoal] = useState(150); // 150 minutes per week

  const levels = [
    {
      id: 'iniciante',
      title: 'Iniciante Absoluto',
      description: 'Entender mensagens simples com muito apoio visual',
      color: 'bg-green-100 text-green-800',
      activities: [
        { icon: Play, title: 'Vídeos infantis no YouTube', description: 'Com gestos, figuras e histórias curtas' },
        { icon: BookOpen, title: 'Livros ilustrados', description: 'Pouco texto, muita imagem' },
        { icon: Headphones, title: 'Podcasts para iniciantes', description: 'Fala mais lenta, temas do dia a dia' },
        { icon: Tv, title: 'Séries e filmes', description: 'Com legendas na língua-alvo' },
        { icon: Music, title: 'Músicas simples', description: 'Refrões fáceis e repetitivos' },
        { icon: MessageCircle, title: 'Shadowing', description: 'Imite trechos curtos de podcasts/vídeos' }
      ]
    },
    {
      id: 'basico',
      title: 'Básico',
      description: 'Manter a compreensão com menos apoio visual',
      color: 'bg-blue-100 text-blue-800',
      activities: [
        { icon: BookOpen, title: 'Histórias graduadas', description: 'Um pouco mais de texto, ainda claras' },
        { icon: Headphones, title: 'Podcasts 5-10 min', description: 'Temas previsíveis' },
        { icon: Play, title: 'Vídeos com legendas', description: 'Na língua-alvo' },
        { icon: BookOpen, title: 'Leitura leve', description: 'Posts curtos, resumos simples' },
        { icon: MessageCircle, title: 'Shadowing frases', description: '1-2 frases por vez' }
      ]
    },
    {
      id: 'intermediario',
      title: 'Intermediário',
      description: 'Entender conteúdos do dia a dia com vocabulário natural',
      color: 'bg-orange-100 text-orange-800',
      activities: [
        { icon: Play, title: 'Vídeos nativos', description: 'Vlogs, receitas, reviews' },
        { icon: Headphones, title: 'Podcasts nativos', description: 'Temas que você conhece' },
        { icon: BookOpen, title: 'Artigos curtos', description: 'Sites de notícias acessíveis' },
        { icon: Tv, title: 'Sitcoms e talk shows', description: 'Menos apoio visual' },
        { icon: MessageCircle, title: 'Shadowing 10-20s', description: 'Foco em ritmo e entonação' }
      ]
    },
    {
      id: 'avancado',
      title: 'Avançado',
      description: 'Entender materiais autênticos quase sem apoio',
      color: 'bg-purple-100 text-purple-800',
      activities: [
        { icon: Headphones, title: 'Podcasts sem roteiro', description: 'Entrevistas nativas' },
        { icon: BookOpen, title: 'Artigos longos', description: 'Jornais e revistas' },
        { icon: Tv, title: 'Filmes naturais', description: 'Legenda só quando necessário' },
        { icon: MessageCircle, title: 'Shadowing 30-60s', description: 'Priorizando fluidez' }
      ]
    }
  ];

  const difficultyLevels = [
    {
      level: 'Muito fácil',
      description: 'Você entende tudo e quase não aprende nada novo',
      icon: ArrowDown,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      action: 'Suba um degrau'
    },
    {
      level: 'No ponto',
      description: 'Você entende a ideia geral e encontra algumas novidades',
      icon: Target,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      action: 'Continue assim!'
    },
    {
      level: 'Difícil',
      description: 'Você pausa o tempo todo e perde o fio da história',
      icon: ArrowUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      action: 'Desça meio degrau'
    }
  ];

  const routineExamples = [
    {
      duration: '10 minutos',
      activities: ['1 vídeo curto com gestos/figuras', 'Marcar dificuldade'],
      icon: Timer
    },
    {
      duration: '20 minutos', 
      activities: ['1 podcast para iniciantes', '2 trechos de shadowing', 'Marcar dificuldade'],
      icon: Clock
    },
    {
      duration: '30 minutos',
      activities: ['1 episódio com legenda na língua-alvo', '1 bloco de leitura leve', 'Marcar dificuldade'],
      icon: TrendingUp
    }
  ];

  const currentLevelData = levels.find(level => level.id === currentLevel);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-learning text-white mb-4">
          <Globe className="w-8 h-8 text-olive-700" />
        </div>
        <h1 className="text-3xl font-bold text-foreground">Como Aprender Línguas Estrangeiras</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-4">
          Descubra métodos eficazes para dominar novos idiomas através do Comprehensible Input
        </p>
        <div className="mb-6 p-4 bg-white/80 rounded-lg max-w-4xl mx-auto">
          <h3 className="font-semibold text-emerald-800 mb-3">📚 O que é Comprehensible Input?</h3>
          <p className="mb-3 text-emerald-700">
            O Comprehensible Input é uma teoria fundamental na aquisição de segunda língua, popularizada pelo linguista Stephen Krashen. A hipótese central de Krashen é que a aquisição de uma segunda língua ocorre quando os aprendizes são expostos a uma linguagem que eles podem entender, mesmo que contenha estruturas e vocabulário ligeiramente além de seu nível atual de proficiência.
          </p>
          <p className="mb-3 text-emerald-700">
            Ao contrário de abordagens tradicionais que enfatizam a gramática explícita e a produção forçada, o CI sugere que a aquisição da linguagem é um processo subconsciente, semelhante à forma como as crianças adquirem sua primeira língua. O foco está na compreensão da mensagem, e não na análise formal da linguagem.
          </p>
          <p className="mb-3 text-emerald-700">
            Quando os aprendizes se concentram em entender o significado, a gramática e o vocabulário são adquiridos naturalmente como um subproduto desse processo. É um processo subconsciente, natural e implícito, semelhante à forma como as crianças adquirem sua língua materna.
          </p>
          <p className="font-medium text-emerald-800">
            Ocorre quando o aprendiz se concentra na comunicação e na compreensão da mensagem, sem estar ciente de que está adquirindo novas regras gramaticais ou vocabulário. É um processo "sentir" a linguagem.
          </p>
        </div>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Você aprende de verdade quando entende o que ouve e lê. Escolha conteúdos que estejam "um degrau acima do confortável": você entende quase tudo, mas existem algumas coisas novas que dão leve desafio — sem travar.
        </p>
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 max-w-2xl mx-auto">
          <p className="text-sm text-primary font-medium">
            💡 Procure o ponto certo: entende a história e encontra algumas novidades. Se estiver fácil demais, suba um degrau; se estiver pesado, desça meio degrau.
          </p>
        </div>
      </div>

      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Seu Progresso Semanal
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Meta semanal: {weeklyGoal} minutos</span>
              <span className="text-sm text-muted-foreground">{dailyMinutes}/{weeklyGoal} min</span>
            </div>
            <Progress value={(dailyMinutes / weeklyGoal) * 100} className="h-3" />
            <p className="text-xs text-muted-foreground">
              "A consistência vale mais do que a perfeição. Um pouco todo dia."
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Difficulty Levels Guide */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Encontre Seu "Um Degrau Acima do Confortável"
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            {difficultyLevels.map((level, index) => {
              const Icon = level.icon;
              return (
                <div key={index} className={`${level.bgColor} rounded-lg p-4 border border-border/50`}>
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className={`w-5 h-5 ${level.color}`} />
                    <h3 className={`font-semibold ${level.color}`}>{level.level}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{level.description}</p>
                  <Badge variant="outline" className="text-xs">
                    {level.action}
                  </Badge>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Learning Path */}
      <Card>
        <CardHeader>
          <CardTitle>Sua Trilha de Aprendizagem</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={currentLevel} onValueChange={setCurrentLevel}>
            <TabsList className="grid w-full grid-cols-4">
              {levels.map((level) => (
                <TabsTrigger key={level.id} value={level.id} className="text-xs">
                  {level.title}
                </TabsTrigger>
              ))}
            </TabsList>

            {levels.map((level) => (
              <TabsContent key={level.id} value={level.id} className="mt-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Badge className={level.color}>{level.title}</Badge>
                    <p className="text-sm text-muted-foreground">{level.description}</p>
                  </div>

                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {level.activities.map((activity, index) => {
                      const Icon = activity.icon;
                      return (
                        <Card key={index} className="bg-white/80 hover:bg-white/90 hover:shadow-lg transition-all">
                          <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                                <Icon className="w-5 h-5 text-primary" />
                              </div>
                              <div>
                                <h4 className="font-medium text-sm mb-1">{activity.title}</h4>
                                <p className="text-xs text-muted-foreground">{activity.description}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>

                  {level.id !== 'avancado' && (
                    <div className="bg-muted/50 rounded-lg p-4 mt-6">
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <ArrowUp className="w-4 h-4" />
                        Como subir um degrau:
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {level.id === 'iniciante' && 'Quando os vídeos infantis ficarem "muito fáceis", passe para histórias um pouco mais longas ou podcasts curtos com menos pausas.'}
                        {level.id === 'basico' && 'Aumente a duração do áudio/vídeo sem perder a compreensão. Troque alguns textos fáceis por textos com mais detalhes.'}
                        {level.id === 'intermediario' && 'Diminuir gradualmente o uso de legendas. Alternar conteúdos favoritos com novos temas para ampliar vocabulário.'}
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* Routine Examples */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Rotinas Sugeridas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            {routineExamples.map((routine, index) => {
              const Icon = routine.icon;
              return (
                <Card key={index} className="border-2 border-dashed border-border hover:border-primary/50 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Icon className="w-5 h-5 text-primary" />
                      <h3 className="font-semibold">{routine.duration}</h3>
                    </div>
                    <ul className="space-y-1">
                      {routine.activities.map((activity, actIndex) => (
                        <li key={actIndex} className="text-sm text-muted-foreground flex items-center gap-2">
                          <CheckCircle className="w-3 h-3 text-green-600" />
                          {activity}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Tools and Support */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5" />
            Ferramentas de Apoio
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold">Como usar sem "viciar":</h3>
              <ol className="space-y-2 text-sm text-muted-foreground">
                <li className="flex gap-2">
                  <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs">1</span>
                  Primeiro, contexto e imagens
                </li>
                <li className="flex gap-2">
                  <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs">2</span>
                  Depois, exemplo na própria língua-alvo
                </li>
                <li className="flex gap-2">
                  <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs">3</span>
                  Por fim, definição curta e tradução pontual só se necessário
                </li>
              </ol>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-semibold">Apps recomendados:</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                  <Volume2 className="w-4 h-4 text-primary" />
                  <span className="text-sm">LingoLooper - Treino de pronúncia</span>
                </div>
                <div className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                  <MessageCircle className="w-4 h-4 text-primary" />
                  <span className="text-sm">Elsa Speak - Ritmo e sons</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mt-6">
            <p className="text-sm text-primary font-medium">
              💡 Tente entender pela história. Só procure ajuda quando realmente precisar.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Key Messages */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="bg-gradient-learning text-white">
          <CardContent className="p-6 text-center">
            <Star className="w-8 h-8 mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Entender é vencer</h3>
            <p className="text-sm opacity-90">O resto vem junto</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-achievement text-white">
          <CardContent className="p-6 text-center">
            <Target className="w-8 h-8 mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Um degrau acima</h3>
            <p className="text-sm opacity-90">A história flui, mas tem pitadas novas</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
          <CardContent className="p-6 text-center">
            <Heart className="w-8 h-8 mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Sem pressa, sem provas</h3>
            <p className="text-sm opacity-90">Só você, a língua e conteúdos que fazem sentido</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ComprehensibleInput;