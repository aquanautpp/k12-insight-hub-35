import { Button } from '@/components/ui/button';
import { ThumbsUp, ThumbsDown, Copy, RotateCcw, BookOpen, PenTool } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface QuickActionButtonsProps {
  messageContent: string;
  onExplainDifferently: () => void;
  onMoreDetails: () => void;
  onCreateExercise: () => void;
}

export const QuickActionButtons = ({ 
  messageContent, 
  onExplainDifferently, 
  onMoreDetails, 
  onCreateExercise 
}: QuickActionButtonsProps) => {
  const { toast } = useToast();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(messageContent);
      toast({
        title: "Copiado!",
        description: "Resposta copiada para a área de transferência.",
      });
    } catch (error) {
      toast({
        title: "Erro ao copiar",
        description: "Não foi possível copiar o texto.",
        variant: "destructive",
      });
    }
  };

  const handleFeedback = (isPositive: boolean) => {
    toast({
      title: isPositive ? "Obrigada!" : "Que pena!",
      description: isPositive 
        ? "Fico feliz que a resposta foi útil!" 
        : "Vou me esforçar para melhorar a próxima resposta.",
    });
  };

  return (
    <div className="flex flex-wrap gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleFeedback(true)}
        className="h-7 px-2 text-xs hover:bg-green-100 hover:text-green-700"
      >
        <ThumbsUp className="w-3 h-3 mr-1" />
        Útil
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleFeedback(false)}
        className="h-7 px-2 text-xs hover:bg-red-100 hover:text-red-700"
      >
        <ThumbsDown className="w-3 h-3 mr-1" />
        Não ajudou
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={handleCopy}
        className="h-7 px-2 text-xs hover:bg-blue-100 hover:text-blue-700"
      >
        <Copy className="w-3 h-3 mr-1" />
        Copiar
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={onExplainDifferently}
        className="h-7 px-2 text-xs hover:bg-purple-100 hover:text-purple-700"
      >
        <RotateCcw className="w-3 h-3 mr-1" />
        Explicar diferente
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={onMoreDetails}
        className="h-7 px-2 text-xs hover:bg-orange-100 hover:text-orange-700"
      >
        <BookOpen className="w-3 h-3 mr-1" />
        Mais detalhes
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={onCreateExercise}
        className="h-7 px-2 text-xs hover:bg-emerald-100 hover:text-emerald-700"
      >
        <PenTool className="w-3 h-3 mr-1" />
        Fazer exercício
      </Button>
    </div>
  );
};