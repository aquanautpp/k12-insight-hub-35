import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { RotateCcw, CheckCircle, Calculator, Timer, MousePointer, Target, Sparkles, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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

export const EnhancedVirtualTenBlocks = ({ problem, onComplete }: VirtualTenBlocksProps) => {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [workArea, setWorkArea] = useState<Block[]>([]);
  const [dragging, setDragging] = useState<string | null>(null);
  const [dragPreview, setDragPreview] = useState<{ x: number; y: number; block: Block } | null>(null);
  const [result, setResult] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [movements, setMovements] = useState(0);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [bestTime, setBestTime] = useState<number | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [shakeWrongBlocks, setShakeWrongBlocks] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [workAreaHover, setWorkAreaHover] = useState(false);
  
  const timerRef = useRef<NodeJS.Timeout>();
  const workAreaRef = useRef<HTMLDivElement>(null);

  // Timer
  useEffect(() => {
    if (startTime && !showFeedback) {
      timerRef.current = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime.getTime()) / 1000));
      }, 1000);
    }
    
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [startTime, showFeedback]);

  // Gerar blocos iniciais
  useEffect(() => {
    const generateBlocks = (value: number, startX: number) => {
      const hundreds = Math.floor(value / 100);
      const tens = Math.floor((value % 100) / 10);
      const units = value % 10;
      
      const blockList: Block[] = [];
      let currentY = 20;
      
      // Blocos de centena
      for (let i = 0; i < hundreds; i++) {
        blockList.push({
          id: `h${startX}-${i}`,
          value: 100,
          type: 'hundred',
          x: startX,
          y: currentY + i * 80
        });
      }
      
      // Blocos de dezena
      currentY += hundreds * 80 + 20;
      for (let i = 0; i < tens; i++) {
        blockList.push({
          id: `t${startX}-${i}`,
          value: 10,
          type: 'ten',
          x: startX,
          y: currentY + i * 50
        });
      }
      
      // Blocos de unidade
      currentY += tens * 50 + 20;
      for (let i = 0; i < units; i++) {
        blockList.push({
          id: `u${startX}-${i}`,
          value: 1,
          type: 'unit',
          x: startX + (i % 6) * 30,
          y: currentY + Math.floor(i / 6) * 30
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
    setAttempts(0);
    setMovements(0);
    setStartTime(new Date());
    setElapsedTime(0);
    setShowHint(false);
    setShowConfetti(false);
  }, [problem]);

  const organizeWorkAreaBlocks = (newBlocks: Block[]) => {
    const sortedBlocks = [...newBlocks].sort((a, b) => {
      if (a.type === b.type) return 0;
      if (a.type === 'hundred') return -1;
      if (b.type === 'hundred') return 1;
      if (a.type === 'ten') return -1;
      if (b.type === 'ten') return 1;
      return 0;
    });

    let currentX = 20;
    const baseY = 60;
    
    return sortedBlocks.map(block => {
      const blockWidth = block.type === 'hundred' ? 80 : block.type === 'ten' ? 80 : 40;
      const newBlock = { ...block, x: currentX, y: baseY };
      currentX += blockWidth + 15;
      return newBlock;
    });
  };

  const handleDragStart = (blockId: string, e: React.DragEvent) => {
    setDragging(blockId);
    setMovements(prev => prev + 1);
    
    const block = blocks.find(b => b.id === blockId) || workArea.find(b => b.id === blockId);
    if (block) {
      e.dataTransfer.setData('text/plain', blockId);
      e.dataTransfer.effectAllowed = 'move';
      
      // Mudar cursor para grabbing
      document.body.style.cursor = 'grabbing';
    }
  };

  const handleDragOver = (e: React.DragEvent, area: 'work' | 'blocks') => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    
    if (area === 'work') {
      setWorkAreaHover(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent, area: 'work' | 'blocks') => {
    if (area === 'work') {
      setWorkAreaHover(false);
    }
  };

  const handleDrop = (e: React.DragEvent, area: 'work' | 'blocks') => {
    e.preventDefault();
    setDragPreview(null);
    setWorkAreaHover(false);
    
    // Restaurar cursor
    document.body.style.cursor = 'default';
    
    const blockId = e.dataTransfer.getData('text/plain');
    if (!blockId) return;

    const draggedBlock = blocks.find(b => b.id === blockId) || 
                         workArea.find(b => b.id === blockId);
    
    if (!draggedBlock) return;

    if (area === 'work') {
      // Adicionar à área de trabalho e reorganizar
      const newWorkArea = [...workArea.filter(b => b.id !== blockId), draggedBlock];
      const organizedBlocks = organizeWorkAreaBlocks(newWorkArea);
      
      setWorkArea(organizedBlocks);
      setBlocks(prev => prev.filter(b => b.id !== blockId));
    } else {
      // Voltar para área de blocos
      setBlocks(prev => [...prev.filter(b => b.id !== blockId), draggedBlock]);
      const newWorkArea = workArea.filter(b => b.id !== blockId);
      setWorkArea(organizeWorkAreaBlocks(newWorkArea));
    }
    
    setDragging(null);
  };

  const calculateResult = () => {
    const total = workArea.reduce((sum, block) => sum + block.value, 0);
    setResult(total);
    setAttempts(prev => prev + 1);
    
    const isCorrect = total === problem.expectedResult;
    setShowFeedback(true);
    
    if (isCorrect) {
      setShowConfetti(true);
      if (timerRef.current) clearInterval(timerRef.current);
      
      // Salvar melhor tempo
      const currentTime = elapsedTime;
      const storedBest = localStorage.getItem('best-time-blocks');
      if (!storedBest || currentTime < parseInt(storedBest)) {
        setBestTime(currentTime);
        localStorage.setItem('best-time-blocks', currentTime.toString());
      }
      
      setTimeout(() => {
        setShowConfetti(false);
        onComplete(true);
      }, 3000);
    } else {
      setShakeWrongBlocks(true);
      setTimeout(() => setShakeWrongBlocks(false), 600);
      
      if (attempts >= 2) {
        setShowHint(true);
      }
    }
  };

  const reset = () => {
    setBlocks([]);
    setWorkArea([]);
    setResult(null);
    setShowFeedback(false);
    setAttempts(0);
    setMovements(0);
    setStartTime(new Date());
    setElapsedTime(0);
    setShowHint(false);
    setShowConfetti(false);
    setDragPreview(null);
    
    // Recarregar problema
    window.location.reload();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getBlockStyle = (block: Block, isPreview = false, isDragging = false) => {
    const baseClasses = `absolute flex items-center justify-center font-bold select-none transition-all duration-200 text-white border-2 ${
      isPreview ? 'opacity-50 pointer-events-none' : ''
    } ${isDragging ? 'opacity-30' : 'cursor-grab hover:cursor-grab'}  ${
      shakeWrongBlocks && !isPreview ? 'animate-[shake_0.6s_ease-in-out]' : ''
    }`;

    const hoverClasses = isPreview || isDragging ? '' : 'hover:scale-105';
    const greenColor = 'bg-[#6B8E5A] border-[#6B8E5A]';
    const shadowClass = isDragging ? 'shadow-lg' : 'shadow-sm';

    switch (block.type) {
      case 'hundred':
        return {
          className: `${baseClasses} ${hoverClasses} ${greenColor} ${shadowClass} w-20 h-20 text-lg rounded`,
          transform: `translate(${block.x}px, ${block.y}px)`
        };
      case 'ten':
        return {
          className: `${baseClasses} ${hoverClasses} ${greenColor} ${shadowClass} w-20 h-10 text-sm rounded`,
          transform: `translate(${block.x}px, ${block.y}px)`
        };
      case 'unit':
        return {
          className: `${baseClasses} ${hoverClasses} ${greenColor} ${shadowClass} w-10 h-10 text-xs rounded`,
          transform: `translate(${block.x}px, ${block.y}px)`
        };
    }
  };

  const workAreaHasBlocks = workArea.length > 0;
  const efficiency = movements > 0 ? Math.max(0, 100 - (movements - workArea.length) * 10) : 100;

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Header com Estatísticas */}
      <Card className="shadow-learning">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-xl">
                <span className="text-3xl">🧱</span>
                Blocos Base 10 - Estágio Concreto Interativo
              </CardTitle>
              <p className="text-muted-foreground mt-2">{problem.description}</p>
            </div>
            
            {/* Estatísticas */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-gray-600" />
                  <span className="text-xs font-medium text-gray-600">Tempo</span>
                </div>
                <div className="text-xl font-bold text-gray-900">{formatTime(elapsedTime)}</div>
                {bestTime && (
                  <div className="text-xs text-gray-500 mt-1">Melhor: {formatTime(bestTime)}</div>
                )}
              </div>
              
              <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Target className="w-4 h-4 text-gray-600" />
                  <span className="text-xs font-medium text-gray-600">Movimentos</span>
                </div>
                <div className="text-xl font-bold text-gray-900">{movements}</div>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <RotateCcw className="w-4 h-4 text-gray-600" />
                  <span className="text-xs font-medium text-gray-600">Tentativas</span>
                </div>
                <div className="text-xl font-bold text-gray-900">{attempts}</div>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-gray-600" />
                  <span className="text-xs font-medium text-gray-600">Eficiência</span>
                </div>
                <div className="text-xl font-bold text-gray-900">{efficiency}%</div>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Área de Blocos Disponíveis */}
        <Card className="shadow-sm border-gray-200">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg text-gray-900 flex items-center gap-2">
              <span className="text-2xl">🧱</span>
              Blocos Disponíveis
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div 
              className="border-2 border-dashed border-gray-300 rounded-lg p-4 min-h-[250px] md:min-h-[300px] relative bg-gray-50/50 overflow-hidden"
              onDrop={(e) => handleDrop(e, 'blocks')}
              onDragOver={(e) => handleDragOver(e, 'blocks')}
              onDragLeave={(e) => handleDragLeave(e, 'blocks')}
            >
              <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
              
              {blocks.map(block => {
                const isDraggingThis = dragging === block.id;
                const style = getBlockStyle(block, false, isDraggingThis);
                return (
                  <div
                    key={block.id}
                    className={style.className}
                    style={{ transform: style.transform }}
                    draggable
                    onDragStart={(e: any) => handleDragStart(block.id, e)}
                  >
                    {block.value === 100 ? '100' : block.value === 10 ? '10' : '1'}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Área de Trabalho */}
        <Card className="shadow-sm border-gray-200">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg text-gray-900 flex items-center gap-2">
              <span className="text-2xl">🎯</span>
              Área de Trabalho
            </CardTitle>
            <p className="text-sm text-gray-600">
              Arraste os blocos aqui para resolver o problema
            </p>
          </CardHeader>
          <CardContent className="p-4">
            <div 
              ref={workAreaRef}
              className={`border-2 border-dashed rounded-lg p-4 min-h-[250px] md:min-h-[300px] relative bg-white overflow-hidden transition-all duration-200 ${
                workAreaHover ? 'border-[#6B8E5A] bg-green-50/30' : 'border-gray-300'
              }`}
              onDrop={(e) => handleDrop(e, 'work')}
              onDragOver={(e) => handleDragOver(e, 'work')}
              onDragLeave={(e) => handleDragLeave(e, 'work')}
            >
              {/* Grid Pattern */}
              <div 
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: `
                    linear-gradient(to right, #6B8E5A 1px, transparent 1px),
                    linear-gradient(to bottom, #6B8E5A 1px, transparent 1px)
                  `,
                  backgroundSize: '20px 20px'
                }}
              ></div>
              
              {/* Blocos na área de trabalho */}
              {workArea.map(block => {
                const isDraggingThis = dragging === block.id;
                const style = getBlockStyle(block, false, isDraggingThis);
                return (
                  <motion.div
                    key={block.id}
                    className={style.className}
                    style={{ transform: style.transform }}
                    draggable
                    onDragStart={(e: any) => handleDragStart(block.id, e)}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    whileHover={{ y: -2 }}
                  >
                    {block.value === 100 ? '100' : block.value === 10 ? '10' : '1'}
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controles */}
      <Card className="shadow-sm border-gray-200">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-wrap gap-3 items-center">
              <Button 
                onClick={calculateResult} 
                disabled={!workAreaHasBlocks}
                className={`flex items-center gap-2 transition-all duration-300 bg-[#6B8E5A] hover:bg-[#5a7349] text-white ${
                  !workAreaHasBlocks ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                size="lg"
              >
                  <Calculator className="w-5 h-5" />
                  Calcular Resultado
                </Button>
              
              <Button 
                onClick={reset} 
                variant="outline" 
                size="lg"
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reiniciar
              </Button>
            </div>
            
            {result !== null && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Badge 
                  variant={result === problem.expectedResult ? "default" : "destructive"}
                  className={`text-base px-4 py-2 ${
                    result === problem.expectedResult 
                      ? 'bg-[#6B8E5A] hover:bg-[#5a7349]' 
                      : 'bg-red-500 hover:bg-red-600'
                  } text-white`}
                >
                  Resultado: {result}
                </Badge>
              </motion.div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Dica Visual */}
      <AnimatePresence>
        {showHint && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="border-amber-200 bg-amber-50/50">
              <CardContent className="p-4">
                <div className="flex items-start gap-3 text-amber-800">
                  <span className="text-2xl">💡</span>
                  <div>
                    <p className="font-semibold">Dica Visual</p>
                    <p className="text-sm">
                      Lembre-se: cada bloco pequeno verde vale 1, cada retângulo verde vale 10, 
                      e cada quadrado verde grande vale 100. Organize-os para chegar ao resultado {problem.expectedResult}!
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Feedback */}
      <AnimatePresence>
        {showFeedback && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <Card className={`border-2 ${
              result === problem.expectedResult 
                ? 'border-green-200 bg-green-50' 
                : 'border-red-200 bg-red-50'
            }`}>
              <CardContent className="p-6">
                {result === problem.expectedResult ? (
                  <div className="flex items-center gap-3">
                    <motion.div
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 1, ease: "easeInOut" }}
                    >
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    </motion.div>
                    <div>
                      <p className="font-bold text-green-800 text-lg">🎉 Incrível! Você conseguiu!</p>
                      <p className="text-green-700">
                        Tempo: {formatTime(elapsedTime)} | Movimentos: {movements} | Eficiência: {efficiency}%
                      </p>
                      <p className="text-sm text-green-600 mt-1">
                        Agora você está pronto para o estágio pictórico!
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">🤔</span>
                    <div>
                      <p className="font-bold text-red-800 text-lg">Quase lá! Vamos tentar novamente</p>
                      <p className="text-red-700">
                        O resultado esperado é {problem.expectedResult}. Você conseguiu {result}.
                      </p>
                      <p className="text-sm text-red-600 mt-1">
                        Dica: Verifique se todos os blocos necessários estão na área de trabalho.
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confetti Animation */}
      <AnimatePresence>
        {showConfetti && (
          <div className="fixed inset-0 pointer-events-none z-50">
            {[...Array(50)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full"
                style={{
                  background: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57'][Math.floor(Math.random() * 5)],
                  left: Math.random() * window.innerWidth,
                  top: -10
                }}
                initial={{ y: -10 }}
                animate={{ 
                  y: window.innerHeight + 10,
                  x: Math.random() * 200 - 100,
                  rotate: Math.random() * 360
                }}
                transition={{
                  duration: Math.random() * 2 + 2,
                  ease: "easeIn"
                }}
              />
            ))}
          </div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-3px); }
          20%, 40%, 60%, 80% { transform: translateX(3px); }
        }
        
        .bg-grid-pattern {
          background-image: 
            linear-gradient(to right, rgba(0,0,0,0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0,0,0,0.1) 1px, transparent 1px);
          background-size: 20px 20px;
        }
      `}</style>
    </div>
  );
};