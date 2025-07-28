import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Brain, Lightbulb, Eye, Calculator, MessageSquare } from "lucide-react";
import { toast } from "sonner";

type CPAStage = 'concrete' | 'pictorial' | 'abstract' | 'adaptive';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'meraki';
  timestamp: Date;
  stage?: CPAStage;
  visualElements?: {
    type: 'concrete' | 'pictorial' | 'abstract';
    content: string;
  }[];
}

const MerakiChatTutor = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Olá! Sou Meraki, seu tutor inteligente baseado no Método de Singapura. Vou te ajudar a compreender matemática através dos três estágios: Concreto (objetos físicos), Pictórico (representações visuais) e Abstrato (símbolos matemáticos). Como posso ajudar você hoje?',
      sender: 'meraki',
      timestamp: new Date(),
      stage: 'adaptive'
    }
  ]);
  
  const [inputMessage, setInputMessage] = useState('');
  const [currentStage, setCurrentStage] = useState<CPAStage>('adaptive');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const stageInfo = {
    concrete: {
      title: 'Concreto',
      icon: '🧱',
      color: 'bg-orange-100 text-orange-800',
      description: 'Manipulação física de objetos'
    },
    pictorial: {
      title: 'Pictórico', 
      icon: '🎨',
      color: 'bg-blue-100 text-blue-800',
      description: 'Representações visuais e diagramas'
    },
    abstract: {
      title: 'Abstrato',
      icon: '🔢',
      color: 'bg-purple-100 text-purple-800', 
      description: 'Símbolos e operações matemáticas'
    },
    adaptive: {
      title: 'Adaptativo',
      icon: '🧠',
      color: 'bg-green-100 text-green-800',
      description: 'Escolho o melhor método para você'
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const generateMerakiResponse = async (userMessage: string, stage: CPAStage): Promise<{ content: string; visualElements?: any[] }> => {
    // Análise da mensagem para identificar conceitos matemáticos
    const mathTopics = {
      addition: /somar|adição|mais|\+|adicionar/i,
      subtraction: /subtrair|subtração|menos|\-|tirar/i,
      multiplication: /multiplicar|multiplicação|vezes|x|\*|grupos/i,
      division: /dividir|divisão|÷|\/|repartir|distribuir/i,
      fractions: /fração|frações|meio|metade|terço|quarto|parte|partes/i,
      decimals: /decimal|decimais|vírgula|centésimo|décimo/i,
      geometry: /geometria|forma|formas|círculo|quadrado|triângulo|retângulo/i,
      measurement: /medida|medidas|metro|centímetro|quilograma|litro/i
    };

    // Resposta baseada no estágio CPA
    const responses = {
      concrete: {
        addition: "Vamos usar objetos físicos! 🧱 Pegue alguns blocos ou lápis. Para somar 3 + 5, coloque 3 objetos de um lado e 5 do outro. Agora junte todos e conte: 1, 2, 3, 4, 5, 6, 7, 8. Resultado: 8!",
        subtraction: "Use cubos coloridos! 🟦 Comece com 8 cubos. Para calcular 8 - 3, retire 3 cubos fisicamente. Conte os que sobraram: 5 cubos!",
        multiplication: "Forme grupos iguais! 🎯 Para 4 × 3, faça 4 grupos com 3 objetos cada. Conte todos os objetos: 12!",
        fractions: "Use uma pizza de brinquedo! 🍕 Para mostrar 3/4, corte a pizza em 4 pedaços iguais e separe 3 pedaços.",
        geometry: "Manipule formas físicas! 📐 Use blocos geométricos para sentir vértices, arestas e faces."
      },
      pictorial: {
        addition: "Desenhe o problema! ✏️ Faça 3 círculos de um lado e 5 do outro. Una-os com uma linha e conte o total: 8 círculos.",
        subtraction: "Use o modelo de barras! 📊 Desenhe uma barra com 8 quadrados, risque 3 quadrados. Sobram 5!",
        multiplication: "Desenhe arrays! 📱 Para 4 × 3, desenhe 4 fileiras com 3 pontos cada. Total: 12 pontos organizados.",
        fractions: "Use diagramas circulares! ⭕ Desenhe um círculo, divida em 4 partes, pinte 3 partes para mostrar 3/4.",
        geometry: "Faça diagramas! 📐 Desenhe formas e marque seus elementos: lados, ângulos, vértices."
      },
      abstract: {
        addition: "Agora use símbolos! 🔢 3 + 5 = 8. Você já entende que o '+' significa juntar quantidades.",
        subtraction: "Com símbolos matemáticos! ➖ 8 - 3 = 5. O '-' representa tirar ou encontrar a diferença.",
        multiplication: "Algoritmo formal! ✖️ 4 × 3 = 12. Você já sabe que × significa grupos iguais.",
        fractions: "Notação matemática! 📝 3/4 representa 3 partes de um todo dividido em 4 partes iguais.",
        geometry: "Fórmulas e propriedades! 📏 Use as fórmulas geométricas que você já compreende conceitualmente."
      }
    };

    // Identifica o tópico matemático
    let topic = 'general';
    for (const [key, regex] of Object.entries(mathTopics)) {
      if (regex.test(userMessage)) {
        topic = key;
        break;
      }
    }

    // Gera resposta baseada no estágio
    if (stage === 'adaptive') {
      const concreteResp = responses.concrete[topic as keyof typeof responses.concrete] || responses.concrete.addition;
      const pictorialResp = responses.pictorial[topic as keyof typeof responses.pictorial] || responses.pictorial.addition;
      const abstractResp = responses.abstract[topic as keyof typeof responses.abstract] || responses.abstract.addition;
      
      return {
        content: `Vou te ensinar usando o Método de Singapura completo! 🎓

🧱 **ESTÁGIO CONCRETO:**
${concreteResp}

🎨 **ESTÁGIO PICTÓRICO:**
${pictorialResp}

🔢 **ESTÁGIO ABSTRATO:**
${abstractResp}

Qual estágio ajudou mais na sua compreensão? Posso focar em um específico se preferir!`,
        visualElements: [
          { type: 'concrete', content: concreteResp },
          { type: 'pictorial', content: pictorialResp },
          { type: 'abstract', content: abstractResp }
        ]
      };
    }

    // Resposta específica para um estágio
    const stageResponses = {
      concrete: responses.concrete[topic as keyof typeof responses.concrete] || "Vamos usar objetos físicos para entender este conceito! Use materiais manipuláveis como blocos, cubos ou objetos do cotidiano.",
      pictorial: responses.pictorial[topic as keyof typeof responses.pictorial] || "Vamos desenhar e visualizar! Use diagramas, modelos de barras e representações visuais para compreender.",
      abstract: responses.abstract[topic as keyof typeof responses.abstract] || "Agora vamos trabalhar com símbolos matemáticos! Use as operações e algoritmos formais."
    };

    return {
      content: stageResponses[stage] || "Como posso ajudar você a compreender melhor este conceito matemático?",
      visualElements: [{ type: stage, content: stageResponses[stage] || "" }]
    };
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date(),
      stage: currentStage
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await generateMerakiResponse(inputMessage, currentStage);
      
      const merakiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.content,
        sender: 'meraki',
        timestamp: new Date(),
        stage: currentStage,
        visualElements: response.visualElements
      };

      setMessages(prev => [...prev, merakiMessage]);
      
      toast.success("Meraki respondeu com explicação CPA!");
    } catch (error) {
      toast.error("Erro ao processar resposta");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Brain className="h-12 w-12 text-primary" />
            <h1 className="text-4xl font-bold text-foreground">Meraki Chat Tutor</h1>
          </div>
          <p className="text-lg text-muted-foreground">
            Inteligência Artificial + Método de Singapura (CPA)
          </p>
        </div>

        {/* Stage Selection */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {Object.entries(stageInfo).map(([key, info]) => (
            <Button
              key={key}
              variant={currentStage === key ? "default" : "outline"}
              size="lg"
              onClick={() => setCurrentStage(key as CPAStage)}
              className="flex items-center gap-2"
            >
              <span className="text-lg">{info.icon}</span>
              {info.title}
            </Button>
          ))}
        </div>

        {/* Current Stage Info */}
        <Card className="mb-6 bg-muted/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Badge className={stageInfo[currentStage].color}>
                <span className="mr-1">{stageInfo[currentStage].icon}</span>
                {stageInfo[currentStage].title}
              </Badge>
              <p className="text-muted-foreground">
                {stageInfo[currentStage].description}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Chat Area */}
        <Card className="h-[600px] flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Conversa com Meraki
            </CardTitle>
          </CardHeader>
          
          <CardContent className="flex-1 flex flex-col p-0">
            <ScrollArea className="flex-1 px-6" ref={scrollRef}>
              <div className="space-y-4 pb-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-4 ${
                        message.sender === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        {message.sender === 'meraki' && (
                          <>
                            <Brain className="h-4 w-4 text-primary" />
                            <span className="font-semibold text-primary">Meraki</span>
                          </>
                        )}
                        {message.stage && (
                          <Badge variant="secondary" className="text-xs">
                            <span className="mr-1">{stageInfo[message.stage].icon}</span>
                            {stageInfo[message.stage].title}
                          </Badge>
                        )}
                        <span className="text-xs opacity-70">
                          {message.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                      <div className="whitespace-pre-wrap">{message.content}</div>
                    </div>
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-muted rounded-lg p-4 max-w-[70%]">
                      <div className="flex items-center gap-2">
                        <Brain className="h-4 w-4 text-primary animate-pulse" />
                        <span>Meraki está pensando...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="border-t p-6">
              <div className="flex gap-3">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={`Pergunte sobre matemática (modo ${stageInfo[currentStage].title})...`}
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button 
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isLoading}
                  size="icon"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2 text-center">
                Meraki adapta as explicações ao Método de Singapura (CPA) ✨
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card 
            className="p-4 hover:bg-muted/50 cursor-pointer transition-colors"
            onClick={() => {
              setInputMessage("Me dê um exemplo de problema de adição para praticar");
              handleSendMessage();
            }}
          >
            <div className="flex items-center gap-3">
              <Lightbulb className="h-6 w-6 text-yellow-500" />
              <div>
                <h3 className="font-semibold">Exemplo de Problema</h3>
                <p className="text-sm text-muted-foreground">Veja como resolver um problema</p>
              </div>
            </div>
          </Card>
          
          <Card 
            className="p-4 hover:bg-muted/50 cursor-pointer transition-colors"
            onClick={() => {
              setCurrentStage('pictorial');
              setInputMessage("Explique visualmente como resolver uma multiplicação");
              handleSendMessage();
            }}
          >
            <div className="flex items-center gap-3">
              <Eye className="h-6 w-6 text-blue-500" />
              <div>
                <h3 className="font-semibold">Explicação Visual</h3>
                <p className="text-sm text-muted-foreground">Peça uma explicação pictórica</p>
              </div>
            </div>
          </Card>
          
          <Card 
            className="p-4 hover:bg-muted/50 cursor-pointer transition-colors"
            onClick={() => {
              setInputMessage("Quero praticar problemas de frações com sua orientação");
              handleSendMessage();
            }}
          >
            <div className="flex items-center gap-3">
              <Calculator className="h-6 w-6 text-green-500" />
              <div>
                <h3 className="font-semibold">Prática Guiada</h3>
                <p className="text-sm text-muted-foreground">Exercícios com orientação</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MerakiChatTutor;