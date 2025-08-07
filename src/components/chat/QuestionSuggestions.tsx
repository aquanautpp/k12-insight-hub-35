import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Lightbulb } from 'lucide-react';

type CPAStage = 'concrete' | 'pictorial' | 'abstract' | 'adaptive';

interface QuestionSuggestionsProps {
  currentStage: CPAStage;
  onSuggestionClick: (suggestion: string) => void;
  disabled?: boolean;
}

export const QuestionSuggestions = ({ currentStage, onSuggestionClick, disabled }: QuestionSuggestionsProps) => {
  const suggestions = {
    concrete: [
      "Como usar blocos para entender adição?",
      "Mostre 3 × 4 com objetos físicos",
      "Explique frações com pizza",
      "Como contar usando os dedos?"
    ],
    pictorial: [
      "Desenhe como resolver 15 ÷ 3",
      "Mostre visualmente o que é 2/3",
      "Como desenhar uma multiplicação?",
      "Explique geometria com desenhos"
    ],
    abstract: [
      "Resolva: (x + 3) × 2 = 14",
      "Qual a fórmula da área do triângulo?",
      "Como funciona o teorema de Pitágoras?",
      "Explique equações do 2º grau"
    ],
    adaptive: [
      "Ensine adição do básico ao avançado",
      "Explique fração de várias formas",
      "Como aprender tabuada facilmente?",
      "Mostre geometria na prática"
    ]
  };

  const currentSuggestions = suggestions[currentStage];

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Lightbulb className="w-4 h-4" />
        <span>Tente perguntar sobre:</span>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {currentSuggestions.map((suggestion, index) => (
          <Badge
            key={index}
            variant="outline"
            className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors px-3 py-1.5 text-xs"
            onClick={() => !disabled && onSuggestionClick(suggestion)}
          >
            {suggestion}
          </Badge>
        ))}
      </div>
    </div>
  );
};