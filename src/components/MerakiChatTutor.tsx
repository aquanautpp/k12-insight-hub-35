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
  sender: 'user' | 'meraki';
  timestamp: Date;
  stage?: CPAStage;
  hasVisual?: boolean;
}

const MerakiChatTutor = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Olá! Eu sou a Meraki, sua tutora de matemática! 🎓 Estou aqui para te ajudar a aprender usando o Método de Singapura (CPA). Que pergunta de matemática você tem hoje?',
      sender: 'meraki',
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

  const generateMerakiResponse = async (userMessage: string, stage: CPAStage) => {
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

    // Respostas específicas por estágio
    const responses = {
      concrete: {
        addition: "Vamos usar objetos físicos! Use blocos ou brinquedos para somar. Por exemplo, 3 + 2: pegue 3 blocos, depois adicione 2 mais. Conte todos: 5 blocos! 🧱",
        subtraction: "Use objetos reais para subtrair! Se você tem 5 moedas e gasta 2, remova fisicamente 2 moedas. Conte quantas sobraram: 3 moedas! 🪙",
        multiplication: "Multiplicação com grupos! Crie grupos de objetos. Para 3 × 4, faça 3 grupos de 4 blocos cada. Conte todos os blocos: 12! 📦",
        division: "Use objetos para divisão! Para 12 ÷ 3, distribua 12 itens igualmente em 3 grupos. Cada grupo fica com 4 itens! 🔄",
        fractions: "Corte uma pizza ou use barras de fração! Para 1/2, corte um círculo pela metade. Para 1/4, corte em 4 pedaços iguais! 🍕",
        general: "Use objetos físicos que você pode tocar e manipular para entender melhor os conceitos matemáticos! 🤲"
      },
      visual: {
        addition: "Desenhe para visualizar! Para 4 + 3, desenhe 4 círculos, depois 3 círculos. Conte todos: 7 círculos! ⭕",
        subtraction: "Desenhe imagens para subtrair! Para 7 - 2, desenhe 7 estrelas, risque 2. Conte o que sobrou: 5 estrelas! ⭐",
        multiplication: "Use esquemas visuais! Para 2 × 5, desenhe 2 fileiras de 5 pontos cada. Conte todos os pontos: 10! 🔵",
        division: "Desenhe grupos iguais! Para 15 ÷ 3, desenhe 15 objetos em 3 grupos iguais. Cada grupo tem 5! 🟡",
        fractions: "Desenhe modelos de fração! Para 3/4, desenhe um retângulo dividido em 4 partes, pinte 3 partes! 📊",
        general: "Desenhe, faça diagramas e use imagens para visualizar os problemas matemáticos! 🎨"
      },
      simbolico: {
        addition: "Use números e símbolos! 6 + 4 = 10. Aplicação de propriedades: comutativa (6+4 = 4+6), associativa ((2+3)+5 = 2+(3+5)) 🔢",
        subtraction: "Trabalhe com números diretamente! 9 - 3 = 6. Verificação: 6 + 3 = 9 ✓ Sempre verifique sua resposta! ➖",
        multiplication: "Use as tabuadas! 7 × 8 = 56. Propriedades: 7×8 = 8×7 (comutativa) ✖️",
        division: "Aplique as regras de divisão! 48 ÷ 6 = 8. Verificação: 8 × 6 = 48 ✓ Divisão e multiplicação são operações inversas! ➗",
        fractions: "Trabalhe com notação de fração! 1/2 + 1/4 = 2/4 + 1/4 = 3/4. Encontre denominadores comuns! 📝",
        general: "Use símbolos matemáticos, números e fórmulas para resolver problemas de forma abstrata! 🔢"
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
        content: `${a} ${symbol} ${b} = ${result}

Vou te explicar usando o Método de Singapura:

**🧱 Concreto:** Use ${a} grupos de ${operation === 'multiplicação' ? b + ' objetos' : 'objetos'} físicos para visualizar.

**🎨 Visual:** Desenhe ${a} ${operation === 'multiplicação' ? 'fileiras de ' + b + ' pontos' : 'círculos e adicione ' + b + ' círculos'}.

**🔢 Simbólico:** ${a} ${symbol} ${b} = ${result}

Gostaria que eu explique melhor algum estágio específico?`,
        stage: stage
      };
    }

    // Verifica teoremas específicos
    if (userMessage.match(/teorema\s+de\s+tales/i)) {
      return {
        content: `📐 **Teorema de Tales**

O Teorema de Tales diz que quando duas retas são cortadas por retas paralelas, os segmentos formados são proporcionais.

**🧱 Concreto:** Use barbantes ou réguas para criar retas paralelas e medir os segmentos.

**🎨 Visual:** Desenhe duas retas cortadas por três linhas paralelas e compare as proporções.

**🔢 Simbólico:** Se a/b = c/d, então as retas são proporcionais.

Exemplo prático: Se você tem uma sombra de 2m e um poste de 6m, e outra sombra de 3m, o segundo poste terá 9m!`,
        stage: stage
      };
    }

    if (userMessage.match(/teorema\s+de\s+pitágoras/i)) {
      return {
        content: `📐 **Teorema de Pitágoras**

Em um triângulo retângulo: a² + b² = c² (onde c é a hipotenusa)

**🧱 Concreto:** Use blocos ou quadrados de papel para formar os lados do triângulo e verificar as áreas.

**🎨 Visual:** Desenhe um triângulo retângulo e quadrados em cada lado para visualizar a² + b² = c².

**🔢 Simbólico:** Para um triângulo com lados 3, 4 e 5: 3² + 4² = 9 + 16 = 25 = 5²

Aplicação: Calcular distâncias, verificar se um canto é reto, encontrar a diagonal de um retângulo!`,
        stage: stage
      };
    }

    // Gera resposta baseada no estágio
    if (stage === 'adaptive') {
      const concreteResp = responses.concrete[topic as keyof typeof responses.concrete] || responses.concrete.general;
      const visualResp = responses.visual[topic as keyof typeof responses.visual] || responses.visual.general;
      const simbolicoResp = responses.simbolico[topic as keyof typeof responses.simbolico] || responses.simbolico.general;
      
      return {
        content: `Vou te ensinar usando o Método de Singapura completo! 🎓

**🧱 Estágio Concreto (Objetos Físicos):**
${concreteResp}

**🎨 Estágio Visual (Desenhos e Diagramas):**
${visualResp}

**🔢 Estágio Simbólico (Símbolos):**
${simbolicoResp}

Que estágio você gostaria de praticar mais?`,
        stage: 'adaptive'
      };
    }

    // Resposta para estágio específico
    const stageKey = stage === 'pictorial' ? 'visual' : stage === 'abstract' ? 'simbolico' : stage;
    const stageResponses = responses[stageKey as keyof typeof responses] || responses.concrete;
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
      const response = await generateMerakiResponse(inputMessage, currentStage);
      
      const merakiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.content,
        sender: 'meraki',
        timestamp: new Date(),
        stage: response.stage as CPAStage,
        hasVisual: response.content.includes('Visual') || response.content.includes('Desenhe')
      };

      setMessages(prev => [...prev, merakiMessage]);
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
    <div className="max-w-4xl mx-auto p-6">
      <Card className="h-[850px] flex flex-col shadow-card">
        <CardHeader className="bg-gradient-tutor text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold text-white">Meraki - Tutor de IA</CardTitle>
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
                variant={currentStage === key ? "learning" : "outline"}
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
                      <span className="text-sm text-muted-foreground">Meraki está pensando...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>

        {/* Área de Input */}
        <div className="p-4 border-t bg-background">
          {/* Botões de Ação Rápida */}
          <div className="flex gap-2 mb-3 flex-wrap">
            <Button 
              variant="pill" 
              size="sm"
              className="bg-gradient-primary text-white hover:bg-gradient-to-r hover:from-primary/90 hover:to-primary border-0 shadow-sm"
              onClick={() => setInputMessage("Me dê uma dica específica para resolver este problema: 27 + 15 = ?")}
            >
              💡 Dica para Pedro e suas Figurinhas
            </Button>
            <Button 
              variant="pill" 
              size="sm"
              className="bg-gradient-primary text-white hover:bg-gradient-to-r hover:from-primary/90 hover:to-primary border-0 shadow-sm"
              onClick={() => setInputMessage("Como usar blocos base 10 para representar 27 figurinhas + 15 figurinhas?")}
            >
              🤝 Ajuda com Blocos
            </Button>
            <Button 
              variant="pill" 
              size="sm"
              className="bg-gradient-primary text-white hover:bg-gradient-to-r hover:from-primary/90 hover:to-primary border-0 shadow-sm"
              onClick={() => setInputMessage("Me explique passo a passo como Pedro pode calcular suas figurinhas usando o método CPA")}
            >
              ✨ Dica Especial
            </Button>
          </div>

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
              className="px-3"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default MerakiChatTutor;