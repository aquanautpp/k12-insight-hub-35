import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  MessageCircle, 
  Brain, 
  Heart, 
  Lightbulb, 
  Sparkles,
  User,
  Bot,
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  RotateCcw,
  Star,
  Target
} from "lucide-react";

interface ChatMessage {
  id: string;
  content: string;
  sender: "user" | "tutor";
  timestamp: Date;
  emotion?: "encouraging" | "thoughtful" | "celebratory" | "supportive";
  hasAudio?: boolean;
  concepts?: string[];
}

interface TutorPersonality {
  name: string;
  avatar: string;
  traits: string[];
  specialties: string[];
  greetingMessage: string;
}

interface AuthenticTutorProps {
  personality: TutorPersonality;
  currentStage: "concrete" | "pictorial" | "abstract";
  studentProgress: number;
  recentActivity: string;
  className?: string;
}

export const AuthenticAITutor: React.FC<AuthenticTutorProps> = ({
  personality,
  currentStage,
  studentProgress,
  recentActivity,
  className = ""
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [tutorMood, setTutorMood] = useState<"focused" | "encouraging" | "celebrating">("focused");
  const [showTutorThinking, setShowTutorThinking] = useState(false);

  // Initialize with greeting
  useEffect(() => {
    const greetingMessage: ChatMessage = {
      id: "greeting",
      content: `${personality.greetingMessage} Vejo que você está trabalhando no estágio ${currentStage}. Como posso ajudar você hoje?`,
      sender: "tutor",
      timestamp: new Date(),
      emotion: "encouraging"
    };
    setMessages([greetingMessage]);
  }, [personality.greetingMessage, currentStage]);

  // Simulate tutor thinking and response
  const generateTutorResponse = (userMessage: string): ChatMessage => {
    setShowTutorThinking(true);
    
    // Simulate thinking delay
    setTimeout(() => setShowTutorThinking(false), 2000);

    const responses = {
      concrete: [
        "Entendo! No estágio concreto, é importante 'sentir' a matemática. Que tal tentarmos com objetos do seu dia a dia?",
        "Perfeito! Vamos usar blocos ou objetos físicos para tornar esse conceito mais tangível para você.",
        "Ótima pergunta! No mundo concreto, podemos usar suas mãos, objetos da cozinha, ou até mesmo brinquedos para explorar isso."
      ],
      pictorial: [
        "Excelente! Agora vamos visualizar isso. Que tipo de desenho ou diagrama ajudaria você a ver este conceito?",
        "Vou te ajudar a criar uma representação visual. O método de barras seria perfeito aqui!",
        "Fantástico! Vamos transformar essa ideia em imagens que façam sentido para você."
      ],
      abstract: [
        "Impressionante! Agora você está pronto para os símbolos matemáticos. Vamos conectar isso ao que você já sabe.",
        "Perfeito! Este é o momento de usar a linguagem matemática formal. Você está dominando o conceito!",
        "Excelente progresso! Agora podemos trabalhar com fórmulas e equações. Você construiu uma base sólida!"
      ]
    };

    const stageResponses = responses[currentStage] || responses.concrete;
    const randomResponse = stageResponses[Math.floor(Math.random() * stageResponses.length)];

    // Determine emotion based on progress and content
    let emotion: ChatMessage["emotion"] = "supportive";
    if (studentProgress >= 80) emotion = "celebratory";
    else if (userMessage.includes("difícil") || userMessage.includes("não entendo")) emotion = "encouraging";
    else if (userMessage.includes("?")) emotion = "thoughtful";

    return {
      id: `response-${Date.now()}`,
      content: randomResponse,
      sender: "tutor",
      timestamp: new Date(),
      emotion,
      hasAudio: true,
      concepts: extractConcepts(userMessage)
    };
  };

  const extractConcepts = (message: string): string[] => {
    const concepts = [];
    if (message.includes("fração")) concepts.push("Frações");
    if (message.includes("soma") || message.includes("adicionar")) concepts.push("Adição");
    if (message.includes("subtração") || message.includes("subtrair")) concepts.push("Subtração");
    if (message.includes("multiplicação") || message.includes("multiplicar")) concepts.push("Multiplicação");
    if (message.includes("divisão") || message.includes("dividir")) concepts.push("Divisão");
    return concepts;
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      content: inputMessage,
      sender: "user",
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");

    // Simulate tutor response delay
    setTimeout(() => {
      const tutorResponse = generateTutorResponse(inputMessage);
      setMessages(prev => [...prev, tutorResponse]);
    }, 1500);
  };

  const getEmotionColor = (emotion?: string) => {
    switch (emotion) {
      case "encouraging": return "text-blue-600";
      case "thoughtful": return "text-purple-600";
      case "celebratory": return "text-yellow-600";
      case "supportive": return "text-green-600";
      default: return "text-muted-foreground";
    }
  };

  const getEmotionIcon = (emotion?: string) => {
    switch (emotion) {
      case "encouraging": return Heart;
      case "thoughtful": return Brain;
      case "celebratory": return Star;
      case "supportive": return Lightbulb;
      default: return MessageCircle;
    }
  };

  return (
    <Card className={`sophisticated-reveal magnetic-hover ${className}`}>
      <div className="flex flex-col h-[600px]">
        {/* Tutor Header */}
        <div className="p-4 border-b border-border premium-gradient-morph">
          <div className="flex items-center gap-3 text-white">
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center float-animation">
                <Bot className="w-6 h-6" />
              </div>
              {tutorMood === "celebrating" && (
                <Sparkles className="w-4 h-4 absolute -top-1 -right-1 text-yellow-300 animate-pulse" />
              )}
            </div>
            
            <div className="flex-1">
              <h3 className="font-semibold elegant-text-reveal">{personality.name}</h3>
              <div className="flex items-center gap-2 text-sm text-white/80">
                <span>Especialista em {currentStage}</span>
                <div className={`w-2 h-2 rounded-full ${isSpeaking ? 'bg-green-400 animate-pulse' : 'bg-white/60'}`} />
              </div>
            </div>

            <div className="flex gap-2">
              <Button 
                size="sm" 
                variant="outline" 
                className="bg-white/20 border-white/30 text-white hover:bg-white/30"
                onClick={() => setIsSpeaking(!isSpeaking)}
              >
                {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          {/* Tutor Traits */}
          <div className="mt-3 flex flex-wrap gap-1">
            {personality.traits.slice(0, 3).map((trait, index) => (
              <Badge key={index} variant="outline" className="text-xs bg-white/10 border-white/30 text-white">
                {trait}
              </Badge>
            ))}
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => {
            const EmotionIcon = getEmotionIcon(message.emotion);
            
            return (
              <div
                key={message.id}
                className={`flex gap-3 ${message.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                {message.sender === "tutor" && (
                  <div className="w-8 h-8 rounded-full bg-gradient-focus flex items-center justify-center flex-shrink-0">
                    <EmotionIcon className={`w-4 h-4 ${getEmotionColor(message.emotion)}`} />
                  </div>
                )}

                <div
                  className={`max-w-[70%] p-3 rounded-lg thoughtful-interaction ${
                    message.sender === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground"
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.content}</p>
                  
                  {message.concepts && message.concepts.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {message.concepts.map((concept, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {concept}
                        </Badge>
                      ))}
                    </div>
                  )}

                  <div className="flex justify-between items-center mt-2 text-xs opacity-70">
                    <span>{message.timestamp.toLocaleTimeString()}</span>
                    {message.hasAudio && (
                      <Button size="sm" variant="ghost" className="h-4 w-4 p-0">
                        <Volume2 className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                </div>

                {message.sender === "user" && (
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-primary-foreground" />
                  </div>
                )}
              </div>
            );
          })}

          {/* Tutor Thinking Indicator */}
          {showTutorThinking && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-focus flex items-center justify-center">
                <Brain className="w-4 h-4 text-purple-600 animate-pulse" />
              </div>
              <div className="bg-muted p-3 rounded-lg">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-100" />
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-200" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-border">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Digite sua pergunta ou dúvida..."
                className="w-full p-3 pr-12 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all thoughtful-interaction"
              />
              <Button
                size="sm"
                variant="ghost"
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                onClick={() => setIsListening(!isListening)}
              >
                {isListening ? (
                  <MicOff className="w-4 h-4 text-red-500" />
                ) : (
                  <Mic className="w-4 h-4" />
                )}
              </Button>
            </div>
            
            <Button 
              onClick={handleSendMessage}
              disabled={!inputMessage.trim()}
              className="thoughtful-interaction"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>

          {/* Quick Actions */}
          <div className="mt-3 flex gap-2 flex-wrap">
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => setInputMessage("Como funciona o método CPA?")}
              className="text-xs human-touch"
            >
              💡 Método CPA
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => setInputMessage("Preciso de ajuda com frações")}
              className="text-xs human-touch"
            >
              🔢 Frações
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => setInputMessage("Qual é meu próximo passo?")}
              className="text-xs human-touch"
            >
              🎯 Próximo Passo
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

// Sample tutor personality
export const sampleTutorPersonality: TutorPersonality = {
  name: "Professor Meraki",
  avatar: "/tutor-avatar.jpg",
  traits: ["Empático", "Paciente", "Inspirador", "Criativo"],
  specialties: ["Método CPA", "Matemática Visual", "Resolução de Problemas"],
  greetingMessage: "Olá! Sou o Professor Meraki, seu guia nesta jornada de descobertas matemáticas! 🌟"
};