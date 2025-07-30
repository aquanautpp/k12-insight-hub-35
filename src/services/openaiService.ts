// OpenAI Service for Enhanced AI Tutoring
// Note: This is a mock implementation - you'll need to add your OpenAI API key when ready

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
  private apiKey: string | null = null;
  private baseURL = 'https://api.openai.com/v1';

  setApiKey(key: string) {
    this.apiKey = key;
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
    
    // This method currently returns a mock response.
    // When an API key is provided, replace the code below with a real
    // OpenAI API call.
    if (!this.apiKey) {
      return this.getMockResponse(userMessage, context);
    }

    try {
      const systemPrompt = this.buildSystemPrompt(context);
      const messages: ChatMessage[] = [
        { role: 'system', content: systemPrompt },
        ...(context.previousMessages || []),
        { role: 'user', content: userMessage }
      ];

      // Here you would make the actual OpenAI API call
      // const response = await fetch(`${this.baseURL}/chat/completions`, {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': `Bearer ${this.apiKey}`,
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     model: 'gpt-4',
      //     messages: messages,
      //     max_tokens: 500,
      //     temperature: 0.7,
      //   }),
      // });

      // For now, return mock response
      return this.getMockResponse(userMessage, context);
    } catch (error) {
      console.error('OpenAI API Error:', error);
      return this.getMockResponse(userMessage, context);
    }
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
