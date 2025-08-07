import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { 
  CheckCircle, 
  RotateCcw, 
  ArrowLeft, 
  Plus,
  Minus,
  X,
  Divide,
  HelpCircle,
  Lightbulb,
  Delete,
  ParenthesesIcon as Parentheses,
  Calculator,
  Sparkles,
  Target,
  RefreshCw
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

interface EquationStep {
  id: string;
  equation: string;
  action: string;
  explanation: string;
  status: 'correct' | 'warning' | 'error' | 'pending';
  leftSide: string;
  rightSide: string;
}

interface EquationAction {
  id: string;
  label: string;
  action: (left: string, right: string, value?: string) => { left: string; right: string; explanation: string };
  needsValue?: boolean;
  icon: any;
}

interface InteractiveEquationEditorProps {
  problem: {
    description: string;
    equation: string;
    expectedResult: number | string;
    hints: string[];
  };
  onComplete: (success: boolean) => void;
  onReturnToPictorial: () => void;
}

export const InteractiveEquationEditor = ({ problem, onComplete, onReturnToPictorial }: InteractiveEquationEditorProps) => {
  const [currentEquation, setCurrentEquation] = useState(problem.equation);
  const [steps, setSteps] = useState<EquationStep[]>([]);
  const [currentLeft, setCurrentLeft] = useState('');
  const [currentRight, setCurrentRight] = useState('');
  const [showKeypad, setShowKeypad] = useState(true);
  const [inputValue, setInputValue] = useState('');
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [showHints, setShowHints] = useState(false);
  const [currentHintIndex, setCurrentHintIndex] = useState(0);
  const [finalAnswer, setFinalAnswer] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [animatingStep, setAnimatingStep] = useState<string | null>(null);

  // Inicializar equação
  useEffect(() => {
    const [left, right] = problem.equation.split('=').map(side => side.trim());
    setCurrentLeft(left);
    setCurrentRight(right);
    
    // Adicionar passo inicial
    const initialStep: EquationStep = {
      id: 'initial',
      equation: problem.equation,
      action: 'Equação inicial',
      explanation: 'Começamos com a equação dada',
      status: 'correct',
      leftSide: left,
      rightSide: right
    };
    setSteps([initialStep]);
  }, [problem.equation]);

  // Ações matemáticas disponíveis
  const actions: EquationAction[] = [
    {
      id: 'add',
      label: 'Somar',
      icon: Plus,
      needsValue: true,
      action: (left, right, value) => ({
        left: `${left} + ${value}`,
        right: `${right} + ${value}`,
        explanation: `Somamos ${value} em ambos os lados`
      })
    },
    {
      id: 'subtract',
      label: 'Subtrair',
      icon: Minus,
      needsValue: true,
      action: (left, right, value) => ({
        left: `${left} - ${value}`,
        right: `${right} - ${value}`,
        explanation: `Subtraímos ${value} de ambos os lados`
      })
    },
    {
      id: 'multiply',
      label: 'Multiplicar',
      icon: X,
      needsValue: true,
      action: (left, right, value) => ({
        left: `(${left}) \\times ${value}`,
        right: `(${right}) \\times ${value}`,
        explanation: `Multiplicamos ambos os lados por ${value}`
      })
    },
    {
      id: 'divide',
      label: 'Dividir',
      icon: Divide,
      needsValue: true,
      action: (left, right, value) => ({
        left: `\\frac{${left}}{${value}}`,
        right: `\\frac{${right}}{${value}}`,
        explanation: `Dividimos ambos os lados por ${value}`
      })
    },
    {
      id: 'simplify',
      label: 'Simplificar',
      icon: RefreshCw,
      needsValue: false,
      action: (left, right) => {
        const leftResult = advancedSimplifyExpression(left);
        const rightResult = advancedSimplifyExpression(right);
        
        // Verificar se houve mudança real em pelo menos um lado
        if (!leftResult.changed && !rightResult.changed) {
          return {
            left,
            right,
            explanation: 'Expressão já está simplificada'
          };
        }
        
        // Usar a explicação mais específica disponível
        const explanation = leftResult.changed ? leftResult.explanation : rightResult.explanation;
        
        return {
          left: leftResult.simplified,
          right: rightResult.simplified,
          explanation
        };
      }
    }
  ];

  // Teclado matemático
  const keypadButtons = [
    ['7', '8', '9', '÷'],
    ['4', '5', '6', '×'],
    ['1', '2', '3', '-'],
    ['0', '.', 'x', '+'],
    ['(', ')', 'y', 'z'],
    ['⌫', 'AC', '=', '?']
  ];

  const advancedSimplifyExpression = (expr: string): { simplified: string, changed: boolean, explanation: string } => {
    let simplified = expr.trim();
    let changed = false;
    let explanation = '';
    
    // Detectar e simplificar frações KaTeX numéricas
    const numericFractionPattern = /\\frac\{(\d+)\}\{(\d+)\}/g;
    const numericMatches = [...simplified.matchAll(numericFractionPattern)];
    if (numericMatches.length > 0) {
      numericMatches.forEach(match => {
        const numerator = parseInt(match[1]);
        const denominator = parseInt(match[2]);
        if (denominator !== 0 && numerator % denominator === 0) {
          const result = numerator / denominator;
          simplified = simplified.replace(match[0], result.toString());
          changed = true;
          explanation = `${numerator} ÷ ${denominator} = ${result}`;
        }
      });
    }
    
    // Detectar e simplificar frações com variáveis (ex: \frac{2x}{2} = x)
    const variableFractionPattern = /\\frac\{(\d*)([a-z])\}\{(\d+)\}/g;
    const variableMatches = [...simplified.matchAll(variableFractionPattern)];
    if (variableMatches.length > 0) {
      variableMatches.forEach(match => {
        const coefficient = match[1] ? parseInt(match[1]) : 1;
        const variable = match[2];
        const denominator = parseInt(match[3]);
        
        if (coefficient % denominator === 0) {
          const result = coefficient / denominator;
          const newTerm = result === 1 ? variable : `${result}${variable}`;
          simplified = simplified.replace(match[0], newTerm);
          changed = true;
          explanation = `${coefficient}${variable} ÷ ${denominator} = ${newTerm}`;
        }
      });
    }
    
    // Simplificar operações aritméticas básicas
    const basicArithmeticPatterns = [
      { pattern: /(\d+)\s*\+\s*(\d+)/g, operation: '+' },
      { pattern: /(\d+)\s*-\s*(\d+)/g, operation: '-' },
      { pattern: /(\d+)\s*\*\s*(\d+)/g, operation: '*' }
    ];
    
    basicArithmeticPatterns.forEach(({ pattern, operation }) => {
      const matches = [...simplified.matchAll(pattern)];
      matches.forEach(match => {
        const a = parseInt(match[1]);
        const b = parseInt(match[2]);
        let result;
        switch (operation) {
          case '+': result = a + b; break;
          case '-': result = a - b; break;
          case '*': result = a * b; break;
          default: return;
        }
        simplified = simplified.replace(match[0], result.toString());
        changed = true;
        explanation = explanation || `${a} ${operation} ${b} = ${result}`;
      });
    });
    
    // Remover termos zero desnecessários
    const beforeZeroRemoval = simplified;
    simplified = simplified
      .replace(/\s*\+\s*0/g, '')
      .replace(/\s*-\s*0/g, '')
      .replace(/^0\s*\+\s*/g, '')
      .trim();
      
    if (simplified !== beforeZeroRemoval) {
      changed = true;
      explanation = explanation || 'Removemos termos zero desnecessários';
    }
    
    return { 
      simplified, 
      changed,
      explanation: explanation || 'Simplificação aplicada'
    };
  };

  const validateStep = (left: string, right: string): 'correct' | 'warning' | 'error' => {
    // Lógica de validação simplificada
    if (left.includes('x') && right.includes('x')) return 'warning';
    if (left === right) return 'error';
    return 'correct';
  };

  const handleKeypadClick = (value: string) => {
    if (value === '⌫') {
      setInputValue(prev => prev.slice(0, -1));
    } else if (value === 'AC') {
      setInputValue('');
    } else if (value === '=') {
      // Aplicar ação selecionada
      if (selectedAction) {
        applyAction(selectedAction);
      }
    } else if (value === '?') {
      setShowHints(true);
    } else {
      setInputValue(prev => prev + (value === '×' ? '*' : value === '÷' ? '/' : value));
    }
  };

  const applyAction = (actionId: string) => {
    const action = actions.find(a => a.id === actionId);
    if (!action) return;

    const needsValue = action.needsValue && !inputValue.trim();
    if (needsValue) {
      alert('Por favor, insira um valor primeiro!');
      return;
    }

    const result = action.action(currentLeft, currentRight, inputValue || undefined);
    
    // Para simplificação, verificar se houve mudança real
    if (actionId === 'simplify' && result.explanation === 'Expressão já está simplificada') {
      alert('A expressão já está em sua forma mais simples!');
      setSelectedAction(null);
      return;
    }
    
    // Evitar passos duplicados
    const lastStep = steps[steps.length - 1];
    if (lastStep && lastStep.equation === `${result.left} = ${result.right}`) {
      alert('Este passo já foi aplicado!');
      setSelectedAction(null);
      return;
    }
    
    const status = validateStep(result.left, result.right);
    
    const newStep: EquationStep = {
      id: `step-${Date.now()}`,
      equation: `${result.left} = ${result.right}`,
      action: action.label + (inputValue ? ` ${inputValue}` : ''),
      explanation: result.explanation,
      status: actionId === 'simplify' && result.explanation !== 'Expressão já está simplificada' ? 'correct' : status,
      leftSide: result.left,
      rightSide: result.right
    };

    setAnimatingStep(newStep.id);
    setSteps(prev => [...prev, newStep]);
    setCurrentLeft(result.left);
    setCurrentRight(result.right);
    setInputValue('');
    setSelectedAction(null);

    // Remover animação após um tempo
    setTimeout(() => setAnimatingStep(null), 800);

    // Verificar se chegou ao resultado
    if (result.left === 'x' && !isNaN(parseFloat(result.right))) {
      setFinalAnswer(result.right);
      setTimeout(() => checkFinalAnswer(result.right), 1000);
    }
  };

  const checkFinalAnswer = (answer: string) => {
    const isCorrect = Math.abs(parseFloat(answer) - parseFloat(problem.expectedResult.toString())) < 0.01;
    setShowFeedback(true);
    
    if (isCorrect) {
      setTimeout(() => setShowVerification(true), 1000);
      setTimeout(() => onComplete(true), 3000);
    }
  };

  const verifyAnswer = () => {
    const verification = problem.equation.replace(/x/g, finalAnswer);
    return {
      original: problem.equation,
      substituted: verification,
      calculated: eval(verification.replace('=', '==')) ? 'Verdadeiro ✓' : 'Falso ✗'
    };
  };

  const reset = () => {
    const [left, right] = problem.equation.split('=').map(side => side.trim());
    setCurrentLeft(left);
    setCurrentRight(right);
    setSteps([{
      id: 'initial',
      equation: problem.equation,
      action: 'Equação inicial',
      explanation: 'Começamos com a equação dada',
      status: 'correct',
      leftSide: left,
      rightSide: right
    }]);
    setFinalAnswer('');
    setShowFeedback(false);
    setShowVerification(false);
    setInputValue('');
    setSelectedAction(null);
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">🔢</span>
            Editor de Equações Interativo - Estágio Abstrato
          </CardTitle>
          <p className="text-muted-foreground">{problem.description}</p>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="font-mono text-lg">
              <InlineMath math={problem.equation} />
            </Badge>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onReturnToPictorial}
              className="flex items-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar ao Pictórico
            </Button>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Área de trabalho - passos */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Resolução Passo a Passo
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Cada linha representa um passo da resolução. Mantenha sempre o equilíbrio!
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              <AnimatePresence>
                {steps.map((step, index) => (
                  <motion.div
                    key={step.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ 
                      opacity: 1, 
                      x: 0,
                      scale: animatingStep === step.id ? [1, 1.02, 1] : 1
                    }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                    className={`p-4 rounded-lg border-l-4 transition-colors ${
                      step.status === 'correct' ? 'border-green-500 bg-green-50/50' :
                      step.status === 'warning' ? 'border-yellow-500 bg-yellow-50/50' :
                      step.status === 'error' ? 'border-red-500 bg-red-50/50' :
                      'border-gray-300 bg-gray-50/50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-muted-foreground">
                        Linha {index + 1}: {step.action}
                      </span>
                      <span className="text-xs">
                        {step.status === 'correct' && '✅'}
                        {step.status === 'warning' && '⚠️'}
                        {step.status === 'error' && '❌'}
                      </span>
                    </div>
                    <div className="font-mono text-lg mb-1 text-center">
                      <BlockMath math={step.equation.replace(/=/g, ' = ')} />
                    </div>
                    <p className="text-sm text-muted-foreground text-center">
                      {step.explanation}
                    </p>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Equação atual */}
            <div className="mt-6 p-4 bg-primary/5 rounded-lg border-2 border-dashed border-primary/20">
              <p className="text-sm font-medium mb-2 text-center">Equação Atual:</p>
              <div className="font-mono text-xl text-center text-primary">
                <BlockMath math={`${currentLeft} = ${currentRight}`} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Painel de controles */}
        <div className="space-y-6">
          {/* Ações matemáticas */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Ações Disponíveis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {actions.map(action => (
                <Button
                  key={action.id}
                  variant={selectedAction === action.id ? "default" : "outline"}
                  className="w-full justify-start"
                  onClick={() => setSelectedAction(action.id)}
                >
                  <action.icon className="w-4 h-4 mr-2" />
                  {action.label}
                  {action.needsValue && ' por...'}
                </Button>
              ))}
              
              {selectedAction && actions.find(a => a.id === selectedAction)?.needsValue && (
                <div className="mt-2">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Digite o valor..."
                    className="mb-2"
                  />
                  <Button 
                    onClick={() => applyAction(selectedAction)}
                    className="w-full"
                    disabled={!inputValue.trim()}
                  >
                    Aplicar {actions.find(a => a.id === selectedAction)?.label}
                  </Button>
                </div>
              )}
              
              {selectedAction && !actions.find(a => a.id === selectedAction)?.needsValue && (
                <Button 
                  onClick={() => applyAction(selectedAction)}
                  className="w-full"
                >
                  Aplicar {actions.find(a => a.id === selectedAction)?.label}
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Teclado matemático */}
          {showKeypad && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center justify-between">
                  Teclado Matemático
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setShowKeypad(!showKeypad)}
                  >
                    {showKeypad ? 'Ocultar' : 'Mostrar'}
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-2">
                  {keypadButtons.flat().map((btn, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => handleKeypadClick(btn)}
                      className={`${
                        ['⌫', 'AC'].includes(btn) ? 'text-red-600' :
                        btn === '?' ? 'text-blue-600' :
                        btn === '=' ? 'text-green-600 bg-green-50' :
                        ''
                      }`}
                    >
                      {btn}
                    </Button>
                  ))}
                </div>
                
                {inputValue && (
                  <div className="mt-3 p-2 bg-muted rounded">
                    <p className="text-sm text-muted-foreground">Entrada:</p>
                    <p className="font-mono">{inputValue}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Dicas */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5" />
                  Dicas
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowHints(!showHints)}
                >
                  {showHints ? 'Ocultar' : 'Mostrar'}
                </Button>
              </CardTitle>
            </CardHeader>
            {showHints && (
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-800">
                      💡 {problem.hints[currentHintIndex]}
                    </p>
                  </div>
                  
                  <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                    <p className="text-sm font-medium text-yellow-800 mb-1">
                      Princípio do Equilíbrio:
                    </p>
                    <p className="text-xs text-yellow-700">
                      O que você fizer de um lado da equação, deve fazer do outro lado também!
                    </p>
                  </div>

                  {currentHintIndex < problem.hints.length - 1 && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setCurrentHintIndex(prev => prev + 1)}
                      className="w-full"
                    >
                      Próxima dica →
                    </Button>
                  )}
                </div>
              </CardContent>
            )}
          </Card>

          {/* Controles */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <Button onClick={reset} variant="outline" className="w-full">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Recomeçar
                </Button>
                
                <div className="flex gap-2">
                  <Badge variant="secondary" className="flex-1 justify-center">
                    {steps.length - 1} passos
                  </Badge>
                  <Badge 
                    variant={finalAnswer ? "default" : "outline"}
                    className="flex-1 justify-center"
                  >
                    {finalAnswer ? `x = ${finalAnswer}` : 'Em progresso...'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Verificação da resposta */}
      <AnimatePresence>
        {showVerification && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-800">
                  <Sparkles className="w-5 h-5" />
                  Verificação da Resposta
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-green-700 mb-1">Equação original:</p>
                    <div className="font-mono bg-white p-2 rounded border">
                      <InlineMath math={problem.equation} />
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-green-700 mb-1">Substituindo x = {finalAnswer}:</p>
                    <div className="font-mono bg-white p-2 rounded border">
                      <InlineMath math={problem.equation.replace(/x/g, finalAnswer)} />
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-green-700 mb-1">Verificação:</p>
                    <div className="font-mono bg-white p-2 rounded border text-green-600">
                      {problem.equation.replace(/x/g, finalAnswer)} = {eval(problem.equation.split('=')[0].replace(/x/g, finalAnswer))} = {eval(problem.equation.split('=')[1])} ✓
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 p-3 bg-green-100 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-semibold text-green-800">Parabéns! Resolução perfeita!</p>
                      <p className="text-sm text-green-700">Você dominou completamente o método CPA!</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Feedback de erro */}
      <AnimatePresence>
        {showFeedback && !showVerification && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="border-red-200 bg-red-50">
              <CardContent className="pt-6">
                <div className="text-red-800">
                  <p className="font-semibold">A resposta não está correta.</p>
                  <p className="text-sm">
                    Verifique os passos realizados ou{' '}
                    <Button 
                      variant="link" 
                      className="p-0 h-auto text-red-600"
                      onClick={onReturnToPictorial}
                    >
                      volte ao modelo pictórico
                    </Button>{' '}
                    para revisar o conceito.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};