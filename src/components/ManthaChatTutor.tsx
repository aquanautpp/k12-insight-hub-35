import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, BookOpen, Calculator, Brain, Target, Zap, HelpCircle } from "lucide-react";
import { openaiService } from "@/services/openaiService";

// Componente para mostrar status da IA
const AIStatusIndicator = () => {
  const [status, setStatus] = useState<'none' | 'stored' | 'active' | 'error'>('none');

  useEffect(() => {
    setStatus(openaiService.getApiKeyStatus());
  }, []);

  const statusConfig = {
    none: { icon: HelpCircle, color: 'text-red-400', text: 'Sem API Key' },
    stored: { icon: Zap, color: 'text-yellow-400', text: 'API Configurada' },
    active: { icon: Zap, color: 'text-green-400', text: 'IA Ativa' },
    error: { icon: HelpCircle, color: 'text-red-400', text: 'Erro na API' }
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div className="flex items-center gap-1 text-xs">
      <Icon className={`w-3 h-3 ${config.color}`} />
      <span className="text-white/80">{config.text}</span>
    </div>
  );
};

// Definindo os tipos para o estágio CPA
type CPAStage = 'concrete' | 'pictorial' | 'abstract' | 'adaptive';

// Interface para as mensagens do chat
interface Message {
  id: string;
  content: string;
  sender: 'user' | 'mantha';
  timestamp: Date;
  stage?: CPAStage;
  hasVisual?: boolean;
}

