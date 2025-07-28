import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Send, 
  Bot, 
  User, 
  Blocks, 
  Eye, 
  Calculator,
  Lightbulb,
  BookOpen
} from "lucide-react";

type CPAStage = 'concrete' | 'pictorial' | 'abstract' | 'adaptive';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'tutor';
  timestamp: Date;
  stage?: CPAStage;
}

const ChatTutor = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Olá! Sou seu tutor do Método de Singapura. Posso ajudar você a compreender matemática através dos estágios Concreto, Pictórico e Abstrato. Em que posso ajudar hoje?',
      sender: 'tutor',
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

  const stageInfo = {
    concrete: {
      title: "Estágio Concreto",
      icon: Blocks,
      color: "bg-secondary",
      description: "Aprendendo com objetos físicos e manipuláveis"
    },
    pictorial: {
      title: "Estágio Pictórico", 
      icon: Eye,
      color: "bg-primary",
      description: "Visualizando com diagramas e representações"
    },
    abstract: {
      title: "Estágio Abstrato",
      icon: Calculator,
      color: "bg-accent", 
      description: "Dominando símbolos e equações matemáticas"
    },
    adaptive: {
      title: "Adaptativo",
      icon: Lightbulb,
      color: "bg-gradient-learning",
      description: "Escolhendo o melhor estágio para cada situação"
    }
  };

  const generateTutorResponse = async (userMessage: string, stage: CPAStage): Promise<string> => {
    // Simulated AI response based on Singapore Method principles
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const responses = {
      concrete: {
        addition: "Vamos usar objetos físicos! Imagine que você tem 5 blocos 🟦🟦🟦🟦🟦 e precisa adicionar mais 3 blocos 🟦🟦🟦. Conte todos os blocos juntos: 🟦🟦🟦🟦🟦🟦🟦🟦. Quantos blocos você tem agora?",
        subtraction: "Para subtração, comece com objetos físicos. Se você tem 8 maçãs 🍎🍎🍎🍎🍎🍎🍎🍎 e come 3 🍎🍎🍎, remova esses objetos. Conte quantos restaram: 🍎🍎🍎🍎🍎",
        multiplication: "Para multiplicação, use grupos de objetos. 3 × 4 significa 3 grupos com 4 objetos cada: [🟡🟡🟡🟡] [🟡🟡🟡🟡] [🟡🟡🟡🟡]. Conte todos os objetos!",
        fractions: "Para frações, use objetos físicos que você pode dividir. Corte uma pizza 🍕 em 4 pedaços iguais. Se você come 3 pedaços, tem 3/4 da pizza."
      },
      pictorial: {
        addition: "Vamos desenhar! Use o modelo de barras:\nNúmero 1: ▓▓▓▓▓ (5)\nNúmero 2: ▓▓▓ (3)\nTotal: ▓▓▓▓▓▓▓▓ (8)\nEste diagrama mostra visualmente como 5 + 3 = 8",
        subtraction: "Use representação visual:\nInício: ▓▓▓▓▓▓▓▓ (8)\nSubtrair: ░░░ (3)\nResta: ▓▓▓▓▓ (5)\nO modelo de barras ajuda a visualizar 8 - 3 = 5",
        multiplication: "Desenhe arrays ou modelos de área:\n3 × 4 = \n🟦🟦🟦🟦\n🟦🟦🟦🟦\n🟦🟦🟦🟦\nOu use modelo de barras: cada barra representa um grupo de 4",
        fractions: "Use diagramas circulares ou retangulares:\n3/4 = ⬜⬜⬜⬛ (3 partes coloridas de 4 total)\nOu barras: ▓▓▓░ (3 de 4 partes preenchidas)"
      },
      abstract: {
        addition: "Agora podemos usar símbolos matemáticos:\n5 + 3 = 8\nPropriedades: comutativa (5+3 = 3+5), associativa ((2+3)+4 = 2+(3+4))",
        subtraction: "Representação simbólica:\n8 - 3 = 5\nVerificação: 5 + 3 = 8\nRelação inversa entre adição e subtração",
        multiplication: "Notação matemática:\n3 × 4 = 12\nPropriedades: comutativa (3×4 = 4×3), distributiva (3×(2+2) = 3×2 + 3×2)",
        fractions: "Representação algébrica:\n3/4 = 0,75 = 75%\nOperações: 3/4 + 1/4 = 4/4 = 1\nEquivalências: 3/4 = 6/8 = 9/12"
      }
    };

    // Detect math topic from user message
    const message = userMessage.toLowerCase();
    let topic = 'general';
    if (message.includes('soma') || message.includes('adicão') || message.includes('+')) topic = 'addition';
    else if (message.includes('subtração') || message.includes('subtrair') || message.includes('-')) topic = 'subtraction';
    else if (message.includes('multiplicação') || message.includes('vezes') || message.includes('×')) topic = 'multiplication';
    else if (message.includes('fração') || message.includes('dividir') || message.includes('/')) topic = 'fractions';

    if (stage !== 'adaptive' && responses[stage][topic]) {
      return responses[stage][topic];
    }

    // Adaptive response - choose best stage based on question complexity
    if (topic !== 'general') {
      return `Vou explicar usando o Método de Singapura! Primeiro no estágio concreto:\n\n${responses.concrete[topic]}\n\nAgora pictoricamente:\n${responses.pictorial[topic]}\n\nE finalmente no abstrato:\n${responses.abstract[topic]}\n\nQual estágio fez mais sentido para você?`;
    }

    return "Entendo sua pergunta! No Método de Singapura, sempre começamos com o concreto (objetos físicos), depois passamos para o pictórico (desenhos e diagramas), e finalmente o abstrato (símbolos matemáticos). Pode me dar um exemplo específico de matemática que gostaria de aprender?";
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

    const tutorResponse = await generateTutorResponse(inputMessage, currentStage);
    
    const tutorMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: tutorResponse,
      sender: 'tutor',
      timestamp: new Date(),
      stage: currentStage
    };

    setMessages(prev => [...prev, tutorMessage]);
    setIsLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const currentStageData = stageInfo[currentStage];
  const StageIcon = currentStageData.icon;

  return (
    <div className="p-6 space-y-6 bg-gradient-subtle min-h-screen">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center">
          <div className="w-16 h-16 rounded-2xl bg-green-700 flex items-center justify-center mr-4 shadow-lg">
            <StageIcon className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Meraki - Tutora de IA</h1>
            <p className="text-lg text-muted-foreground">
              Método de Singapura com IA
            </p>
          </div>
        </div>
      </div>

      {/* Stage Selection */}
      <div className="flex justify-center">
        <div className="flex flex-wrap gap-2 bg-white rounded-xl p-2 shadow-card">
          {Object.entries(stageInfo).map(([key, stage]) => {
            const Icon = stage.icon;
            const isActive = currentStage === key;
            
            return (
              <Button
                key={key}
                variant={isActive ? "learning" : "outline"}
                size="sm"
                onClick={() => setCurrentStage(key as CPAStage)}
                className="flex items-center"
              >
                <Icon className="w-4 h-4 mr-2" />
                {stage.title}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Current Stage Info */}
      <Card className="p-4 bg-gradient-focus border border-primary/20">
        <div className="flex items-center">
          <BookOpen className="w-5 h-5 text-primary mr-2" />
          <div>
            <h3 className="font-semibold text-primary">{currentStageData.title}</h3>
            <p className="text-sm text-primary/70">{currentStageData.description}</p>
          </div>
        </div>
      </Card>

      {/* Chat Area */}
      <Card className="flex flex-col h-[600px] shadow-learning">
        <div className="p-4 border-b border-border">
          <div className="flex items-center">
            <Bot className="w-6 h-6 text-primary mr-2" />
            <h2 className="text-xl font-semibold text-foreground">Chat com Tutor</h2>
            <Badge variant="secondary" className="ml-auto">
              {messages.length - 1} mensagens
            </Badge>
          </div>
        </div>

        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-xl p-4 ${
                    message.sender === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-white shadow-card border border-border'
                  }`}
                >
                  <div className="flex items-start space-x-2">
                    {message.sender === 'tutor' && (
                      <Bot className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    )}
                    {message.sender === 'user' && (
                      <User className="w-5 h-5 text-primary-foreground flex-shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <p className={`text-sm whitespace-pre-wrap ${
                        message.sender === 'user' ? 'text-primary-foreground' : 'text-foreground'
                      }`}>
                        {message.content}
                      </p>
                      <div className="flex items-center mt-2 space-x-2">
                        <span className={`text-xs ${
                          message.sender === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground'
                        }`}>
                          {message.timestamp.toLocaleTimeString('pt-BR', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </span>
                        {message.stage && message.stage !== 'adaptive' && (
                          <Badge variant="outline">
                            {stageInfo[message.stage].title}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white shadow-card border border-border rounded-xl p-4 max-w-[80%]">
                  <div className="flex items-center space-x-2">
                    <Bot className="w-5 h-5 text-primary" />
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="p-4 border-t border-border">
          <div className="flex space-x-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Digite sua pergunta sobre matemática..."
              className="flex-1"
              disabled={isLoading}
            />
            <Button 
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              variant="learning"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            O tutor responde baseado no Método de Singapura (CPA)
          </p>
        </div>
      </Card>
    </div>
  );
};

export default ChatTutor;