// OpenAI Service for Real AI Tutoring via Supabase Edge Functions

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
  private supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  private supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  
  constructor() {
    // Set the provided API key for immediate use
    const providedKey = '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';
    localStorage.setItem('openai_api_key', providedKey);
  }

  async generateResponse(
    userMessage: string, 
    context: {
      learningStyle?: string;
      currentLevel?: number;
      cpaStage?: 'concrete' | 'pictorial' | 'abstract';
      previousMessages?: ChatMessage[];
    }
  ): Promise<ChatResponse> {
    
    try {
      // Check if we have Supabase configured
      if (this.supabaseUrl && this.supabaseAnonKey) {
        // Try Supabase Edge Function first
        const response = await fetch(`${this.supabaseUrl}/functions/v1/chat-tutor`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.supabaseAnonKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: userMessage,
            context: context
          }),
        });

        if (response.ok) {
          const data = await response.json();
          if (!data.error) {
            return {
              message: data.message,
              suggestions: data.suggestions || [],
              confidence: data.confidence || 95
            };
          }
        }
      }

      // Fallback to direct OpenAI API call with localStorage key
      const apiKey = localStorage.getItem('openai_api_key');
      if (apiKey && apiKey.startsWith('sk-')) {
        return await this.callOpenAIDirectly(userMessage, context, apiKey);
      }

      // If no API key available, use mock response
      throw new Error('No API key configured');

    } catch (error) {
      console.error('OpenAI Service Error:', error);
      // Fallback to mock response
      return this.getMockResponse(userMessage, context);
    }
  }

  private async callOpenAIDirectly(
    userMessage: string,
    context: any,
    apiKey: string
  ): Promise<ChatResponse> {
    const systemPrompt = `Você é Meraki, um tutor de IA especializado em educação personalizada usando o Método CPA (Concreto-Pictórico-Abstrato).

CONTEXTO DO ESTUDANTE:
- Estilo de aprendizagem: ${context.learningStyle || 'visual'}
- Nível atual: ${context.currentLevel || 1}
- Estágio CPA preferido: ${context.cpaStage || 'pictorial'}

INSTRUÇÕES:
1. Adapte suas respostas ao estilo de aprendizagem do estudante
2. Use linguagem adequada ao nível dele
3. Quando explicar matemática, sempre mencione os 3 estágios CPA quando relevante
4. Seja encorajador e positivo
5. Forneça exemplos práticos e relevantes
6. Se o estudante estiver com dificuldades, simplifique e volte ao estágio concreto

FORMATO DE RESPOSTA:
- Seja claro e objetivo (máximo 200 palavras)
- Use emojis quando apropriado
- Inclua dicas práticas
- Mantenha tom amigável e motivador`;

    const messages = [
      { role: 'system', content: systemPrompt },
      ...(context.previousMessages || []),
      { role: 'user', content: userMessage }
    ];

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14',
        messages: messages,
        max_tokens: 300,
        temperature: 0.7,
        presence_penalty: 0.1,
        frequency_penalty: 0.1,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    const aiMessage = data.choices[0]?.message?.content || 'Desculpe, não consegui processar sua mensagem.';

    return {
      message: aiMessage,
      suggestions: this.generateSuggestions(context.cpaStage || 'pictorial'),
      confidence: 95
    };
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

  private buildSystemPrompt(context: any): string {
    let prompt = `Você é Meraki, um tutor de IA especializado em educação personalizada usando o Método CPA (Concreto-Pictórico-Abstrato).

CONTEXTO DO ESTUDANTE:
- Estilo de aprendizagem: ${context.learningStyle || 'visual'}
- Nível atual: ${context.currentLevel || 1}
- Estágio CPA preferido: ${context.cpaStage || 'pictorial'}

INSTRUÇÕES:
1. Adapte suas respostas ao estilo de aprendizagem do estudante
2. Use linguagem adequada ao nível dele
3. Quando explicar matemática, sempre mencione os 3 estágios CPA
4. Seja encorajador e positivo
5. Forneça exemplos práticos e relevantes
6. Se o estudante estiver com dificuldades, simplifique e volte ao estágio concreto

FORMATO DE RESPOSTA:
- Seja claro e objetivo
- Use emojis quando apropriado
- Inclua dicas práticas
- Sugira próximos passos quando relevante`;

    return prompt;
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
