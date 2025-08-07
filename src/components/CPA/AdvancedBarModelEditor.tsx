import { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { 
  CheckCircle, 
  RotateCcw, 
  Square, 
  Type, 
  Minus as Line, 
  MousePointer, 
  Eraser,
  Lightbulb,
  Eye,
  Ruler,
  Grid3X3,
  Palette,
  GitBranch
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface DrawingElement {
  id: string;
  type: 'rectangle' | 'text' | 'line';
  x: number;
  y: number;
  width?: number;
  height?: number;
  endX?: number;
  endY?: number;
  text?: string;
  color: string;
  value?: number;
  selected?: boolean;
}

interface BarModelEditorProps {
  problem: {
    description: string;
    expectedResult: number;
    type: 'addition' | 'subtraction' | 'comparison' | 'part-whole';
    hints?: string[];
  };
  onComplete: (success: boolean) => void;
}

export const AdvancedBarModelEditor = ({ problem, onComplete }: BarModelEditorProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [elements, setElements] = useState<DrawingElement[]>([]);
  const [selectedTool, setSelectedTool] = useState<'select' | 'rectangle' | 'line' | 'eraser' | 'divide'>('rectangle');
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [currentColor, setCurrentColor] = useState('#6B8E5A');
  const [showGrid, setShowGrid] = useState(true);
  const [showRulers, setShowRulers] = useState(true);
  const [showHints, setShowHints] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [textPosition, setTextPosition] = useState<{ x: number; y: number } | null>(null);
  const [result, setResult] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [divisionsInput, setDivisionsInput] = useState('2');
  const [showDivisionPanel, setShowDivisionPanel] = useState(false);

  const CANVAS_WIDTH = 630; // 700 * 0.9
  const CANVAS_HEIGHT = 450; // 500 * 0.9
  const GRID_SIZE = 18; // 20 * 0.9
  const RULER_SIZE = 27; // 30 * 0.9

  const colors = [
    '#6B8E5A', // Verde conhecido
    '#4A90E2', // Azul incógnita
    '#E94B4B', // Vermelho total
    '#F5A623', // Laranja parte
    '#7B68EE', // Roxo comparação
    '#50C878', // Verde claro
    '#FF6B6B'  // Coral
  ];

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Limpar canvas
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Desenhar grid de fundo
    if (showGrid) {
      ctx.strokeStyle = '#E5E5E5';
      ctx.lineWidth = 0.5;
      for (let x = RULER_SIZE; x <= CANVAS_WIDTH; x += GRID_SIZE) {
        ctx.beginPath();
        ctx.moveTo(x, RULER_SIZE);
        ctx.lineTo(x, CANVAS_HEIGHT);
        ctx.stroke();
      }
      for (let y = RULER_SIZE; y <= CANVAS_HEIGHT; y += GRID_SIZE) {
        ctx.beginPath();
        ctx.moveTo(RULER_SIZE, y);
        ctx.lineTo(CANVAS_WIDTH, y);
        ctx.stroke();
      }
    }

    // Desenhar réguas
    if (showRulers) {
      // Régua horizontal (topo)
      ctx.fillStyle = '#F8F9FA';
      ctx.fillRect(0, 0, CANVAS_WIDTH, RULER_SIZE);
      ctx.strokeStyle = '#DEE2E6';
      ctx.lineWidth = 1;
      ctx.strokeRect(0, 0, CANVAS_WIDTH, RULER_SIZE);

      // Régua vertical (esquerda)
      ctx.fillStyle = '#F8F9FA';
      ctx.fillRect(0, 0, RULER_SIZE, CANVAS_HEIGHT);
      ctx.strokeRect(0, 0, RULER_SIZE, CANVAS_HEIGHT);

      // Marcações da régua
      ctx.fillStyle = '#6C757D';
      ctx.font = '9px Arial'; // 10 * 0.9
      ctx.textAlign = 'center';
      
      for (let x = RULER_SIZE; x <= CANVAS_WIDTH; x += GRID_SIZE) {
        const unit = (x - RULER_SIZE) / GRID_SIZE;
        if (unit % 5 === 0) {
          ctx.fillText(unit.toString(), x, 20);
          ctx.beginPath();
          ctx.moveTo(x, RULER_SIZE - 5);
          ctx.lineTo(x, RULER_SIZE);
          ctx.stroke();
        }
      }

      ctx.textAlign = 'center';
      ctx.save();
      ctx.translate(15, RULER_SIZE);
      ctx.rotate(-Math.PI / 2);
      for (let y = 0; y <= CANVAS_HEIGHT - RULER_SIZE; y += GRID_SIZE) {
        const unit = y / GRID_SIZE;
        if (unit % 5 === 0) {
          ctx.fillText(unit.toString(), -y, 0);
        }
      }
      ctx.restore();
    }

    // Área de desenho
    ctx.strokeStyle = '#CED4DA';
    ctx.lineWidth = 2;
    ctx.strokeRect(RULER_SIZE, RULER_SIZE, CANVAS_WIDTH - RULER_SIZE, CANVAS_HEIGHT - RULER_SIZE);

    // Desenhar elementos
    elements.forEach(element => {
      ctx.save();
      
      if (element.selected) {
        ctx.shadowColor = '#4A90E2';
        ctx.shadowBlur = 8;
      }

      switch (element.type) {
        case 'rectangle':
          ctx.fillStyle = element.color;
          ctx.strokeStyle = '#333';
          ctx.lineWidth = 2;
          ctx.fillRect(element.x, element.y, element.width || 0, element.height || 0);
          ctx.strokeRect(element.x, element.y, element.width || 0, element.height || 0);
          
          // Mostrar valor se houver
          if (element.value) {
            ctx.fillStyle = '#FFFFFF';
            ctx.font = 'bold 16px Arial'; // 18 * 0.9
            ctx.textAlign = 'center';
            ctx.fillText(
              element.value.toString(),
              element.x + (element.width || 0) / 2,
              element.y + (element.height || 0) / 2 + 5
            );
          }
          break;

        case 'text':
          ctx.fillStyle = element.color;
          ctx.font = 'bold 14px Arial'; // 16 * 0.9
          ctx.textAlign = 'left';
          ctx.fillText(element.text || '', element.x, element.y);
          break;

        case 'line':
          ctx.strokeStyle = element.color;
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(element.x, element.y);
          ctx.lineTo(element.endX || element.x, element.endY || element.y);
          ctx.stroke();
          break;
      }

      // Mostrar handles de seleção
      if (element.selected && selectedTool === 'select') {
        ctx.fillStyle = '#4A90E2';
        ctx.fillRect(element.x - 4, element.y - 4, 8, 8);
        if (element.width && element.height) {
          ctx.fillRect(element.x + element.width - 4, element.y - 4, 8, 8);
          ctx.fillRect(element.x - 4, element.y + element.height - 4, 8, 8);
          ctx.fillRect(element.x + element.width - 4, element.y + element.height - 4, 8, 8);
        }
      }

      ctx.restore();
    });

    // Preview do elemento sendo desenhado
    if (isDrawing && selectedTool === 'rectangle') {
      ctx.strokeStyle = currentColor;
      ctx.globalAlpha = 0.6;
      ctx.fillStyle = currentColor;
      ctx.lineWidth = 2;
      const width = Math.abs(startPos.x - startPos.x);
      const height = Math.abs(startPos.y - startPos.y);
      ctx.fillRect(startPos.x, startPos.y, width, height);
      ctx.strokeRect(startPos.x, startPos.y, width, height);
      ctx.globalAlpha = 1;
    }

  }, [elements, showGrid, showRulers, selectedElement, selectedTool, isDrawing, startPos, currentColor]);

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  const snapToGrid = (value: number) => {
    return Math.round(value / GRID_SIZE) * GRID_SIZE;
  };

  const getCanvasCoordinates = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    return {
      x: snapToGrid((e.clientX - rect.left) * scaleX),
      y: snapToGrid((e.clientY - rect.top) * scaleY)
    };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const coords = getCanvasCoordinates(e);
    
    // Verificar se está na área de desenho
    if (coords.x < RULER_SIZE || coords.y < RULER_SIZE) return;

    setStartPos(coords);

    if (selectedTool === 'select') {
      // Selecionar elemento
      const clickedElement = elements.find(el => {
        if (el.type === 'rectangle') {
          return coords.x >= el.x && coords.x <= el.x + (el.width || 0) &&
                 coords.y >= el.y && coords.y <= el.y + (el.height || 0);
        }
        return false;
      });

      setElements(prev => prev.map(el => ({ ...el, selected: el.id === clickedElement?.id })));
      setSelectedElement(clickedElement?.id || null);
      
      // Mostrar painel de divisão se retângulo selecionado
      if (clickedElement?.type === 'rectangle') {
        setShowDivisionPanel(true);
      } else {
        setShowDivisionPanel(false);
      }
    } else if (selectedTool === 'divide') {
      // Ferramenta de divisão - selecionar barra para dividir
      const clickedBar = elements.find(el => {
        if (el.type === 'rectangle') {
          return coords.x >= el.x && coords.x <= el.x + (el.width || 0) &&
                 coords.y >= el.y && coords.y <= el.y + (el.height || 0);
        }
        return false;
      });

      if (clickedBar) {
        setElements(prev => prev.map(el => ({ ...el, selected: el.id === clickedBar.id })));
        setSelectedElement(clickedBar.id);
        setShowDivisionPanel(true);
      }
    } else if (selectedTool === 'eraser') {
      // Apagar elemento
      setElements(prev => prev.filter(el => {
        if (el.type === 'rectangle') {
          return !(coords.x >= el.x && coords.x <= el.x + (el.width || 0) &&
                  coords.y >= el.y && coords.y <= el.y + (el.height || 0));
        }
        return true;
      }));
    } else {
      setIsDrawing(true);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const coords = getCanvasCoordinates(e);
    
    if (selectedTool === 'rectangle') {
      // Atualizar preview
      setStartPos(prev => ({ ...prev }));
    }
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    
    const coords = getCanvasCoordinates(e);
    
    if (selectedTool === 'rectangle') {
      const width = Math.abs(coords.x - startPos.x);
      const height = Math.abs(coords.y - startPos.y);
      
      if (width > 10 && height > 10) {
        const newElement: DrawingElement = {
          id: `rect-${Date.now()}`,
          type: 'rectangle',
          x: Math.min(startPos.x, coords.x),
          y: Math.min(startPos.y, coords.y),
          width,
          height,
          color: currentColor
        };
        setElements(prev => [...prev, newElement]);
      }
    } else if (selectedTool === 'line') {
      const newElement: DrawingElement = {
        id: `line-${Date.now()}`,
        type: 'line',
        x: startPos.x,
        y: startPos.y,
        endX: coords.x,
        endY: coords.y,
        color: currentColor
      };
      setElements(prev => [...prev, newElement]);
    }
    
    setIsDrawing(false);
  };

  const addText = () => {
    if (!textPosition || !textInput.trim()) return;

    const newElement: DrawingElement = {
      id: `text-${Date.now()}`,
      type: 'text',
      x: textPosition.x,
      y: textPosition.y,
      text: textInput,
      color: currentColor
    };

    setElements(prev => [...prev, newElement]);
    setTextInput('');
    setTextPosition(null);
  };

  const addValue = (value: number) => {
    if (!selectedElement) return;

    setElements(prev => prev.map(el => 
      el.id === selectedElement ? { ...el, value } : el
    ));
  };

  const createPreConfiguredModel = () => {
    const baseY = RULER_SIZE + 54; // 60 * 0.9
    const segmentWidth = 72; // 80 * 0.9
    const segmentHeight = 45; // 50 * 0.9

    const preConfigured: DrawingElement[] = [
      // Barra total
      {
        id: 'total-bar',
        type: 'rectangle',
        x: RULER_SIZE + 36, // 40 * 0.9
        y: baseY,
        width: segmentWidth * 4,
        height: segmentHeight,
        color: '#E94B4B',
        value: 24
      },
      // Divisões
      {
        id: 'div1',
        type: 'line',
        x: RULER_SIZE + 40 + segmentWidth,
        y: baseY,
        endX: RULER_SIZE + 40 + segmentWidth,
        endY: baseY + segmentHeight,
        color: '#333'
      },
      {
        id: 'div2',
        type: 'line',
        x: RULER_SIZE + 40 + segmentWidth * 2,
        y: baseY,
        endX: RULER_SIZE + 40 + segmentWidth * 2,
        endY: baseY + segmentHeight,
        color: '#333'
      },
      {
        id: 'div3',
        type: 'line',
        x: RULER_SIZE + 40 + segmentWidth * 3,
        y: baseY,
        endX: RULER_SIZE + 40 + segmentWidth * 3,
        endY: baseY + segmentHeight,
        color: '#333'
      },
      // Labels
      {
        id: 'label1',
        type: 'text',
        x: RULER_SIZE + 40 + segmentWidth / 2 - 10,
        y: baseY + segmentHeight + 20,
        text: '6 alunos',
        color: '#333'
      },
      {
        id: 'label2',
        type: 'text',
        x: RULER_SIZE + 40 + segmentWidth * 1.5 - 10,
        y: baseY + segmentHeight + 20,
        text: '6 alunos',
        color: '#333'
      },
      {
        id: 'label3',
        type: 'text',
        x: RULER_SIZE + 40 + segmentWidth * 2.5 - 10,
        y: baseY + segmentHeight + 20,
        text: '6 alunos',
        color: '#333'
      },
      {
        id: 'label4',
        type: 'text',
        x: RULER_SIZE + 40 + segmentWidth * 3.5 - 10,
        y: baseY + segmentHeight + 20,
        text: '6 alunos',
        color: '#333'
      }
    ];

    setElements(preConfigured);
  };

  const validateModel = () => {
    const rectangles = elements.filter(el => el.type === 'rectangle');
    const totalValue = rectangles.reduce((sum, rect) => sum + (rect.value || 0), 0);
    
    setResult(totalValue);
    const isCorrect = Math.abs(totalValue - problem.expectedResult) <= 1;
    setShowFeedback(true);
    
    if (isCorrect) {
      setTimeout(() => onComplete(true), 2000);
    }
  };

  const divideSelectedBar = () => {
    if (!selectedElement) return;
    
    const selectedBar = elements.find(el => el.id === selectedElement && el.type === 'rectangle');
    if (!selectedBar) return;
    
    const divisions = parseInt(divisionsInput);
    
    if (divisions < 2 || divisions > 10 || isNaN(divisions)) {
      return;
    }

    const segmentWidth = (selectedBar.width || 0) / divisions;
    const newElements: DrawingElement[] = [];

    // Criar novos retângulos para cada seção
    for (let i = 0; i < divisions; i++) {
      const sectionX = selectedBar.x + (segmentWidth * i);
      
      newElements.push({
        id: `section-${selectedBar.id}-${i}-${Date.now()}`,
        type: 'rectangle',
        x: sectionX,
        y: selectedBar.y,
        width: segmentWidth,
        height: selectedBar.height,
        color: selectedBar.color
      });
    }

    // Remover o retângulo original e adicionar as seções
    setElements(prev => [
      ...prev.filter(el => el.id !== selectedBar.id),
      ...newElements
    ]);
    
    setShowDivisionPanel(false);
    setSelectedElement(null);
  };

  const quickDivide = (divisions: number) => {
    setDivisionsInput(divisions.toString());
    setTimeout(() => divideSelectedBar(), 100);
  };

  const reset = () => {
    setElements([]);
    setSelectedElement(null);
    setResult(null);
    setShowFeedback(false);
    setTextPosition(null);
    setTextInput('');
    setShowDivisionPanel(false);
  };

  const getStepInstructions = () => {
    return [
      "1. Desenhe uma barra para representar o total",
      "2. Use a ferramenta 'Dividir' para dividir barras em partes iguais",
      "3. Adicione valores conhecidos em cada parte",
      "4. Identifique a incógnita (parte em azul)"
    ];
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">🎨</span>
            Editor de Modelo de Barras - Estágio Pictórico Avançado
          </CardTitle>
          <p className="text-muted-foreground">{problem.description}</p>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Ferramentas laterais */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Ferramentas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Seleção de ferramenta */}
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'select', icon: MousePointer, label: 'Selecionar' },
                { id: 'rectangle', icon: Square, label: 'Retângulo' },
                { id: 'divide', icon: GitBranch, label: 'Dividir' },
                { id: 'line', icon: Line, label: 'Linha' },
                { id: 'eraser', icon: Eraser, label: 'Borracha' }
              ].map(tool => (
                <Button
                  key={tool.id}
                  variant={selectedTool === tool.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedTool(tool.id as any)}
                  className="flex flex-col gap-1 h-11" // 12 * 0.9
                >
                  <tool.icon className="w-3.5 h-3.5" /> {/* 4 * 0.9 */}
                  <span className="text-xs">{tool.label}</span>
                </Button>
              ))}
            </div>

            <Separator />

            {/* Painel de Divisão quando barra selecionada */}
            {showDivisionPanel && selectedElement && (
              <div className="space-y-3 p-3 bg-muted/50 rounded-lg border">
                <h4 className="font-medium text-sm">Dividir Barra Selecionada</h4>
                
                {/* Divisão Personalizada */}
                <div className="space-y-2">
                  <label className="text-xs text-muted-foreground">Divisões personalizadas:</label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      min="2"
                      max="10"
                      value={divisionsInput}
                      onChange={(e) => setDivisionsInput(e.target.value)}
                      className="h-8 text-xs"
                      placeholder="2-10"
                    />
                    <Button
                      onClick={divideSelectedBar}
                      size="sm"
                      className="h-8 text-xs"
                    >
                      Dividir
                    </Button>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowDivisionPanel(false)}
                  className="w-full h-8 text-xs"
                >
                  Fechar
                </Button>
              </div>
            )}

            <Separator />

            {/* Paleta de cores */}
            <div>
              <label className="text-sm font-medium mb-2 block">Cores</label>
              <div className="grid grid-cols-3 gap-2">
                {colors.map(color => (
                  <button
                    key={color}
                    className={`w-8 h-8 rounded border-2 ${currentColor === color ? 'border-primary' : 'border-gray-200'}`}
                    style={{ backgroundColor: color }}
                    onClick={() => setCurrentColor(color)}
                  />
                ))}
              </div>
              <div className="mt-2 text-xs text-muted-foreground space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded" style={{ backgroundColor: '#6B8E5A' }}></div>
                  <span>Verde: Valores conhecidos</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded" style={{ backgroundColor: '#4A90E2' }}></div>
                  <span>Azul: Incógnitas</span>
                </div>
              </div>
            </div>

            <Separator />

            {/* Controles de visualização */}
            <div className="space-y-2">
              <Button
                variant={showGrid ? "default" : "outline"}
                size="sm"
                onClick={() => setShowGrid(!showGrid)}
                className="w-full justify-start"
              >
                <Grid3X3 className="w-3.5 h-3.5 mr-2" /> {/* 4 * 0.9 */}
                Grid
              </Button>
              <Button
                variant={showRulers ? "default" : "outline"}
                size="sm"
                onClick={() => setShowRulers(!showRulers)}
                className="w-full justify-start"
              >
                <Ruler className="w-3.5 h-3.5 mr-2" /> {/* 4 * 0.9 */}
                Réguas
              </Button>
            </div>

            <Separator />

            {/* Adicionar valor a elemento selecionado */}
            {selectedElement && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Adicionar valor</label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Valor"
                    onBlur={(e) => {
                      const value = parseInt(e.target.value);
                      if (!isNaN(value)) {
                        addValue(value);
                        e.target.value = '';
                      }
                    }}
                  />
                </div>
              </div>
            )}

            {/* Pré-configurado */}
            <Button
              onClick={createPreConfiguredModel}
              variant="outline"
              size="sm"
              className="w-full"
            >
              <Eye className="w-3.5 h-3.5 mr-2" /> {/* 4 * 0.9 */}
              Exemplo Visual
            </Button>
          </CardContent>
        </Card>

        {/* Canvas principal */}
        <Card className="lg:col-span-2">
          <CardContent className="p-4">
            <div className="border rounded-lg overflow-hidden bg-white">
              <canvas
                ref={canvasRef}
                width={CANVAS_WIDTH}
                height={CANVAS_HEIGHT}
                className="w-full cursor-crosshair"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                style={{ maxWidth: '100%', height: 'auto' }}
              />
            </div>

            {/* Input de texto flutuante */}
            <AnimatePresence>
              {textPosition && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="absolute bg-white border rounded-lg p-2 shadow-lg"
                  style={{
                    left: `${textPosition.x}px`,
                    top: `${textPosition.y - 50}px`
                  }}
                >
                  <div className="flex gap-2">
                    <Input
                      value={textInput}
                      onChange={(e) => setTextInput(e.target.value)}
                      placeholder="Digite o texto..."
                       className="text-sm"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') addText();
                        if (e.key === 'Escape') setTextPosition(null);
                      }}
                    />
                    <Button size="sm" onClick={addText}>OK</Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Controles do canvas */}
            <div className="flex gap-2 mt-4">
              <Button onClick={validateModel} className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5" /> {/* 4 * 0.9 */}
                Verificar Modelo
              </Button>
              <Button onClick={reset} variant="outline">
                <RotateCcw className="w-3.5 h-3.5" /> {/* 4 * 0.9 */}
                Limpar
              </Button>
              {result !== null && (
                <Badge variant={Math.abs(result - problem.expectedResult) <= 1 ? "default" : "destructive"}>
                  Total: {result}
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Instruções */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Lightbulb className="w-4.5 h-4.5" /> {/* 5 * 0.9 */}
              Instruções
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              {getStepInstructions().map((step, index) => (
                <div key={index} className="text-sm text-muted-foreground">
                  {step}
                </div>
              ))}
            </div>

            {problem.hints && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowHints(!showHints)}
                className="w-full"
              >
                <Lightbulb className="w-3.5 h-3.5 mr-2" /> {/* 4 * 0.9 */}
                {showHints ? 'Ocultar' : 'Mostrar'} Dicas
              </Button>
            )}

            <AnimatePresence>
              {showHints && problem.hints && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2"
                >
                  {problem.hints.map((hint, index) => (
                    <div key={index} className="text-sm p-2 bg-yellow-50 border border-yellow-200 rounded">
                      💡 {hint}
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </div>

      {/* Feedback */}
      <AnimatePresence>
        {showFeedback && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className={`${
              Math.abs(result! - problem.expectedResult) <= 1
                ? 'border-green-200 bg-green-50' 
                : 'border-red-200 bg-red-50'
            }`}>
              <CardContent className="p-4">
                {Math.abs(result! - problem.expectedResult) <= 1 ? (
                  <div className="flex items-center gap-2 text-green-800">
                    <CheckCircle className="w-4.5 h-4.5" /> {/* 5 * 0.9 */}
                    <div>
                      <p className="font-semibold">Excelente modelo de barras!</p>
                      <p className="text-sm">Você representou o problema visualmente de forma correta.</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-red-800">
                    <p className="font-semibold">O modelo precisa de ajustes.</p>
                    <p className="text-sm">
                      Verifique se as proporções e valores estão corretos. 
                      Resultado esperado: {problem.expectedResult}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};