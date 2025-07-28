// Serviço para integração com OpenAI - configuração básica
export class OpenAIService {
  private apiKey: string;
  
  constructor(apiKey?: string) {
    this.apiKey = apiKey || '';
  }

  async generateResponse(prompt: string, context: string = ''): Promise<string> {
    if (!this.apiKey) {
      return this.getFallbackResponse(prompt);
    }

    try {
      // Aqui seria a integração real com OpenAI
      // Por enquanto, retorna resposta simulada mais inteligente
      return this.getEnhancedFallbackResponse(prompt, context);
    } catch (error) {
      console.error('Erro na API OpenAI:', error);
      return this.getFallbackResponse(prompt);
    }
  }

  private getFallbackResponse(prompt: string): string {
    const responses = [
      "Interessante pergunta! Vou te ajudar a entender isso melhor usando o Método CPA.",
      "Vamos resolver isso passo a passo! Primeiro, que tal visualizarmos o problema?",
      "Ótima questão para praticarmos! Posso te explicar de forma visual e prática.",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  private getEnhancedFallbackResponse(prompt: string, context: string): string {
    // Análise mais sofisticada do prompt para respostas melhores
    if (prompt.includes('fracão') || prompt.includes('fração')) {
      return `Para frações, uso o método CPA: 🧱 Concreto: corte uma pizza em pedaços iguais. 🎨 Visual: desenhe círculos divididos. 🔢 Abstrato: trabalhe com numerador/denominador.`;
    }
    
    if (prompt.includes('área') || prompt.includes('perímetro')) {
      return `Para geometria: 🧱 Concreto: meça objetos reais com régua. 🎨 Visual: desenhe e calcule. 🔢 Abstrato: use fórmulas matemáticas.`;
    }

    return this.getFallbackResponse(prompt);
  }
}

export const openaiService = new OpenAIService();