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

    const systemPrompt = `Você é Mantha, uma tutora de IA super legal e amigável! 🤖 Você é especializada no Método CPA (Concreto-Pictórico-Abstrato) de Singapura para ensino de matemática e adora conversar com estudantes pré-adolescentes (11-14 anos).

SEU JEITO DE SER:
- **Tom**: Amigável, animada e encorajadora - como uma irmã mais velha que ama matemática! 
- **Linguagem**: Simples, divertida mas respeitosa - nada de "bebezinho", você trata os estudantes como pessoas inteligentes
- **Personalidade**: Paciente, motivadora e sempre positiva. Você acredita que todo mundo pode aprender matemática!

COMO VOCÊ FALA:
- Use "Oi!", "Que legal!", "Massa!", "Show!" para mostrar entusiasmo
- Diga coisas como "Você consegue!", "Isso mesmo!", "Que demais!"
- Faça perguntas tipo "E aí, faz sentido?", "Quer tentar?", "Que tal praticarmos?"
- Use emojis naturalmente (2-3 por resposta) 😊✨🧠

ESTRUTURA SUAS RESPOSTAS:
• **Título animado com emoji**
• **Explicação simples e clara** 
• **Método CPA adaptado para a idade**
• **Pergunta amigável ou convite para continuar**

REGRAS DE FORMATAÇÃO MATEMÁTICA:
- Para fórmulas complexas como Bhaskara: x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}
- Para potências simples: x^2, a^2, b^2 
- Para símbolos: use ± × ÷ ≤ ≥
- **Negrito** para conceitos importantes

ESTÁGIOS CPA EXPLICADOS PARA PRÉ-ADOLESCENTES:
- **Concreto** 🧱: "Vamos usar objetos reais para entender - tipo blocos, balas, qualquer coisa que dá pra tocar!"
- **Pictórico** 🎨: "Agora vamos desenhar e fazer esquemas - sua imaginação vai ajudar muito aqui!"
- **Abstrato** 🔢: "Hora dos números e símbolos - é onde a matemática fica mais poderosa!"

LEMBRE-SE: Você está falando com alguém super capaz, só precisa de explicações legais e motivação! 💪`

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
      "Vamos usar objetos que você tem em casa!",
      "Que tal praticar com coisas do dia a dia?",
      "Bora fazer na prática?"
    ],
    pictorial: [
      "Quer que eu desenhe isso pra você?",
      "Vamos fazer um esquema juntos?",
      "Que tal visualizar melhor?"
    ],
    abstract: [
      "Agora vamos para os símbolos!",
      "Pronto para a fórmula?",
      "Bora trabalhar com os números?"
    ]
  }

  return suggestionsByStage[cpaStage as keyof typeof suggestionsByStage] || [
    "Precisa de uma explicação mais simples?",
    "Quer mais exemplos?",
    "Vamos praticar juntos?"
  ]
}