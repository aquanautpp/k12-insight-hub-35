import { useState } from "react";
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
    {
      id: 'se-vira-moleque',
      title: 'Se Vira, Moleque!',
      description: 'Protagonismo, autorresponsabilidade e atitude empreendedora para jovens.',
      inspirationalText: 'Você não espera que alguém faça tudo por você. Você pensa, planeja e faz acontecer! Isso é atitude empreendedora: ser o herói da sua própria história.',
      ageRange: '10+',
      tags: ['#protagonismo', '#atitude', '#responsabilidade'],
      isFavorite: false,
      hasRead: false,
      color: 'from-blue-500 to-blue-700'
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
      color: 'from-green-500 to-green-700'
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
      color: 'from-purple-500 to-purple-700'
    },
    {
      id: 'educacao-financeira-infantil',
      title: 'Coleção: Educação Financeira Infantil',
      description: 'Série de livros sobre valor do dinheiro, poupança e investimento para crianças.',
      inspirationalText: 'O dinheiro é uma sementinha. Se você cuidar dele, ele cresce. Aprender a usar bem o dinheiro é como ter um superpoder para realizar sonhos!',
      ageRange: '7+',
      tags: ['#dinheiro', '#poupança', '#investimento'],
      isFavorite: true,
      hasRead: false,
      color: 'from-gold-400 to-gold-600'
    }
  ]);

  const [selectedIdea, setSelectedIdea] = useState<string | null>(null);

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

  const toggleFavorite = (bookId: string) => {
    setBooks(books.map(book => 
      book.id === bookId ? { ...book, isFavorite: !book.isFavorite } : book
    ));
  };

  const toggleRead = (bookId: string) => {
    setBooks(books.map(book => 
      book.id === bookId ? { ...book, hasRead: !book.hasRead } : book
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="max-w-6xl mx-auto p-6">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 mb-4">
            <Rocket className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Olá, futuro empreendedor e pensador! 🚀
          </h1>
          <div className="max-w-4xl mx-auto bg-gradient-to-br from-gold-50 to-orange-50 rounded-2xl p-6 border border-gold-200">
            <p className="text-lg text-gold-800 leading-relaxed">
              Descubra como grandes ideias nascem, como os produtos chegam até nós e como você pode criar 
              projetos incríveis que ajudam o mundo — e ainda ganhar por isso! 💡
            </p>
            <p className="text-lg text-gold-700 mt-3">
              Essa seleção de livros vai te mostrar como usar sua criatividade, inteligência e atitude 
              para virar o protagonista da sua própria história. <strong>Vamos nessa?</strong> 🌟
            </p>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="text-center">
            <CardContent className="p-6">
              <BookOpen className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">{books.length}</div>
              <div className="text-sm text-muted-foreground">Livros Disponíveis</div>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="p-6">
              <Heart className="w-8 h-8 text-red-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">{books.filter(b => b.isFavorite).length}</div>
              <div className="text-sm text-muted-foreground">Favoritos</div>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="p-6">
              <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">{books.filter(b => b.hasRead).length}</div>
              <div className="text-sm text-muted-foreground">Já Lidos</div>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="p-6">
              <Star className="w-8 h-8 text-gold-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">
                {Math.round((books.filter(b => b.hasRead).length / books.length) * 100)}%
              </div>
              <div className="text-sm text-muted-foreground">Progresso</div>
            </CardContent>
          </Card>
        </div>

        {/* Livros Recomendados */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-primary" />
              📚 Livros Recomendados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {books.map((book) => (
                <Card key={book.id} className="overflow-hidden shadow-card hover:shadow-lg transition-shadow">
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
                          <CheckCircle className={`w-4 h-4 ${book.hasRead ? 'fill-green-500 text-green-500' : 'text-muted-foreground'}`} />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="bg-blue-50 rounded-lg p-4 mb-4 border-l-4 border-blue-400">
                      <p className="text-blue-800 text-sm font-medium mb-1">💭 Trecho Inspirador:</p>
                      <p className="text-blue-700 text-sm italic">"{book.inspirationalText}"</p>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex gap-2 flex-wrap">
                        <Badge variant="outline" className="text-xs">Idade: {book.ageRange}</Badge>
                        {book.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex gap-2 mt-4">
                      <Button 
                        variant="outline"
                        className="flex-1 text-green-700 border-green-700 hover:bg-green-50"
                        onClick={() => toggleRead(book.id)}
                      >
                        {book.hasRead ? (
                          <>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Já li!
                          </>
                        ) : (
                          <>
                            <BookOpen className="w-4 h-4 mr-2" />
                            Quero ler
                          </>
                        )}
                      </Button>
                      <Button variant="outline" size="sm" className="text-green-700 border-green-700">
                        <Bookmark className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Seção Extra: Ideias para Explorar */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="w-6 h-6 text-gold-500" />
              💡 Ideias para Explorar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {explorationIdeas.map((idea) => (
                <Card 
                  key={idea.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
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
                      <ArrowRight className={`w-5 h-5 text-muted-foreground transition-transform ${
                        selectedIdea === idea.id ? 'rotate-90' : ''
                      }`} />
                    </div>
                    
                    {selectedIdea === idea.id && (
                      <div className="mt-4 pt-4 border-t">
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