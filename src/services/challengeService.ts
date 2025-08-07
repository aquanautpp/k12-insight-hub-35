import { supabase } from "@/integrations/supabase/client";

export type ChallengeCategory = 'mathematics' | 'logic' | 'life_practical' | 'emotional';
export type ChallengeDifficulty = 'beginner' | 'intermediate' | 'advanced';
export type ChallengeType = 'numeric' | 'multiple_choice' | 'open_ended';

export interface AIChallenge {
  id: string;
  title: string;
  category: ChallengeCategory;
  difficulty: ChallengeDifficulty;
  description: string;
  context: string[];
  question: string;
  resources: string[];
  xpReward: number;
  timeEstimate: number;
  type: ChallengeType;
  options?: string[];
  answer?: number | string;
  correctIndex?: number;
  explanation: string;
}

export async function generateChallenge(params: {
  level?: number;
  style?: string;
  category?: ChallengeCategory;
}): Promise<AIChallenge> {
  const { data, error } = await supabase.functions.invoke('generate-challenge', {
    body: params,
  });

  if (error) throw error;
  return data as AIChallenge;
}

export function gradeAnswer(
  challenge: AIChallenge,
  userAnswer: string
): { isCorrect: boolean; feedback: string } {
  const trimmed = userAnswer.trim();

  if (challenge.type === 'numeric') {
    const userNum = parseFloat(trimmed.replace(',', '.'));
    const correctNum = typeof challenge.answer === 'number' ? challenge.answer : parseFloat(String(challenge.answer));
    if (Number.isFinite(userNum) && Number.isFinite(correctNum)) {
      const isCorrect = Math.abs(userNum - (correctNum as number)) <= 0.01 * Math.max(1, Math.abs(correctNum as number));
      return {
        isCorrect,
        feedback: isCorrect
          ? 'Perfeito! Seu resultado bate com o esperado.'
          : `Quase lá. Revise os cálculos. Dica: ${challenge.explanation}`,
      };
    }
  }

  if (challenge.type === 'multiple_choice') {
    // Allow compare by option text or letter (A-D)
    const normalized = trimmed.toLowerCase();
    const options = challenge.options || [];
    const indexFromLetter = ['a', 'b', 'c', 'd'].indexOf(normalized);
    const chosenIndex = indexFromLetter >= 0 ? indexFromLetter : options.findIndex(o => o.toLowerCase() === normalized);

    const isCorrect = chosenIndex === challenge.correctIndex;
    return {
      isCorrect,
      feedback: isCorrect ? 'Resposta correta! Boa!' : `Resposta incorreta. Pense em: ${challenge.explanation}`,
    };
  }

  // open_ended: basic keyword hinting using explanation
  const key = (challenge.explanation || '').toLowerCase();
  const hit = key && trimmed.toLowerCase().split(/\W+/).some(word => key.includes(word) && word.length > 3);
  return {
    isCorrect: !!hit,
    feedback: hit ? 'Bom raciocínio! Você abordou pontos essenciais.' : `Faltaram alguns passos-chave. Pista: ${challenge.explanation}`,
  };
}
