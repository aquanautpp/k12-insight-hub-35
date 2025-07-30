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
- Mantenha tom amigável e motivador`

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
        model: 'gpt-4.1-2025-04-14',
        messages: messages,
        max_tokens: 300,
        temperature: 0.7,
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
  }

  return suggestionsByStage[cpaStage as keyof typeof suggestionsByStage] || [
    "Explique de forma mais simples",
    "Dê mais exemplos",
    "Como posso praticar?"
  ]
}