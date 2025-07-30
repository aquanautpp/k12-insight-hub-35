// OpenAI Service for Real AI Tutoring via Supabase Edge Functions
import { supabase } from '@/integrations/supabase/client';

interface ChatMessage {
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
        message: `Ótima pergunta! 🎯 Com base no seu estilo de aprendizagem ${context.learningStyle || 'visual'}, vou explicar de forma que seja mais fácil para você entender.

Para resolver este tipo de problema, sugiro começar pelo estágio **concreto** - imagine objetos reais que você pode tocar. Depois, podemos desenhar ou visualizar (estágio **pictórico**), e finalmente trabalhar com números e símbolos (estágio **abstrato**).

Que tal tentarmos juntos? Você pode me contar que parte específica está achando mais difícil?`,
        suggestions: [
          "Explique com mais exemplos visuais",
          "Mostre passo a passo",
          "Dê uma dica para começar"
        ],
        confidence: 94
      },
      {
        message: `Perfeito! 🌟 Você está no nível ${context.currentLevel || 12}, então posso ver que já domina muitos conceitos.

Para este problema, recomendo a abordagem do Método CPA:
1. **Concreto**: Use objetos do dia a dia para representar o problema
2. **Pictórico**: Desenhe ou faça diagramas
3. **Abstrato**: Trabalhe com as fórmulas matemáticas

Isso vai te ajudar a ver o problema de diferentes ângulos. Qual estágio você prefere começar?`,
        suggestions: [
          "Prefiro começar com objetos concretos",
          "Vou direto para os desenhos",
          "Quero ver a fórmula matemática"
        ],
        confidence: 91
      },
      {
        message: `Entendo sua dúvida! 💡 Com seu estilo ${context.learningStyle || 'visual'}, é normal preferir ver as coisas de forma mais visual.

Aqui está uma estratégia que costuma funcionar bem:
- Primeiro, quebre o problema em partes menores
- Use cores ou símbolos para organizar as informações
- Faça conexões com situações que você já conhece

Lembre-se: não existe pergunta boba! Cada dúvida é uma oportunidade de aprender algo novo. Continue perguntando! 🚀`,
        suggestions: [
          "Me dê mais exemplos práticos",
          "Como posso praticar isso?",
          "Qual é o próximo passo?"
        ],
        confidence: 88
      }
    ];

    return responses[Math.floor(Math.random() * responses.length)];
  }

  async generatePersonalizedInsight(progressData: any): Promise<string> {
    // Mock implementation for generating insights based on progress
    const insights = [
      `Com base no seu progresso, vejo que você está se destacando em ${progressData.skillsProgress?.[0]?.skill || 'raciocínio lógico'}! 🎯`,
      `Sua sequência de ${progressData.currentStreak || 3} dias mostra grande dedicação! Continue assim! 🔥`,
      `Notei que você completa atividades rapidamente. Que tal tentar problemas um pouco mais desafiadores? 🚀`,
      `Seu método CPA favorito parece ser o pictórico. Ótima escolha para quem aprende visualmente! 👁️`
    ];

    return insights[Math.floor(Math.random() * insights.length)];
  }
}

export const openaiService = new OpenAIService();
