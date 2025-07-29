import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { CheckCircle, RotateCcw, Plus, Minus } from "lucide-react";

interface BarSegment {
  id: string;
  value: number;
  label: string;
  color: string;
  width: number;
}

interface BarModelEditorProps {
  problem: {
    description: string;
    expectedModel: BarSegment[][];
    expectedResult: number;
    type: 'addition' | 'subtraction' | 'comparison' | 'part-whole';
  };
  onComplete: (success: boolean) => void;
}

export const BarModelEditor = ({ problem, onComplete }: BarModelEditorProps) => {
  const [bars, setBars] = useState<BarSegment[][]>([]);
  const [currentBar, setCurrentBar] = useState<BarSegment[]>([]);
  const [segmentValue, setSegmentValue] = useState<string>("");
  const [segmentLabel, setSegmentLabel] = useState<string>("");
  const [result, setResult] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const colors = [
    'hsl(var(--primary))',
    'hsl(var(--secondary))',
    'hsl(var(--accent))',
    '#10B981',
    '#F59E0B',
    '#EF4444',
    '#8B5CF6'
  ];

  useEffect(() => {
    drawBars();
  }, [bars, currentBar]);

  const drawBars = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    let yOffset = 20;
    const barHeight = 40;
    const spacing = 60;

    // Desenhar barras completas
    bars.forEach((bar, barIndex) => {
      let xOffset = 20;
      
      bar.forEach((segment, segmentIndex) => {
        ctx.fillStyle = segment.color;
        ctx.fillRect(xOffset, yOffset, segment.width, barHeight);
        
        // Borda
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.strokeRect(xOffset, yOffset, segment.width, barHeight);
        
        // Label e valor
        ctx.fillStyle = '#000';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(
          `${segment.label}: ${segment.value}`,
          xOffset + segment.width / 2,
          yOffset + barHeight / 2 + 4
        );
        
        xOffset += segment.width + 5;
      });
      
      yOffset += spacing;
    });

    // Desenhar barra atual em construção
    if (currentBar.length > 0) {
      ctx.strokeStyle = '#666';
      ctx.setLineDash([5, 5]);
      ctx.strokeRect(20, yOffset, 500, barHeight);
      ctx.setLineDash([]);
      
      let xOffset = 20;
      currentBar.forEach((segment) => {
        ctx.fillStyle = segment.color;
        ctx.fillRect(xOffset, yOffset, segment.width, barHeight);
        
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 1;
        ctx.strokeRect(xOffset, yOffset, segment.width, barHeight);
        
        ctx.fillStyle = '#000';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(
          `${segment.label}: ${segment.value}`,
          xOffset + segment.width / 2,
          yOffset + barHeight / 2 + 4
        );
        
        xOffset += segment.width + 5;
      });
    }
  };

  const addSegment = () => {
    const value = parseInt(segmentValue);
    if (isNaN(value) || value <= 0 || !segmentLabel.trim()) return;

    const width = Math.max(40, value * 3); // Proporção visual
    const colorIndex = currentBar.length % colors.length;
    
    const newSegment: BarSegment = {
      id: `seg-${Date.now()}`,
      value,
      label: segmentLabel,
      color: colors[colorIndex],
      width
    };

    setCurrentBar(prev => [...prev, newSegment]);
    setSegmentValue("");
    setSegmentLabel("");
  };

  const removeLastSegment = () => {
    setCurrentBar(prev => prev.slice(0, -1));
  };

  const finishBar = () => {
    if (currentBar.length === 0) return;
    
    setBars(prev => [...prev, currentBar]);
    setCurrentBar([]);
  };

  const checkModel = () => {
    // Verificar se o modelo criado corresponde ao esperado
    const totalValue = bars.reduce((sum, bar) => 
      sum + bar.reduce((barSum, segment) => barSum + segment.value, 0), 0
    );
    
    setResult(totalValue);
    
    // Lógica simplificada de verificação
    const isCorrect = Math.abs(totalValue - problem.expectedResult) <= 1;
    setShowFeedback(true);
    
    if (isCorrect) {
      setTimeout(() => onComplete(true), 2000);
    }
  };

  const reset = () => {
    setBars([]);
    setCurrentBar([]);
    setSegmentValue("");
    setSegmentLabel("");
    setResult(null);
    setShowFeedback(false);
  };

  const getTypeInstruction = () => {
    switch (problem.type) {
      case 'addition':
        return "Crie barras separadas para cada valor e depois uma barra total.";
      case 'subtraction':
        return "Crie uma barra total e mostre a parte que foi removida.";
      case 'comparison':
        return "Crie barras de diferentes tamanhos para comparar valores.";
      case 'part-whole':
        return "Crie uma barra total e divida em partes menores.";
      default:
        return "Construa o modelo de barras que representa o problema.";
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-2xl">🎨</span>
          Editor de Modelo de Barras - Estágio Pictórico
        </CardTitle>
        <p className="text-muted-foreground">{problem.description}</p>
        <Badge variant="outline" className="w-fit">
          Tipo: {problem.type}
        </Badge>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Instruções */}
        <div className="bg-gradient-subtle p-4 rounded-lg">
          <h3 className="font-semibold mb-2 text-foreground">Como construir:</h3>
          <p className="text-sm text-muted-foreground">{getTypeInstruction()}</p>
        </div>

        {/* Canvas para desenhar as barras */}
        <div className="border rounded-lg bg-white">
          <canvas
            ref={canvasRef}
            width={600}
            height={400}
            className="w-full max-w-full"
          />
        </div>

        {/* Controles para adicionar segmentos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/30 rounded-lg">
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">
              Valor do Segmento
            </label>
            <Input
              type="number"
              value={segmentValue}
              onChange={(e) => setSegmentValue(e.target.value)}
              placeholder="Ex: 27"
              min="1"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">
              Rótulo
            </label>
            <Input
              value={segmentLabel}
              onChange={(e) => setSegmentLabel(e.target.value)}
              placeholder="Ex: Figurinhas de Pedro"
            />
          </div>
          
          <div className="flex items-end gap-2">
            <Button onClick={addSegment} size="sm" className="flex items-center gap-1">
              <Plus className="w-4 h-4" />
              Adicionar
            </Button>
            <Button onClick={removeLastSegment} variant="outline" size="sm">
              <Minus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Barra atual em construção */}
        {currentBar.length > 0 && (
          <div className="flex items-center gap-2 p-3 bg-primary/10 rounded-lg">
            <span className="text-sm font-medium">Barra atual:</span>
            {currentBar.map((segment, index) => (
              <Badge key={segment.id} variant="secondary">
                {segment.label}: {segment.value}
              </Badge>
            ))}
            <Button onClick={finishBar} size="sm" variant="outline">
              Finalizar Barra
            </Button>
          </div>
        )}

        {/* Controles principais */}
        <div className="flex gap-3 items-center">
          <Button onClick={checkModel} className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            Verificar Modelo
          </Button>
          
          <Button onClick={reset} variant="outline" size="sm">
            <RotateCcw className="w-4 h-4" />
            Recomeçar
          </Button>
          
          {result !== null && (
            <Badge variant={Math.abs(result - problem.expectedResult) <= 1 ? "default" : "destructive"}>
              Total: {result}
            </Badge>
          )}
        </div>

        {/* Feedback */}
        {showFeedback && (
          <div className={`p-4 rounded-lg border ${
            Math.abs(result! - problem.expectedResult) <= 1
              ? 'bg-green-50 border-green-200 text-green-800' 
              : 'bg-red-50 border-red-200 text-red-800'
          }`}>
            {Math.abs(result! - problem.expectedResult) <= 1 ? (
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-semibold">Excelente modelo de barras!</p>
                  <p className="text-sm">Você representou o problema visualmente de forma correta.</p>
                </div>
              </div>
            ) : (
              <div>
                <p className="font-semibold">O modelo precisa de ajustes.</p>
                <p className="text-sm">
                  Verifique se as proporções e valores estão corretos. 
                  Resultado esperado: {problem.expectedResult}
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};