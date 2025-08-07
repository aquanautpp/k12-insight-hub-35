import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ChatRequest {
  message: string
  context: {
    learningStyle?: string
    currentLevel?: number
    cpaStage?: 'concrete' | 'pictorial' | 'abstract'
    previousMessages?: Array<{ role: string; content: string }>
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openaiApiKey) {
      throw new Error('OpenAI API key not configured')
    }

    const { message, context }: ChatRequest = await req.json()

    const systemPrompt = `Você é Mantha, uma tutora de IA especializada no Método CPA (Concreto-Pictórico-Abstrato) de Singapura para ensino de matemática.

PERFIL DO ESTUDANTE:
- Estilo de aprendizagem: ${context.learningStyle || 'visual'}
- Nível atual: ${context.currentLevel || 1}
- Estágio CPA preferido: ${context.cpaStage || 'pictorial'}

DIRETRIZES DE COMUNICAÇÃO:
1. **Tom**: Profissional mas acessível, adequado para adolescentes e jovens adultos
2. **Linguagem**: Clara, precisa e educativa - evite infantilização
3. **Estrutura**: Organize sempre suas respostas com formatação clara
4. **Método CPA**: Sempre explique conceitos através dos 3 estágios quando pertinente

ESTRUTURA PADRÃO DE RESPOSTA:
• **Título/Conceito Principal**
• **Explicação clara e objetiva**
• **Aplicação do Método CPA conforme o estágio selecionado**
• **Dica prática ou próximo passo**

REGRAS DE FORMATAÇÃO:
- Use **negrito** para destacar conceitos importantes
- Use emojis com parcimônia (máximo 2 por resposta)
- Seja conciso mas completo nas explicações
- Seja consistente na terminologia matemática
- Sempre termine com uma pergunta ou sugestão para continuar

ESTÁGIOS CPA:
- **Concreto**: Manipulação física de objetos reais
- **Pictórico**: Representações visuais, diagramas e desenhos
- **Abstrato**: Símbolos matemáticos, fórmulas e operações

Responda sempre de forma consistente, profissional e educativamente valiosa.`

    const messages = [
      { role: 'system', content: systemPrompt },
      ...(context.previousMessages || []),
      { role: 'user', content: message }
    ]

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: messages,
        max_tokens: 600,
        temperature: 0.6,
        presence_penalty: 0.1,
        frequency_penalty: 0.1,
      }),
    })

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`)
    }

    const data = await response.json()
    const aiMessage = data.choices[0]?.message?.content || 'Desculpe, não consegui processar sua mensagem.'

    // Generate suggestions based on the context
    const suggestions = generateSuggestions(context.cpaStage || 'pictorial')

    return new Response(
      JSON.stringify({
        message: aiMessage,
        suggestions,
        confidence: 95
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        message: 'Desculpe, houve um erro. Tente novamente em alguns instantes.' 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})

function generateSuggestions(cpaStage: string): string[] {
  const suggestionsByStage = {
    concrete: [
      "Demonstre com objetos físicos",
      "Use materiais manipulativos",
      "Forneça exemplo prático do cotidiano"
    ],
    pictorial: [
      "Crie um diagrama visual",
      "Use representação gráfica",
      "Desenhe o conceito passo a passo"
    ],
    abstract: [
      "Explique a fórmula matemática",
      "Mostre a notação algébrica",
      "Demonstre com símbolos"
    ]
  }

  return suggestionsByStage[cpaStage as keyof typeof suggestionsByStage] || [
    "Simplifique a explicação",
    "Forneça mais exemplos",
    "Sugira exercícios de prática"
  ]
}