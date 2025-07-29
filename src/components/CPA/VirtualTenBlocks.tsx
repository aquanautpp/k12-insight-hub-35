import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RotateCcw, CheckCircle, ArrowRight } from "lucide-react";

interface Block {
  id: string;
  value: number;
  type: 'unit' | 'ten' | 'hundred';
  x: number;
  y: number;
}

interface VirtualTenBlocksProps {
  problem: {
    description: string;
    initialValue1: number;
    initialValue2: number;
    expectedResult: number;
    operation: 'add' | 'subtract';
  };
  onComplete: (success: boolean) => void;
}

export const VirtualTenBlocks = ({ problem, onComplete }: VirtualTenBlocksProps) => {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [workArea, setWorkArea] = useState<Block[]>([]);
  const [dragging, setDragging] = useState<string | null>(null);
  const [result, setResult] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  // Gerar blocos iniciais baseados no problema
  useEffect(() => {
    const generateBlocks = (value: number, startX: number) => {
      const hundreds = Math.floor(value / 100);
      const tens = Math.floor((value % 100) / 10);
      const units = value % 10;
      
      const blockList: Block[] = [];
      let currentY = 50;
      
      // Blocos de centena
      for (let i = 0; i < hundreds; i++) {
        blockList.push({
          id: `h${startX}-${i}`,
          value: 100,
          type: 'hundred',
          x: startX,
          y: currentY + i * 60
        });
      }
      
      // Blocos de dezena
      currentY += hundreds * 60 + 20;
      for (let i = 0; i < tens; i++) {
        blockList.push({
          id: `t${startX}-${i}`,
          value: 10,
          type: 'ten',
          x: startX,
          y: currentY + i * 40
        });
      }
      
      // Blocos de unidade
      currentY += tens * 40 + 20;
      for (let i = 0; i < units; i++) {
        blockList.push({
          id: `u${startX}-${i}`,
          value: 1,
          type: 'unit',
          x: startX + (i % 5) * 25,
          y: currentY + Math.floor(i / 5) * 25
        });
      }
      
      return blockList;
    };

    const blocks1 = generateBlocks(problem.initialValue1, 50);
    const blocks2 = generateBlocks(problem.initialValue2, 300);
    
    setBlocks([...blocks1, ...blocks2]);
    setWorkArea([]);
    setResult(null);
    setShowFeedback(false);
  }, [problem]);

  const handleDragStart = (blockId: string) => {
    setDragging(blockId);
  };

  const handleDrop = (e: React.DragEvent, area: 'work' | 'blocks') => {
    e.preventDefault();
    if (!dragging) return;

    const draggedBlock = blocks.find(b => b.id === dragging) || 
                         workArea.find(b => b.id === dragging);
    
    if (!draggedBlock) return;

    if (area === 'work') {
      // Mover para área de trabalho
      const rect = e.currentTarget.getBoundingClientRect();
      const newX = e.clientX - rect.left;
      const newY = e.clientY - rect.top;
      
      const updatedBlock = { ...draggedBlock, x: newX, y: newY };
      
      setWorkArea(prev => [...prev.filter(b => b.id !== dragging), updatedBlock]);
      setBlocks(prev => prev.filter(b => b.id !== dragging));
    } else {
      // Voltar para área de blocos
      setBlocks(prev => [...prev.filter(b => b.id !== dragging), draggedBlock]);
      setWorkArea(prev => prev.filter(b => b.id !== dragging));
    }
    
    setDragging(null);
  };

  const calculateResult = () => {
    const total = workArea.reduce((sum, block) => sum + block.value, 0);
    setResult(total);
    
    const isCorrect = total === problem.expectedResult;
    setShowFeedback(true);
    
    if (isCorrect) {
      setTimeout(() => onComplete(true), 2000);
    }
  };

  const handleRegrouping = () => {
    // Lógica para reagrupamento automático
    const units = workArea.filter(b => b.type === 'unit');
    if (units.length >= 10) {
      const newTen: Block = {
        id: `grouped-ten-${Date.now()}`,
        value: 10,
        type: 'ten',
        x: 200,
        y: 100
      };
      
      const remainingUnits = units.slice(10);
      const otherBlocks = workArea.filter(b => b.type !== 'unit');
      
      setWorkArea([...otherBlocks, newTen, ...remainingUnits]);
    }
  };

  const reset = () => {
    setBlocks([]);
    setWorkArea([]);
    setResult(null);
    setShowFeedback(false);
    // Regenerar blocos iniciais
    const event = new CustomEvent('reset');
    window.dispatchEvent(event);
  };

  const getBlockStyle = (block: Block) => {
    const baseStyle = {
      position: 'absolute' as const,
      left: block.x,
      top: block.y,
      cursor: 'grab',
      borderRadius: '4px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 'bold',
      color: 'white',
      userSelect: 'none' as const
    };

    switch (block.type) {
      case 'hundred':
        return {
          ...baseStyle,
          width: '80px',
          height: '80px',
          backgroundColor: 'hsl(var(--primary))',
          fontSize: '14px'
        };
      case 'ten':
        return {
          ...baseStyle,
          width: '60px',
          height: '20px',
          backgroundColor: 'hsl(var(--secondary))',
          fontSize: '12px'
        };
      case 'unit':
        return {
          ...baseStyle,
          width: '20px',
          height: '20px',
          backgroundColor: 'hsl(var(--accent))',
          fontSize: '10px'
        };
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-2xl">🧱</span>
          Blocos Base 10 - Estágio Concreto
        </CardTitle>
        <p className="text-muted-foreground">{problem.description}</p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Área de Blocos Disponíveis */}
        <div className="border-2 border-dashed border-border rounded-lg p-4 min-h-[200px] relative bg-muted/30"
             onDrop={(e) => handleDrop(e, 'blocks')}
             onDragOver={(e) => e.preventDefault()}>
          <h3 className="font-semibold mb-2 text-foreground">Blocos Disponíveis</h3>
          {blocks.map(block => (
            <div
              key={block.id}
              style={getBlockStyle(block)}
              draggable
              onDragStart={() => handleDragStart(block.id)}
            >
              {block.value === 100 ? '100' : block.value === 10 ? '10' : '1'}
            </div>
          ))}
        </div>

        {/* Área de Trabalho */}
        <div className="border-2 border-primary/50 rounded-lg p-4 min-h-[300px] relative bg-gradient-subtle"
             onDrop={(e) => handleDrop(e, 'work')}
             onDragOver={(e) => e.preventDefault()}>
          <h3 className="font-semibold mb-2 text-foreground">Área de Trabalho</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Arraste os blocos para esta área e combine-os para resolver o problema
          </p>
          {workArea.map(block => (
            <div
              key={block.id}
              style={getBlockStyle(block)}
              draggable
              onDragStart={() => handleDragStart(block.id)}
            >
              {block.value === 100 ? '100' : block.value === 10 ? '10' : '1'}
            </div>
          ))}
        </div>

        {/* Controles */}
        <div className="flex gap-3 items-center">
          <Button onClick={calculateResult} className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            Calcular Resultado
          </Button>
          
          <Button onClick={handleRegrouping} variant="outline">
            Reagrupar (10 → 1 dezena)
          </Button>
          
          <Button onClick={reset} variant="outline" size="sm">
            <RotateCcw className="w-4 h-4" />
          </Button>
          
          {result !== null && (
            <Badge variant={result === problem.expectedResult ? "default" : "destructive"}>
              Resultado: {result}
            </Badge>
          )}
        </div>

        {/* Feedback */}
        {showFeedback && (
          <div className={`p-4 rounded-lg border ${
            result === problem.expectedResult 
              ? 'bg-green-50 border-green-200 text-green-800' 
              : 'bg-red-50 border-red-200 text-red-800'
          }`}>
            {result === problem.expectedResult ? (
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-semibold">Parabéns! Você acertou!</p>
                  <p className="text-sm">Agora você está pronto para o estágio pictórico.</p>
                </div>
              </div>
            ) : (
              <div>
                <p className="font-semibold">Ainda não está correto.</p>
                <p className="text-sm">
                  O resultado esperado é {problem.expectedResult}. 
                  Tente reagrupar os blocos ou revisar suas operações.
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};