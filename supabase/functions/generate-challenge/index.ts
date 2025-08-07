import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface GenerateRequest {
  level?: number;
  style?: string;
  category?: "mathematics" | "logic" | "life_practical" | "emotional";
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const openAIApiKey = Deno.env.get("OPENAI_API_KEY");
  if (!openAIApiKey) {
    return new Response(JSON.stringify({ error: "Missing OPENAI_API_KEY" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const { level = 1, style = "visual", category }: GenerateRequest = await req.json();

    // Map numeric level to difficulty label
    const difficulty = level < 5 ? "beginner" : level < 15 ? "intermediate" : "advanced";

    const systemPrompt = `Você é um gerador de Desafios Diários para uma plataforma educacional baseada no método CPA (Concreto, Pictórico, Abstrato) e inteligência emocional.\n\nRegras:\n- Gere desafios práticos e contextualizados para estudantes brasileiros.\n- Respeite o nível de dificuldade: beginner, intermediate ou advanced.\n- Adapte o enunciado ao estilo de aprendizagem quando possível (visual, auditivo, cinestésico, leitura/escrita).\n- SEMPRE responda em JSON VÁLIDO, sem texto extra.\n- Estrutura JSON obrigatória:\n{\n  "id": string,\n  "title": string,\n  "category": "mathematics"|"logic"|"life_practical"|"emotional",\n  "difficulty": "beginner"|"intermediate"|"advanced",\n  "description": string,\n  "context": string[],\n  "question": string,\n  "resources": string[],\n  "xpReward": number,\n  "timeEstimate": number,\n  "type": "numeric"|"multiple_choice"|"open_ended",\n  "options"?: string[],\n  "answer"?: number|string,\n  "correctIndex"?: number,\n  "explanation": string\n}\n\nObservações:\n- Se type = numeric, inclua "answer" numérico e "explanation".\n- Se type = multiple_choice, inclua "options" (4) e "correctIndex".\n- Se type = open_ended, omita "answer" e forneça "explanation" com solução-resumo.\n- Para life_practical, traga situações do cotidiano (ex.: orçamento, compras, tempo).`;

    const userPrompt = `Gere um desafio diário. Parâmetros:\n- difficulty: ${difficulty}\n- learningStyle: ${style}\n- category preferida: ${category ?? "any"}\n- Dê títulos claros e contexto enxuto.\n- Tempo estimado entre 8 e 20 minutos.\n- xpReward entre 40 e 100.`;

    const resp = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${openAIApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.6,
      }),
    });

    if (!resp.ok) {
      const err = await resp.text();
      console.error("OpenAI error:", err);
      return new Response(JSON.stringify({ error: "OpenAI request failed" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await resp.json();
    const content = data.choices?.[0]?.message?.content ?? "";

    // Ensure valid JSON response
    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch (_e) {
      // Try to extract JSON block if model added extra text
      const match = content.match(/\{[\s\S]*\}/);
      if (match) parsed = JSON.parse(match[0]);
    }

    if (!parsed || !parsed.id || !parsed.title) {
      return new Response(JSON.stringify({ error: "Invalid model output" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-challenge error:", e);
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
