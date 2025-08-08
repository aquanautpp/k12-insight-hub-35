import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  Heart, 
  Star, 
  Bookmark,
  CheckCircle,
  Lightbulb,
  Rocket,
  DollarSign,
  Users,
  ArrowRight
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
interface Book {
  id: string;
  title: string;
  description: string;
  inspirationalText: string;
  ageRange: string;
  tags: string[];
  isFavorite: boolean;
  hasRead: boolean;
  color: string;
}

const ReadingRecommendations = () => {
  const [books, setBooks] = useState<Book[]>([
    // Empreendedorismo
    {
      id: 'se-vira-moleque',
      title: 'Se Vira, Moleque!',
      description: 'Protagonismo, autorresponsabilidade e atitude empreendedora para jovens.',
      inspirationalText: 'Você não espera que alguém faça tudo por você. Você pensa, planeja e faz acontecer! Isso é atitude empreendedora: ser o herói da sua própria história.',
      ageRange: '+16',
      tags: ['#protagonismo', '#atitude', '#responsabilidade'],
      isFavorite: false,
      hasRead: false,
      color: 'from-primary to-primary-foreground'
    },
    {
      id: 'manual-empreendedor-mirim',
      title: 'Manual do Empreendedor Mirim',
      description: 'Passo a passo prático para tirar ideias do papel e criar projetos incríveis.',
      inspirationalText: 'Todo grande negócio começou com uma pequena ideia. Esse manual é seu mapa do tesouro para transformar curiosidade em criação!',
      ageRange: '8+',
      tags: ['#empreendedorismo', '#projetos', '#criatividade'],
      isFavorite: true,
      hasRead: false,
      color: 'from-primary to-primary/80'
    },
    {
      id: 'a-menina-do-vale',
      title: 'A Menina do Vale - Como o Empreendedorismo Pode Mudar Sua Vida',
      description: 'História inspiradora de Bel Pesce no Vale do Silício, mostrando que empreendedorismo é para todos.',
      inspirationalText: 'Sonhe grande e persista! Este livro mostra que com dedicação e paixão, é possível transformar ideias em realidade, independentemente da idade ou gênero.',
      ageRange: '12+',
      tags: ['#empreendedorismo', '#inspiração', '#mulheres'],
      isFavorite: false,
      hasRead: false,
      color: 'from-primary/90 to-primary'
    },
    {
      id: 'meu-primeiro-negocio',
      title: 'Meu Primeiro Negócio',
      description: 'Conceitos básicos de gestão, lucro e criação de valor de forma divertida.',
      inspirationalText: 'Ter um negócio é como ser um super-herói: você resolve problemas e ainda ganha por isso. Descubra como transformar suas paixões em soluções que ajudam os outros.',
      ageRange: '9+',
      tags: ['#negócios', '#gestão', '#valor'],
      isFavorite: false,
      hasRead: true,
      color: 'from-primary/70 to-primary/90'
    },
    
    // Mulheres Inspiradoras
    {
      id: 'historias-garotas-rebeldes',
      title: 'Histórias de Ninar para Garotas Rebeldes',
      description: 'Coleção de histórias sobre mulheres que fizeram a diferença em diversas áreas.',
      inspirationalText: 'Apresenta modelos femininos fortes e bem-sucedidos, incentivando as meninas a sonharem alto e perseguirem seus objetivos com coragem.',
      ageRange: '8+',
      tags: ['#mulheres', '#inspiração', '#liderança'],
      isFavorite: true,
      hasRead: false,
      color: 'from-primary/60 to-primary/80'
    },
    
    // Educação Financeira
    {
      id: 'educacao-financeira-infantil',
      title: 'Coleção: Educação Financeira Infantil',
      description: 'Série de livros sobre valor do dinheiro, poupança e investimento para crianças.',
      inspirationalText: 'O dinheiro é uma sementinha. Se você cuidar dele, ele cresce. Aprender a usar bem o dinheiro é como ter um superpoder para realizar sonhos!',
      ageRange: '7+',
      tags: ['#dinheiro', '#poupança', '#investimento'],
      isFavorite: true,
      hasRead: false,
      color: 'from-primary/80 to-primary'
    },
    
    // Inteligência Emocional
    {
      id: 'monstro-das-cores',
      title: 'O Monstro das Cores',
      description: 'Livro visual e didático para introduzir as emoções às crianças através de cores.',
      inspirationalText: 'É uma ferramenta visual excelente para iniciar a conversa sobre emoções e a importância de organizá-las.',
      ageRange: '4+',
      tags: ['#emoções', '#cores', '#autoconhecimento'],
      isFavorite: false,
      hasRead: false,
      color: 'from-primary/50 to-primary/70'
    },
    {
      id: 'que-semana',
      title: 'Que Semana!',
      description: 'Desenvolvimento da inteligência emocional com situações cotidianas e atividades práticas.',
      inspirationalText: 'Oferece atividades práticas e cenários realistas para que as crianças desenvolvam suas habilidades socioemocionais.',
      ageRange: '6+',
      tags: ['#inteligência-emocional', '#atividades', '#cotidiano'],
      isFavorite: false,
      hasRead: false,
      color: 'from-primary/40 to-primary/60'
    },
    {
      id: 'elefante-nao-sabia-esperar',
      title: 'O Elefante que Não Sabia Esperar (Série As Emoções de Leo)',
      description: 'Série que aborda emoções específicas como paciência, frustração e raiva.',
      inspirationalText: 'Foca em emoções específicas, permitindo que as crianças compreendam e desenvolvam estratégias para lidar com cada uma delas.',
      ageRange: '5+',
      tags: ['#paciência', '#frustração', '#gestão-emocional'],
      isFavorite: false,
      hasRead: false,
      color: 'from-primary/30 to-primary/50'
    },
    {
      id: 'baralhinho-do-bem',
      title: 'Baralhinho do Bem',
      description: 'Jogos e atividades interativas para estimular a expressão de sentimentos.',
      inspirationalText: 'Promove a interação e a prática das habilidades socioemocionais de forma lúdica e engajadora.',
      ageRange: '6+',
      tags: ['#jogos', '#interação', '#expressão'],
      isFavorite: true,
      hasRead: false,
      color: 'from-primary/20 to-primary/40'
    }
  ]);

  const [selectedIdea, setSelectedIdea] = useState<string | null>(null);

  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const { data, error } = await supabase
        .from('user_books')
        .select('book_id, is_favorite, has_read')
        .eq('user_id', user.id);
      if (error) {
        console.error('Erro ao carregar leituras:', error);
        return;
      }
      setBooks((prev) =>
        prev.map((b) => {
          const row = data?.find((r) => r.book_id === b.id);
          return row ? { ...b, isFavorite: row.is_favorite, hasRead: row.has_read } : b;
        })
      );
    };
    load();
  }, [user]);
  const explorationIdeas = [
    {
      id: 'young-entrepreneurs',
      title: '🧒💼 Jovens Empreendedores na Vida Real',
      description: 'Conheça crianças que criaram apps, venderam pulseiras ou abriram lojinhas de bairro.',
      content: [
        'Moziah Bridges - Aos 9 anos criou uma empresa de gravatas e hoje vende para lojas famosas!',
        'Mikaila Ulmer - Começou vendendo limonada aos 4 anos e hoje tem uma empresa de bebidas naturais.',
        'Ryan Kaji - Criou um canal no YouTube aos 3 anos e hoje é um dos youtubers mais ricos do mundo!'
      ]
    },
    {
      id: 'product-journey',
      title: '🏭 Como um Produto é Feito',
      description: 'Do campo à caixinha de suco - entenda a cadeia de produção e criação de valor.',
      content: [
        '1. A ideia nasce: alguém percebe uma necessidade',
        '2. Pesquisa e desenvolvimento: testam a ideia',
        '3. Produção: fabricam o produto',
        '4. Distribuição: levam até as lojas',
        '5. Venda: chega até você!'
      ]
    },
    {
      id: 'discussion-idea',
      title: '🧠 Ideia para Discussão',
      description: 'Pense no seu brinquedo favorito e reflita sobre sua criação.',
      content: [
        'Quem teve a ideia desse brinquedo?',
        'Como essa pessoa transformou a ideia em realidade?',
        'Que problemas esse brinquedo resolve?',
        'Qual ideia você teria para deixar outras crianças mais felizes?'
      ]
    }
  ];

  const toggleFavorite = async (bookId: string) => {
    const current = books.find((b) => b.id === bookId);
    const next = !current?.isFavorite;
    setBooks(books.map((book) => (book.id === bookId ? { ...book, isFavorite: next } : book)));
    if (!user) return;
    const { error } = await supabase
      .from('user_books')
      .upsert({ user_id: user.id, book_id: bookId, is_favorite: next }, { onConflict: 'user_id,book_id' });
    if (error) {
      console.error('Erro ao atualizar favorito:', error);
      toast({ title: 'Não foi possível atualizar favorito', description: 'Tente novamente.' });
    }
  };

  const toggleRead = async (bookId: string) => {
    const current = books.find((b) => b.id === bookId);
    const next = !current?.hasRead;
    setBooks(books.map((book) => (book.id === bookId ? { ...book, hasRead: next } : book)));
    if (!user) return;
    const { error } = await supabase
      .from('user_books')
      .upsert({ user_id: user.id, book_id: bookId, has_read: next }, { onConflict: 'user_id,book_id' });
    if (error) {
      console.error('Erro ao atualizar leitura:', error);
      toast({ title: 'Não foi possível atualizar leitura', description: 'Tente novamente.' });
    }
  };
  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="max-w-6xl mx-auto p-6">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-primary mb-4">
            <Rocket className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Recomendações de Leitura 📚
          </h1>
           <div className="max-w-4xl mx-auto bg-white rounded-2xl p-6 border border-primary">
             <p className="text-lg text-foreground leading-relaxed text-justify">
               Descubra livros incríveis que vão desenvolver seu espírito empreendedor e inteligência emocional! 
               Cada livro foi escolhido especialmente para jovens pensadores como você. 💡
             </p>
             <p className="text-lg text-muted-foreground mt-3 text-justify">
               Explore histórias inspiradoras, aprenda sobre dinheiro, emoções e como transformar 
               suas ideias em realidade. <strong>Vamos nessa jornada literária?</strong> 🌟
             </p>
           </div>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="text-center rounded-xl border-primary">
            <CardContent className="p-6">
              <BookOpen className="w-8 h-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">{books.length}</div>
              <div className="text-sm text-muted-foreground">Livros Disponíveis</div>
            </CardContent>
          </Card>
          
          <Card className="text-center rounded-xl border-primary">
            <CardContent className="p-6">
              <Heart className="w-8 h-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">{books.filter(b => b.isFavorite).length}</div>
              <div className="text-sm text-muted-foreground">Favoritos</div>
            </CardContent>
          </Card>
          
          <Card className="text-center rounded-xl border-primary">
            <CardContent className="p-6">
              <CheckCircle className="w-8 h-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">{books.filter(b => b.hasRead).length}</div>
              <div className="text-sm text-muted-foreground">Já Lidos</div>
            </CardContent>
          </Card>
          
          <Card className="text-center rounded-xl border-primary">
            <CardContent className="p-6">
              <Star className="w-8 h-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">
                {Math.round((books.filter(b => b.hasRead).length / books.length) * 100)}%
              </div>
              <div className="text-sm text-muted-foreground">Progresso</div>
            </CardContent>
          </Card>
        </div>

        {/* Livros por Categoria */}
        <div className="space-y-8 mb-8">
          {/* Empreendedorismo */}
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Rocket className="w-6 h-6 text-primary" />
                🚀 Empreendedorismo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {books.filter(book => book.tags.some(tag => tag.includes('empreendedorismo') || tag.includes('negócios') || tag.includes('protagonismo'))).map((book) => (
                  <Card key={book.id} className="overflow-hidden shadow-card hover:shadow-lg transition-shadow border-primary/10">
                    <div className={`h-4 bg-gradient-to-r ${book.color}`}></div>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-foreground mb-2">{book.title}</h3>
                          <p className="text-muted-foreground text-sm mb-3">{book.description}</p>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleFavorite(book.id)}
                            className="p-2"
                          >
                            <Heart className={`w-4 h-4 ${book.isFavorite ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleRead(book.id)}
                            className="p-2"
                          >
                             <CheckCircle className={`w-4 h-4 ${book.hasRead ? 'fill-green-600 text-white' : 'text-muted-foreground'}`} />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="bg-primary/5 rounded-lg p-4 mb-4 border-l-4 border-primary">
                        <p className="text-primary text-sm font-medium mb-1">💭 Trecho Inspirador:</p>
                        <p className="text-primary/80 text-sm italic">"{book.inspirationalText}"</p>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex gap-2 flex-wrap">
                          <Badge variant="outline" className="text-xs border-primary/30">Idade: {book.ageRange}</Badge>
                          {book.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs bg-primary/10 text-primary">{tag}</Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Mulheres Inspiradoras */}
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-6 h-6 text-primary" />
                👩 Mulheres Inspiradoras
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {books.filter(book => book.tags.some(tag => tag.includes('mulheres') || tag.includes('inspiração') || tag.includes('liderança'))).map((book) => (
                  <Card key={book.id} className="overflow-hidden shadow-card hover:shadow-lg transition-shadow border-primary/10">
                    <div className={`h-4 bg-gradient-to-r ${book.color}`}></div>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-foreground mb-2">{book.title}</h3>
                          <p className="text-muted-foreground text-sm mb-3">{book.description}</p>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleFavorite(book.id)}
                            className="p-2"
                          >
                            <Heart className={`w-4 h-4 ${book.isFavorite ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleRead(book.id)}
                            className="p-2"
                          >
                             <CheckCircle className={`w-4 h-4 ${book.hasRead ? 'fill-green-600 text-white' : 'text-muted-foreground'}`} />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="bg-primary/5 rounded-lg p-4 mb-4 border-l-4 border-primary">
                        <p className="text-primary text-sm font-medium mb-1">💭 Trecho Inspirador:</p>
                        <p className="text-primary/80 text-sm italic">"{book.inspirationalText}"</p>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex gap-2 flex-wrap">
                          <Badge variant="outline" className="text-xs border-primary/30">Idade: {book.ageRange}</Badge>
                          {book.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs bg-primary/10 text-primary">{tag}</Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Educação Financeira */}
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-6 h-6 text-primary" />
                💰 Educação Financeira
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {books.filter(book => book.tags.some(tag => tag.includes('dinheiro') || tag.includes('poupança') || tag.includes('investimento'))).map((book) => (
                  <Card key={book.id} className="overflow-hidden shadow-card hover:shadow-lg transition-shadow border-primary/10">
                    <div className={`h-4 bg-gradient-to-r ${book.color}`}></div>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-foreground mb-2">{book.title}</h3>
                          <p className="text-muted-foreground text-sm mb-3">{book.description}</p>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleFavorite(book.id)}
                            className="p-2"
                          >
                            <Heart className={`w-4 h-4 ${book.isFavorite ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleRead(book.id)}
                            className="p-2"
                          >
                             <CheckCircle className={`w-4 h-4 ${book.hasRead ? 'fill-green-600 text-white' : 'text-muted-foreground'}`} />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="bg-primary/5 rounded-lg p-4 mb-4 border-l-4 border-primary">
                        <p className="text-primary text-sm font-medium mb-1">💭 Trecho Inspirador:</p>
                        <p className="text-primary/80 text-sm italic">"{book.inspirationalText}"</p>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex gap-2 flex-wrap">
                          <Badge variant="outline" className="text-xs border-primary/30">Idade: {book.ageRange}</Badge>
                          {book.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs bg-primary/10 text-primary">{tag}</Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Inteligência Emocional */}
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-6 h-6 text-primary" />
                💚 Inteligência Emocional
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {books.filter(book => book.tags.some(tag => tag.includes('emoções') || tag.includes('inteligência-emocional') || tag.includes('autoconhecimento') || tag.includes('paciência') || tag.includes('gestão-emocional') || tag.includes('jogos') || tag.includes('expressão'))).map((book) => (
                  <Card key={book.id} className="overflow-hidden shadow-card hover:shadow-lg transition-shadow border-primary/10">
                    <div className={`h-4 bg-gradient-to-r ${book.color}`}></div>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-foreground mb-2">{book.title}</h3>
                          <p className="text-muted-foreground text-sm mb-3">{book.description}</p>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleFavorite(book.id)}
                            className="p-2"
                          >
                            <Heart className={`w-4 h-4 ${book.isFavorite ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleRead(book.id)}
                            className="p-2"
                          >
                            <CheckCircle className={`w-4 h-4 ${book.hasRead ? 'fill-green-600 text-white' : 'text-muted-foreground'}`} />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="bg-primary/5 rounded-lg p-4 mb-4 border-l-4 border-primary">
                        <p className="text-primary text-sm font-medium mb-1">💭 Trecho Inspirador:</p>
                        <p className="text-primary/80 text-sm italic">"{book.inspirationalText}"</p>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex gap-2 flex-wrap">
                          <Badge variant="outline" className="text-xs border-primary/30">Idade: {book.ageRange}</Badge>
                          {book.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs bg-primary/10 text-primary">{tag}</Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Dicas para Pais e Educadores */}
        <Card className="mb-8 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-6 h-6 text-primary" />
              👨‍👩‍👧‍👦 Dicas para Pais e Educadores
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6 border-primary/20">
                <h3 className="font-semibold text-primary mb-4">📖 Leia junto</h3>
                <p className="text-muted-foreground text-sm">
                  A leitura compartilhada é uma ótima oportunidade para conversar sobre as emoções e 
                  os conceitos de negócios apresentados nos livros.
                </p>
              </Card>
              
              <Card className="p-6 border-primary/20">
                <h3 className="font-semibold text-primary mb-4">💬 Incentive a discussão</h3>
                <p className="text-muted-foreground text-sm">
                  Faça perguntas como "O que você faria nessa situação?", "Como você se sentiria?" 
                  ou "Que ideia você teria para resolver esse problema?".
                </p>
              </Card>
              
              <Card className="p-6 border-primary/20">
                <h3 className="font-semibold text-primary mb-4">🎯 Crie oportunidades</h3>
                <p className="text-muted-foreground text-sm">
                  Incentive as crianças a colocarem em prática o que aprenderam, seja através de um 
                  pequeno projeto de "negócio" em casa ou atividades que estimulem a expressão emocional.
                </p>
              </Card>
              
              <Card className="p-6 border-primary/20">
                <h3 className="font-semibold text-primary mb-4">⭐ Seja um exemplo</h3>
                <p className="text-muted-foreground text-sm">
                  Demonstre suas próprias emoções de forma saudável e converse sobre como você 
                  lida com os desafios do dia a dia.
                </p>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* Seção Extra: Ideias para Explorar */}
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="w-6 h-6 text-primary" />
              💡 Ideias para Explorar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {explorationIdeas.map((idea) => (
                <Card 
                  key={idea.id}
                  className={`cursor-pointer transition-all hover:shadow-md border-primary/10 ${
                    selectedIdea === idea.id ? 'border-primary shadow-md' : ''
                  }`}
                  onClick={() => setSelectedIdea(selectedIdea === idea.id ? null : idea.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">{idea.title}</h3>
                        <p className="text-sm text-muted-foreground">{idea.description}</p>
                      </div>
                      <ArrowRight className={`w-5 h-5 text-primary transition-transform ${
                        selectedIdea === idea.id ? 'rotate-90' : ''
                      }`} />
                    </div>
                    
                    {selectedIdea === idea.id && (
                      <div className="mt-4 pt-4 border-t border-primary/20">
                        <div className="space-y-2">
                          {idea.content.map((item, index) => (
                            <div key={index} className="flex items-start gap-2">
                              <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                              <p className="text-sm text-foreground">{item}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
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

export default ReadingRecommendations;