const ManthaChatTutor = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Olá! Sou a **Mantha**, sua tutora especializada no Método CPA de Singapura 📚\n\nEstou aqui para ajudá-lo a compreender matemática através dos três estágios: **Concreto**, **Pictórico** e **Abstrato**.\n\nQual conceito matemático gostaria de explorar hoje?',
      sender: 'mantha',
      timestamp: new Date(),
      stage: 'adaptive'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [currentStage, setCurrentStage] = useState<CPAStage>('adaptive');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const generateManthaResponse = async (userMessage: string, stage: CPAStage) => {
    try {
      // Try using real OpenAI service first
      const response = await openaiService.generateResponse(userMessage, {
        cpaStage: stage === 'pictorial' ? 'pictorial' : stage === 'abstract' ? 'abstract' : stage === 'concrete' ? 'concrete' : 'concrete',
        learningStyle: 'visual',
        currentLevel: 1,
        previousMessages: messages.slice(-3).map(msg => ({
          role: msg.sender === 'user' ? 'user' as const : 'assistant' as const,
          content: msg.content
        }))
      });
      
      return {
        content: response.message,
        stage: stage,
        isRealAI: response.isRealAI
      };
    } catch (error) {
      console.error('Error getting AI response, using fallback:', error);
      // Fallback to original logic if service fails
      await new Promise(resolve => setTimeout(resolve, 1000));
      const fallbackResponse = await generateFallbackResponse(userMessage, stage);
      return {
        ...fallbackResponse,
        isRealAI: false
      };
    }
  };

  const generateFallbackResponse = async (userMessage: string, stage: CPAStage) => {

    // Tópicos matemáticos que podemos identificar
    const mathTopics = {
      addition: /(?:adição|somar|soma|mais|\+|adicionar)/i,
      subtraction: /(?:subtração|subtrair|menos|\-|tirar)/i,
      multiplication: /(?:multiplicação|multiplicar|vezes|×|x|\*|tabuada)/i,
      division: /(?:divisão|dividir|dividido|÷|\/)/i,
      fractions: /(?:fração|frações|meio|metade|terço|quarto)/i,
      geometry: /(?:geometria|triângulo|quadrado|círculo|área|perímetro)/i,
      algebra: /(?:álgebra|equação|variável|x|y)/i
    };

    // Identifica o tópico matemático
    let topic = 'general';
    for (const [key, regex] of Object.entries(mathTopics)) {
      if (regex.test(userMessage)) {
        topic = key;
        break;
      }
    }

    // Respostas estruturadas por estágio CPA
    const responses = {
      concrete: {
        addition: "**Adição - Estágio Concreto**\n\nUtilize objetos físicos para compreender a operação. Para 3 + 2:\n• Separe 3 blocos/objetos\n• Adicione 2 blocos ao grupo\n• Conte o total: 5 objetos\n\nEste método desenvolve a **compreensão conceitual** antes dos símbolos.",
        subtraction: "**Subtração - Estágio Concreto**\n\nManipule objetos reais para visualizar a operação. Para 5 - 2:\n• Inicie com 5 objetos\n• Remova fisicamente 2 objetos\n• Conte o que permanece: 3 objetos\n\n**Próximo passo:** Pratique com diferentes quantidades.",
        multiplication: "**Multiplicação - Estágio Concreto**\n\nOrganize objetos em grupos iguais. Para 3 × 4:\n• Forme 3 grupos\n• Coloque 4 objetos em cada grupo\n• Conte todos os objetos: 12\n\nA multiplicação representa **grupos repetidos** de uma quantidade.",
        division: "**Divisão - Estágio Concreto**\n\nDistribua objetos igualmente. Para 12 ÷ 3:\n• Separe 12 objetos\n• Forme 3 grupos iguais\n• Cada grupo terá 4 objetos\n\nA divisão é o processo de **distribuição equitativa**.",
        fractions: "**Frações - Estágio Concreto**\n\nUse objetos divisíveis (papel, pizza, chocolate):\n• Para 1/2: divida em 2 partes iguais\n• Para 1/4: divida em 4 partes iguais\n\n**Conceito fundamental:** Frações representam partes de um todo.",
        general: "**Estágio Concreto**\n\nManipule objetos físicos para compreender conceitos matemáticos. Esta abordagem desenvolve o **entendimento intuitivo** antes da abstração simbólica."
      },
      pictorial: {
        addition: "**Adição - Estágio Pictórico**\n\nRepresente visualmente a operação. Para 4 + 3:\n• Desenhe 4 círculos\n• Desenhe 3 círculos adicionais\n• Total: 7 círculos\n\n**Estratégia:** Use símbolos consistentes para representar quantidades.",
        subtraction: "**Subtração - Estágio Pictórico**\n\nVisualize a remoção através de desenhos. Para 7 - 2:\n• Desenhe 7 símbolos\n• Risque ou marque 2 símbolos\n• Conte os símbolos restantes: 5\n\n**Técnica:** Use cores diferentes para destacar operações.",
        multiplication: "**Multiplicação - Estágio Pictórico**\n\nCrie diagramas organizados. Para 2 × 5:\n• Desenhe 2 fileiras\n• 5 pontos em cada fileira\n• Total: 10 pontos\n\n**Vantagem:** Visualização clara de padrões matemáticos.",
        division: "**Divisão - Estágio Pictórico**\n\nRepresente através de agrupamentos visuais. Para 15 ÷ 3:\n• Desenhe 15 objetos\n• Circule em 3 grupos iguais\n• Cada grupo: 5 objetos\n\n**Método:** Use círculos para delimitar grupos.",
        fractions: "**Frações - Estágio Pictórico**\n\nDesenhe modelos de fração. Para 3/4:\n• Desenhe um retângulo\n• Divida em 4 partes iguais\n• Sombreie 3 partes\n\n**Representação visual** facilita compreensão de proporções.",
        general: "**Estágio Pictórico**\n\nUse representações visuais sistemáticas para conectar conceitos concretos aos símbolos abstratos. Esta transição é **fundamental** no processo de aprendizagem."
      },
      abstract: {
        addition: "**Adição - Estágio Abstrato**\n\nTrabalhe com símbolos matemáticos: 6 + 4 = 10\n\n**Propriedades fundamentais:**\n• Comutativa: 6 + 4 = 4 + 6\n• Associativa: (2 + 3) + 5 = 2 + (3 + 5)\n\n**Aplicação:** Resolução eficiente de problemas complexos.",
        subtraction: "**Subtração - Estágio Abstrato**\n\nOpere com números diretamente: 9 - 3 = 6\n\n**Verificação:** 6 + 3 = 9 ✓\n\n**Estratégia:** Sempre verifique resultados usando a operação inversa (adição).",
        multiplication: "**Multiplicação - Estágio Abstrato**\n\nUtilize fatos matemáticos: 7 × 8 = 56\n\n**Propriedades:**\n• Comutativa: 7 × 8 = 8 × 7\n• Distributiva: 7 × (8 + 2) = 7 × 8 + 7 × 2\n\n**Domínio** das tabuadas acelera resolução de problemas.",
        division: "**Divisão - Estágio Abstrato**\n\nAplique algoritmos de divisão: 48 ÷ 6 = 8\n\n**Verificação:** 8 × 6 = 48 ✓\n\n**Conceito:** Divisão e multiplicação são **operações inversas**.",
        fractions: "**Frações - Estágio Abstrato**\n\nOpere com notação fracionária: 1/2 + 1/4\n\n**Processo:**\n• Encontre denominador comum: 4\n• 2/4 + 1/4 = 3/4\n\n**Fundamento:** Denominadores comuns permitem operações diretas.",
        general: "**Estágio Abstrato**\n\nUtilize símbolos matemáticos, fórmulas e algoritmos para resolver problemas. Este nível representa o **domínio conceitual** completo."
      }
    };

    // Verifica se é uma pergunta matemática específica
    const mathQuestion = userMessage.match(/quanto\s+(?:é|e)\s*(\d+)\s*[×x*]\s*(\d+)/i) ||
                        userMessage.match(/quanto\s+(?:é|e)\s*(\d+)\s*[+]\s*(\d+)/i) ||
                        userMessage.match(/quanto\s+(?:é|e)\s*(\d+)\s*[-]\s*(\d+)/i) ||
                        userMessage.match(/quanto\s+(?:é|e)\s*(\d+)\s*[÷/]\s*(\d+)/i);

    if (mathQuestion) {
      const [, num1, num2] = mathQuestion;
      const a = parseInt(num1);
      const b = parseInt(num2);
      let operation = '';
      let result = 0;
      let symbol = '';

      if (userMessage.includes('×') || userMessage.includes('x') || userMessage.includes('*')) {
        result = a * b;
        operation = 'multiplicação';
        symbol = '×';
      } else if (userMessage.includes('+')) {
        result = a + b;
        operation = 'adição';
        symbol = '+';
      } else if (userMessage.includes('-')) {
        result = a - b;
        operation = 'subtração';
        symbol = '-';
      } else if (userMessage.includes('÷') || userMessage.includes('/')) {
        result = a / b;
        operation = 'divisão';
        symbol = '÷';
      }

      return {
        content: `**Resolução: ${a} ${symbol} ${b} = ${result}**

**Explicação pelo Método CPA:**

**Concreto:** ${operation === 'multiplicação' ? `Organize ${a} grupos de ${b} objetos físicos` : operation === 'adição' ? `Separe ${a} objetos, adicione ${b} objetos` : operation === 'subtração' ? `Inicie com ${a} objetos, remova ${b}` : `Distribua ${a} objetos em ${b} grupos iguais`}

**Pictórico:** ${operation === 'multiplicação' ? `Desenhe ${a} fileiras com ${b} pontos cada` : operation === 'adição' ? `Desenhe ${a} símbolos + ${b} símbolos` : operation === 'subtração' ? `Desenhe ${a} símbolos, risque ${b}` : `Desenhe ${a} objetos em ${b} grupos`}

**Abstrato:** ${a} ${symbol} ${b} = ${result}

Qual estágio gostaria de aprofundar?`,
        stage: stage
      };
    }

    // Verifica teoremas específicos
    if (userMessage.match(/teorema\s+de\s+tales/i)) {
      return {
        content: `**Teorema de Tales**

Estabelece que retas paralelas cortadas por transversais criam segmentos proporcionais.

**Concreto:** Utilize réguas e barbantes para construir retas paralelas. Meça os segmentos formados e compare as proporções.

**Pictórico:** Construa diagrama com duas retas cortadas por três paralelas. Marque e compare os segmentos correspondentes.

**Abstrato:** Se a/b = c/d, então as retas são proporcionais.

**Aplicação prática:** Cálculo de alturas usando sombras e semelhança de triângulos.

Deseja explorar aplicações específicas?`,
        stage: stage
      };
    }

    if (userMessage.match(/teorema\s+de\s+pitágoras/i)) {
      return {
        content: `**Teorema de Pitágoras**

Para triângulos retângulos: a² + b² = c² (c = hipotenusa)

**Concreto:** Construa quadrados de papel representando as áreas dos catetos e hipotenusa. Verifique que a área dos dois quadrados menores equivale à área do quadrado maior.

**Pictórico:** Desenhe triângulo retângulo com quadrados em cada lado. Visualize a relação a² + b² = c².

**Abstrato:** Exemplo: triângulo (3, 4, 5): 3² + 4² = 9 + 16 = 25 = 5²

**Aplicações:** Cálculo de distâncias, verificação de ângulos retos, diagonais de retângulos.

Quer ver mais aplicações práticas?`,
        stage: stage
      };
    }

    // Gera resposta baseada no estágio
    if (stage === 'adaptive') {
      const concreteResp = responses.concrete[topic as keyof typeof responses.concrete] || responses.concrete.general;
      const pictorialResp = responses.pictorial[topic as keyof typeof responses.pictorial] || responses.pictorial.general;
      const abstractResp = responses.abstract[topic as keyof typeof responses.abstract] || responses.abstract.general;
      
      return {
        content: `**Método CPA Completo**

${concreteResp}

${pictorialResp}

${abstractResp}

**Próximo passo:** Escolha o estágio que deseja aprofundar ou pratique com exercícios específicos.`,
        stage: 'adaptive'
      };
    }

    // Resposta para estágio específico
    const stageKey = stage === 'pictorial' ? 'pictorial' : stage === 'abstract' ? 'abstract' : 'concrete';
    const stageResponses = responses[stageKey as keyof typeof responses];
    const response = stageResponses[topic as keyof typeof stageResponses] || stageResponses.general;

    return {
      content: response,
      stage: stage
    };
  };

  const stageInfo = {
    concrete: { 
      title: "Estágio Concreto", 
      icon: "🧱", 
      color: "bg-orange-100 text-orange-800",
      description: "Manipulação de objetos físicos"
    },
    pictorial: { 
      title: "Estágio Visual", 
      icon: "🎨", 
      color: "bg-blue-100 text-blue-800",
      description: "Representações visuais e desenhos"
    },
    abstract: { 
      title: "Estágio Abstrato", 
      icon: "🔢", 
      color: "bg-purple-100 text-purple-800",
      description: "Símbolos e operações matemáticas"
    },
    adaptive: { 
      title: "Abordagem Adaptativa", 
      icon: "🎯", 
      color: "bg-orange-100 text-orange-800",
      description: "Combinação de todos os estágios"
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await generateManthaResponse(inputMessage, currentStage);
      
      const manthaMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.content,
        sender: 'mantha',
        timestamp: new Date(),
        stage: response.stage as CPAStage,
        hasVisual: response.content.includes('Visual') || response.content.includes('Desenhe')
      };

      setMessages(prev => [...prev, manthaMessage]);
    } catch (error) {
      console.error('Erro ao gerar resposta:', error);
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
    <div className="w-full max-w-5xl mx-auto p-6">
      <Card className="h-[850px] flex flex-col shadow-card">
        <CardHeader className="bg-gradient-to-r from-primary via-primary-hover to-primary text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold text-white">Mantha - Tutor IA</CardTitle>
                <p className="text-white/90 text-sm flex items-center">
                  <span className="mr-2">{stageInfo[currentStage].icon}</span>
                  {stageInfo[currentStage].title}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <AIStatusIndicator />
            </div>
          </div>
        </CardHeader>

        {/* Seleção de Estágio */}
        <div className="p-4 border-b bg-gradient-subtle">
          <div className="flex gap-2 flex-wrap">
            {Object.entries(stageInfo).map(([key, info]) => (
              <Button
                key={key}
                variant={currentStage === key ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentStage(key as CPAStage)}
                className="flex items-center gap-1"
              >
                <span>{info.icon}</span>
                <span className="hidden sm:inline">{info.title}</span>
              </Button>
            ))}
          </div>
          
          <div className="mt-2 text-sm text-muted-foreground">
            <strong>Modo atual:</strong> {stageInfo[currentStage].description}
          </div>
        </div>

        {/* Área do Chat */}
        <CardContent className="flex-1 p-0 overflow-hidden">
          <ScrollArea className="h-full p-4" ref={scrollRef}>
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                   <div
                     className={`max-w-[80%] rounded-lg p-4 ${
                       message.sender === 'user'
                         ? 'bg-primary text-primary-foreground'
                         : 'bg-muted text-foreground'
                     }`}
                   >
                     <div className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</div>
                    
                    <div className="flex items-center justify-between mt-2 text-xs opacity-70">
                      <span>
                        {message.timestamp.toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </span>
                      {message.stage && (
                        <Badge variant="secondary" className={stageInfo[message.stage].color}>
                          {stageInfo[message.stage].icon} {stageInfo[message.stage].title}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-lg p-3 max-w-[80%]">
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                      <span className="text-sm text-muted-foreground">Mantha está pensando...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>

        {/* Área de Input com botões específicos */}
        <div className="p-4 border-t bg-background">
          {/* Botões de Dica e Ajuda Específicos */}
          <div className="flex gap-2 mb-3 justify-center flex-wrap">
            <Button 
              variant="outline" 
              size="sm"
              className="bg-primary/5 text-primary border-primary/20 hover:bg-primary/10"
              onClick={() => {
                const lastUserMessage = messages.filter(m => m.sender === 'user').pop();
                const problemContext = lastUserMessage ? lastUserMessage.content : "este problema";
                setInputMessage(`Explique ${problemContext} de forma mais visual`);
              }}
            >
              <Target className="w-3 h-3 mr-1" />
              Mais Visual
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="bg-primary/5 text-primary border-primary/20 hover:bg-primary/10"
              onClick={() => {
                setInputMessage("Como posso usar objetos físicos para entender melhor?");
              }}
            >
              <BookOpen className="w-3 h-3 mr-1" />
              Concreto
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="bg-primary/5 text-primary border-primary/20 hover:bg-primary/10"
              onClick={() => {
                setInputMessage("Mostre-me a fórmula matemática");
              }}
            >
              <Calculator className="w-3 h-3 mr-1" />
              Fórmula
            </Button>
          </div>

          {/* Input */}
          <div className="flex gap-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Digite sua pergunta de matemática..."
              className="flex-1"
              disabled={isLoading}
            />
            <Button 
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              size="icon"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          
          {/* Exemplos de perguntas */}
          <div className="mt-3 text-xs text-muted-foreground text-center">
            Experimente: "Quanto é 7 × 8?", "Como resolver frações?", "Teorema de Pitágoras"
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ManthaChatTutor;