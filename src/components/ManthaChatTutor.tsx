import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, BookOpen, Calculator, Brain, Target, Zap, HelpCircle, Trash2, AlertTriangle } from "lucide-react";
import { EnhancedTextarea, EnhancedTextareaRef } from "@/components/chat/EnhancedTextarea";
import { QuestionSuggestions } from "@/components/chat/QuestionSuggestions";
import { QuickActionButtons } from "@/components/chat/QuickActionButtons";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/components/ui/use-toast";
import { openaiService } from "@/services/openaiService";
import MathText from "@/components/MathText";
import { useChatHistory } from "@/hooks/useChatHistory";
import { useUserProgress } from "@/hooks/useUserProgress";
import { useUserProfile } from "@/hooks/useUserProfile";
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
  const { messages: chatHistory, loading: historyLoading, saveChatMessage, getLastConversation, clearChatHistory } = useChatHistory();
  const { addStudyTime, addCompletedActivity, addPoints } = useUserProgress();
  const { displayName } = useUserProfile();
  const { toast } = useToast();
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [currentStage, setCurrentStage] = useState<CPAStage>('adaptive');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<EnhancedTextareaRef>(null);

  // Carregar histórico do chat quando componente inicializar
  useEffect(() => {
    if (!historyLoading && chatHistory.length > 0) {
      // Converter histórico do banco para formato do componente
      const convertedMessages: Message[] = [];
      
      chatHistory.forEach(chat => {
        // Adicionar mensagem do usuário
        convertedMessages.push({
          id: `user-${chat.id}`,
          content: chat.mensagem,
          sender: 'user',
          timestamp: new Date(chat.created_at),
          stage: (chat.estagio_cpa as CPAStage) || 'adaptive'
        });
        
        // Adicionar resposta da Mantha se existir
        if (chat.resposta) {
          convertedMessages.push({
            id: `mantha-${chat.id}`,
            content: chat.resposta,
            sender: 'mantha',
            timestamp: new Date(chat.created_at),
            stage: (chat.estagio_cpa as CPAStage) || 'adaptive'
          });
        }
      });
      
      // Se há histórico, mostrar mensagem de continuação
      if (convertedMessages.length > 0) {
        const welcomeMessage: Message = {
          id: 'welcome-back',
          content: '### Oi de novo! Que bom te ver! 👋😊\n\n**Nossa, você já voltou!** Isso é super legal - mostra que você está mesmo interessado em aprender! ✨\n\n**Bora continuar de onde paramos?** Ou se quiser explorar algo novo, é só falar! Estou aqui pra te ajudar sempre! 🚀',
          sender: 'mantha',
          timestamp: new Date(),
          stage: 'adaptive'
        };
        setMessages([welcomeMessage, ...convertedMessages]);
      } else {
        // Primeira visita
        setMessages([{
          id: '1',
          content: '### Oi! Eu sou a Mantha! 👋✨\n\nSua tutora de matemática super animada! 🤖📚\n\n**Vou te ensinar matemática de um jeito bem legal** usando o Método CPA:\n\n• **🧱 Concreto** - Vamos usar objetos reais pra entender melhor!\n• **🎨 Pictórico** - Hora de desenhar e visualizar as ideias!\n• **🔢 Abstrato** - Agora sim, símbolos e fórmulas!\n\n**E aí, que conceito matemático você quer explorar hoje?** Pode ser qualquer coisa - desde operações básicas até equações mais complexas! 😊',
          sender: 'mantha',
          timestamp: new Date(),
          stage: 'adaptive'
        }]);
      }
    } else if (!historyLoading) {
      // Primeira visita (sem histórico)
      setMessages([{
        id: '1',
        content: '### Oi! Eu sou a Mantha! 👋✨\n\nSua tutora de matemática super animada! 🤖📚\n\n**Vou te ensinar matemática de um jeito bem legal** usando o Método CPA:\n\n• **🧱 Concreto** - Vamos usar objetos reais pra entender melhor!\n• **🎨 Pictórico** - Hora de desenhar e visualizar as ideias!\n• **🔢 Abstrato** - Agora sim, símbolos e fórmulas!\n\n**E aí, que conceito matemático você quer explorar hoje?** Pode ser qualquer coisa - desde operações básicas até equações mais complexas! 😊',
        sender: 'mantha',
        timestamp: new Date(),
        stage: 'adaptive'
      }]);
    }
  }, [chatHistory, historyLoading]);

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
        fractions: "### Frações - Estágio Abstrato\n\nOpere com notação fracionária: 1/2 + 1/4\n\n**Processo:**\n• Encontre denominador comum: 4\n• 2/4 + 1/4 = 3/4\n\n**Fundamento:** Denominadores comuns permitem operações diretas.",
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
        content: `## Resolução: $${a} ${symbol} ${b} = ${result}$

### Explicação pelo Método CPA:

**🔧 Concreto:** ${operation === 'multiplicação' ? `Organize ${a} grupos de ${b} objetos físicos` : operation === 'adição' ? `Separe ${a} objetos, adicione ${b} objetos` : operation === 'subtração' ? `Inicie com ${a} objetos, remova ${b}` : `Distribua ${a} objetos em ${b} grupos iguais`}

**🎨 Pictórico:** ${operation === 'multiplicação' ? `Desenhe ${a} fileiras com ${b} pontos cada` : operation === 'adição' ? `Desenhe ${a} símbolos + ${b} símbolos` : operation === 'subtração' ? `Desenhe ${a} símbolos, risque ${b}` : `Desenhe ${a} objetos em ${b} grupos`}

**🔢 Abstrato:** A equação fica: ${a} ${symbol} ${b} = ${result}

### O que significa cada parte:
• **${a}** e **${b}** são os números que estamos trabalhando
• **${symbol}** é o símbolo da **${operation}**
• **${result}** é nossa resposta final

Qual parte gostaria de explorar mais?`,
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
         content: `### Teorema de Pitágoras

Para triângulos retângulos: $a^2 + b^2 = c^2$ (c = hipotenusa)

**Concreto:** Construa quadrados de papel representando as áreas dos catetos e hipotenusa. Verifique que a área dos dois quadrados menores equivale à área do quadrado maior.

**Pictórico:** Desenhe triângulo retângulo com quadrados em cada lado. Visualize a relação $a^2 + b^2 = c^2$.

**Abstrato:** Exemplo: triângulo (3, 4, 5): $3^2 + 4^2 = 9 + 16 = 25 = 5^2$

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

    const currentInput = inputMessage;
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await generateManthaResponse(currentInput, currentStage);
      
      const manthaMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.content,
        sender: 'mantha',
        timestamp: new Date(),
        stage: response.stage as CPAStage,
        hasVisual: response.content.includes('Visual') || response.content.includes('Desenhe')
      };

      setMessages(prev => [...prev, manthaMessage]);

      // Salvar no banco de dados
      await saveChatMessage(
        currentInput,
        response.content,
        currentStage,
        'matematica' // topico padrão
      );

      // Adicionar tempo de estudo (estimativa de 2 minutos por interação)
      await addStudyTime(2);

      // Adicionar pontos por interação
      await addPoints(10);

      // Se foi uma pergunta de cálculo específico, marcar como atividade completada
      if (currentInput.match(/quanto\s+(?:é|e)/i)) {
        await addCompletedActivity(`Cálculo: ${currentInput}`);
      }

    } catch (error) {
      console.error('Erro ao gerar resposta:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = async () => {
    try {
      await clearChatHistory();
      setMessages([]);
      toast({
        title: "Chat limpo com sucesso!",
        description: "Todo o histórico de conversas foi removido.",
      });
    } catch (error) {
      toast({
        title: "Erro ao limpar chat",
        description: "Não foi possível limpar o histórico. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputMessage(suggestion);
    textareaRef.current?.focus();
  };

  const handleExplainDifferently = (originalMessage: string) => {
    const prompt = `Explique de uma forma diferente: ${originalMessage}`;
    setInputMessage(prompt);
    textareaRef.current?.focus();
  };

  const handleMoreDetails = (originalMessage: string) => {
    const prompt = `Preciso de mais detalhes sobre: ${originalMessage}`;
    setInputMessage(prompt);
    textareaRef.current?.focus();
  };

  const handleCreateExercise = (topic: string) => {
    const prompt = `Crie um exercício prático sobre este tópico: ${topic}`;
    setInputMessage(prompt);
    textareaRef.current?.focus();
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-3 md:p-6">
      <Card className="h-[70vh] md:h-[850px] flex flex-col shadow-card">
        <CardHeader className="bg-gradient-to-r from-primary via-primary-hover to-primary text-white rounded-t-lg p-4 md:p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 md:space-x-3">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/20 flex items-center justify-center">
                <Brain className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg md:text-xl font-bold text-white">Mantha - Tutor IA</CardTitle>
                <p className="text-white/90 text-xs md:text-sm flex items-center">
                  <span className="mr-2">{stageInfo[currentStage].icon}</span>
                  <span className="hidden sm:inline">{stageInfo[currentStage].title}</span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white/80 hover:text-white hover:bg-white/10"
                    disabled={messages.length === 0}
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className="hidden md:inline ml-2">Limpar Chat</span>
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-destructive" />
                      Confirmar Limpeza do Chat
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Tem certeza que deseja limpar todo o histórico de conversas com a Mantha? 
                      Esta ação não pode ser desfeita e todas as mensagens anteriores serão permanentemente removidas.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={handleClearChat} className="bg-destructive hover:bg-destructive/90">
                      Sim, limpar tudo
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <AIStatusIndicator />
            </div>
          </div>
        </CardHeader>

        {/* Seleção de Estágio */}
        <div className="p-3 md:p-4 border-b bg-gradient-subtle">
          <div className="flex gap-1 md:gap-2 flex-wrap">
            {Object.entries(stageInfo).map(([key, info]) => (
              <Button
                key={key}
                variant={currentStage === key ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentStage(key as CPAStage)}
                className="flex items-center gap-1 h-8 md:h-9 text-xs md:text-sm px-2 md:px-3 min-h-[44px]"
              >
                <span>{info.icon}</span>
                <span className="hidden sm:inline text-xs md:text-sm">{info.title}</span>
              </Button>
            ))}
          </div>
          
          <div className="mt-2 text-xs md:text-sm text-muted-foreground">
            <strong>Modo atual:</strong> {stageInfo[currentStage].description}
          </div>
        </div>

        {/* Área do Chat */}
        <CardContent className="flex-1 p-0 overflow-hidden">
          <ScrollArea className="h-full p-3 md:p-4" ref={scrollRef}>
            <div className="space-y-3 md:space-y-4">
               {messages.map((message) => (
                 <div key={message.id} className={`flex gap-2 md:gap-3 ${message.sender === 'user' ? 'justify-end' : 'justify-start'} group`}>
                  
                  {/* Avatar do Tutor */}
                  {message.sender === 'mantha' && (
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-r from-primary to-primary-hover flex items-center justify-center flex-shrink-0 mt-1">
                      <Brain className="w-4 h-4 md:w-5 md:h-5 text-white" />
                    </div>
                  )}
                  
                   {/* Mensagem */}
                   <div className={`flex-1 max-w-[85%] md:max-w-[80%] ${message.sender === 'user' ? 'ml-8 md:ml-12' : ''}`}>
                     <div className={`p-3 md:p-4 rounded-2xl text-sm md:text-base min-h-fit ${
                       message.sender === 'user' 
                         ? 'bg-primary text-primary-foreground ml-auto' 
                         : 'bg-muted text-muted-foreground'
                     }`}>
                        {message.sender === 'mantha' ? (
                          <div className="max-w-none overflow-auto">
                            <MathText>{message.content}</MathText>
                          </div>
                        ) : (
                         <p className="leading-relaxed break-words whitespace-pre-wrap">{message.content}</p>
                       )}
                      </div>

                     {/* Quick Action Buttons para mensagens da Mantha */}
                     {message.sender === 'mantha' && (
                       <QuickActionButtons
                         messageContent={message.content}
                         onExplainDifferently={() => handleExplainDifferently(message.content)}
                         onMoreDetails={() => handleMoreDetails(message.content)}
                         onCreateExercise={() => handleCreateExercise(message.content)}
                       />
                     )}
                     
                     {/* Timestamp e estágio */}
                    <div className="flex items-center justify-between mt-1 px-1">
                      <span className="text-xs text-muted-foreground">
                        {message.timestamp.toLocaleTimeString('pt-BR', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </span>
                      
                      {message.stage && (
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          {stageInfo[message.stage].icon}
                          <span className="hidden sm:inline">{stageInfo[message.stage].title}</span>
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Avatar do usuário */}
                  {message.sender === 'user' && (
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-md flex-shrink-0 mt-1">
                      <span className="text-white text-xs md:text-sm font-semibold">{displayName?.charAt(0).toUpperCase() || 'U'}</span>
                    </div>
                  )}
                </div>
              ))}
              
              {/* Indicador de digitação */}
              {isLoading && (
                <div className="flex gap-2 md:gap-3 justify-start">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-r from-primary to-primary-hover flex items-center justify-center flex-shrink-0">
                    <Brain className="w-4 h-4 md:w-5 md:h-5 text-white" />
                  </div>
                  <div className="flex-1 max-w-[80%]">
                    <div className="bg-muted p-3 md:p-4 rounded-2xl">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>

        {/* Sugestões de perguntas */}
        {!isLoading && messages.length > 0 && (
          <div className="border-t p-3 md:p-4 bg-muted/20">
            <QuestionSuggestions 
              currentStage={currentStage}
              onSuggestionClick={handleSuggestionClick}
              disabled={isLoading}
            />
          </div>
        )}

        {/* Input de mensagem */}
        <div className="border-t p-3 md:p-4 bg-background rounded-b-lg">
          <div className="flex gap-2 md:gap-3 items-end">
            <div className="flex-1">
              <EnhancedTextarea
                ref={textareaRef}
                value={inputMessage}
                onChange={setInputMessage}
                onKeyDown={handleKeyPress}
                placeholder="Digite sua pergunta sobre matemática..."
                disabled={isLoading}
                maxLength={500}
              />
            </div>
            <Button 
              onClick={handleSendMessage}
              disabled={isLoading || !inputMessage.trim()}
              className={`h-[44px] w-[44px] md:h-[48px] md:w-[48px] rounded-xl flex-shrink-0 p-0 transition-colors ${
                inputMessage.trim() ? 'bg-primary hover:bg-primary/90' : ''
              }`}
            >
              <Send className="w-4 h-4 md:w-5 md:h-5" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ManthaChatTutor;