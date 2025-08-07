// OpenAI Service for Real AI Tutoring via Supabase Edge Functions
import { supabase } from '@/integrations/supabase/client';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface ChatResponse {
  message: string;
  suggestions?: string[];
  confidence: number;
}

class OpenAIService {
  private apiKeyStatus: 'none' | 'active' | 'error' = 'none';
  
  constructor() {
    // Check if we can connect to Supabase edge function
    this.checkApiKeyStatus();
  }

  private async checkApiKeyStatus() {
    try {
      // Test connection to the edge function
      const { data, error } = await supabase.functions.invoke('chat-tutor', {
        body: { 
          message: 'test', 
          context: { cpaStage: 'pictorial' } 
        }
      });
      
      if (!error) {
        this.apiKeyStatus = 'active';
      } else {
        this.apiKeyStatus = 'error';
      }
    } catch (error) {
      this.apiKeyStatus = 'error';
    }
  }

  getApiKeyStatus(): 'none' | 'active' | 'error' {
    return this.apiKeyStatus;
  }

  async generateResponse(
    userMessage: string, 
    context: {
      learningStyle?: string;
      currentLevel?: number;
      cpaStage?: 'concrete' | 'pictorial' | 'abstract';
      previousMessages?: ChatMessage[];
    }
  ): Promise<ChatResponse & { isRealAI?: boolean }> {
    
    try {
      console.log('🤖 Using Supabase Edge Function with OpenAI');
      
      const { data, error } = await supabase.functions.invoke('chat-tutor', {
        body: { 
          message: userMessage,
          context: {
            learningStyle: context.learningStyle,
            currentLevel: context.currentLevel,
            cpaStage: context.cpaStage,
            previousMessages: context.previousMessages
          }
        }
      });

      if (error) {
        console.error('Edge function error:', error);
        throw new Error(`Edge function error: ${error.message}`);
      }

      if (data && data.message) {
        this.apiKeyStatus = 'active';
        return { 
          message: data.message,
          suggestions: data.suggestions || this.generateSuggestions(context.cpaStage || 'pictorial'),
          confidence: data.confidence || 95,
          isRealAI: true 
        };
      } else {
        throw new Error('Invalid response from edge function');
      }

    } catch (error) {
      console.error('OpenAI Service Error:', error);
      console.log('🎭 Using mock response (API error)');
      this.apiKeyStatus = 'error';
      return { ...this.getMockResponse(userMessage, context), isRealAI: false };
    }
  }


  private generateSuggestions(cpaStage: string): string[] {
    const suggestionsByStage = {
      concrete: [
        "Mostre com objetos físicos",
        "Use material manipulativo", 
        "Dê um exemplo do dia a dia"
      ],
      pictorial: [
        "Desenhe o problema",
        "Use diagramas visuais",
        "Mostre com imagens"
      ],
      abstract: [
        "Explique a fórmula", 
        "Mostre os símbolos matemáticos",
        "Use notação algébrica"
      ]
    };

    return suggestionsByStage[cpaStage as keyof typeof suggestionsByStage] || [
      "Explique de forma mais simples",
      "Dê mais exemplos", 
      "Como posso praticar?"
    ];
  }


  private getMockResponse(userMessage: string, context: any): ChatResponse {
    const responses = [
      {
        message: `**Análise da Questão**

Com base no seu perfil de aprendizagem ${context.learningStyle || 'visual'}, organizarei a explicação de forma estruturada.

**Abordagem Metodológica:**
• **Concreto:** Representação através de objetos físicos
• **Pictórico:** Visualização por meio de diagramas
• **Abstrato:** Aplicação de símbolos matemáticos

Esta progressão garante compreensão sólida do conceito. Qual estágio deseja iniciar?`,
        suggestions: [
          "Demonstre com exemplos visuais",
          "Explique passo a passo",
          "Forneça dica inicial"
        ],
        confidence: 94
      },
      {
        message: `**Avaliação do Nível**

Considerando seu nível atual ${context.currentLevel || 'intermediário'}, você possui base conceitual adequada para esta abordagem.

**Estratégia CPA Recomendada:**
1. **Concreto:** Manipulação de objetos cotidianos
2. **Pictórico:** Construção de representações visuais
3. **Abstrato:** Aplicação de fórmulas e algoritmos

**Próximo passo:** Selecione o estágio de preferência para iniciarmos.`,
        suggestions: [
          "Iniciar com objetos concretos",
          "Partir para representações visuais",
          "Aplicar fórmulas diretamente"
        ],
        confidence: 91
      },
      {
        message: `**Estratégia de Aprendizagem**

Para estudantes com perfil ${context.learningStyle || 'visual'}, recomendo abordagem sistematizada:

**Técnicas Eficazes:**
• Decomposição em etapas menores
• Uso de códigos visuais organizacionais
• Conexão com experiências familiares

**Fundamento:** Questões são oportunidades de consolidação conceitual.

Está pronto para aplicarmos estas estratégias?`,
        suggestions: [
          "Forneça exemplos práticos",
          "Sugira exercícios de prática",
          "Indique próxima etapa"
        ],
        confidence: 88
      }
    ];

    return responses[Math.floor(Math.random() * responses.length)];
  }

  async generatePersonalizedInsight(progressData: any): Promise<string> {
    const insights = [
      `Com base no seu progresso, vejo que você está se destacando em ${progressData.skillsProgress?.[0]?.skill || 'raciocínio lógico'}! 🎯`,
      `Sua sequência de ${progressData.currentStreak || 3} dias mostra grande dedicação! Continue assim! 🔥`,
      `Notei que você completa atividades rapidamente. Que tal tentar problemas um pouco mais desafiadores? 🚀`,
      `Seu método CPA favorito parece ser o pictórico. Ótima escolha para quem aprende visualmente! 👁️`
    ];

    return insights[Math.floor(Math.random() * insights.length)];
  }

  async textToSpeech(text: string, voice?: string): Promise<{ base64: string; format: 'mp3' }> {
    try {
      const { data, error } = await supabase.functions.invoke('text-to-speech', {
        body: { text, voice }
      });
      if (error) throw error;
      if (!data?.audioContent) throw new Error('Resposta inválida do TTS');
      return { base64: data.audioContent as string, format: (data.format || 'mp3') as 'mp3' };
    } catch (e) {
      console.error('TTS error:', e);
      throw e;
    }
  }
}

export const openaiService = new OpenAIService();
