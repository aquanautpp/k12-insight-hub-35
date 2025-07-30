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
  private apiKeyStatus: 'none' | 'stored' | 'active' = 'none';
  
  constructor() {
    this.checkApiKeyStatus();
  }

  private checkApiKeyStatus() {
    const apiKey = localStorage.getItem('openai_api_key');
    if (apiKey && apiKey.startsWith('sk-')) {
      this.apiKeyStatus = 'stored';
    }
  }

  getApiKeyStatus(): 'none' | 'stored' | 'active' {
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
      // Try direct OpenAI API call first
      const apiKey = localStorage.getItem('openai_api_key');
      if (apiKey && apiKey.startsWith('sk-')) {
        console.log('🤖 Using real OpenAI API');
        const response = await this.callOpenAIDirectly(userMessage, context, apiKey);
        this.apiKeyStatus = 'active';
        return { ...response, isRealAI: true };
      }

      // If no API key available, use mock response
      console.log('🎭 Using mock response (no API key)');
      throw new Error('No API key configured');

    } catch (error) {
      console.error('OpenAI Service Error:', error);
      // Fallback to mock response
      console.log('🎭 Using mock response (API error)');
      return { ...this.getMockResponse(userMessage, context), isRealAI: false };
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
