import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { CheckCircle, RotateCcw, ArrowLeft, Calculator } from "lucide-react";

interface Step {
  id: string;
  expression: string;
  explanation: string;
  isCorrect: boolean;
}

interface EquationEditorProps {
  problem: {
    description: string;
    equation: string;
    expectedSteps: string[];
    expectedResult: number | string;
    hints: string[];
  };
  onComplete: (success: boolean) => void;
  onReturnToPictorial: () => void;
}

export const EquationEditor = ({ problem, onComplete, onReturnToPictorial }: EquationEditorProps) => {
  const [currentStep, setCurrentStep] = useState("");
  const [steps, setSteps] = useState<Step[]>([]);
  const [showHints, setShowHints] = useState(false);
  const [currentHintIndex, setCurrentHintIndex] = useState(0);
  const [result, setResult] = useState<string>("");
  const [showFeedback, setShowFeedback] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const addStep = () => {
    if (!currentStep.trim()) return;

    const stepNumber = steps.length + 1;
    const newStep: Step = {
      id: `step-${stepNumber}`,
      expression: currentStep,
      explanation: `Passo ${stepNumber}`,
      isCorrect: validateStep(currentStep, stepNumber)
    };

    setSteps(prev => [...prev, newStep]);
    setCurrentStep("");

    // Se errou, adicionar à lista de erros
    if (!newStep.isCorrect) {
      setErrors(prev => [...prev, `Erro no passo ${stepNumber}: ${currentStep}`]);
    }
  };

  const validateStep = (expression: string, stepNumber: number): boolean => {
    // Lógica simplificada de validação baseada nos passos esperados
    if (stepNumber <= problem.expectedSteps.length) {
      const expectedPattern = problem.expectedSteps[stepNumber - 1];
      return expression.includes(expectedPattern) || 
             expression.replace(/\s/g, '') === expectedPattern.replace(/\s/g, '');
    }
    return true;
  };

  const checkSolution = () => {
    const finalResult = result.trim();
    const expectedStr = problem.expectedResult.toString();
    const isCorrect = finalResult === expectedStr || 
                     Math.abs(parseFloat(finalResult) - parseFloat(expectedStr)) < 0.01;
    
    setShowFeedback(true);
    
    if (isCorrect && errors.length <= 1) {
      setTimeout(() => onComplete(true), 2000);
    }
  };

  const reset = () => {
    setSteps([]);
    setCurrentStep("");
    setResult("");
    setShowFeedback(false);
    setErrors([]);
    setShowHints(false);
    setCurrentHintIndex(0);
  };

  const getNextHint = () => {
    if (currentHintIndex < problem.hints.length - 1) {
      setCurrentHintIndex(prev => prev + 1);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addStep();
    }
  };

  const getStepFeedback = (step: Step, index: number) => {
    if (step.isCorrect) {
      return "✅ Correto!";
    } else {
      return `❌ Verifique este passo. Esperado: ${problem.expectedSteps[index] || 'resultado final'}`;
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-2xl">🔢</span>
          Editor de Equações - Estágio Abstrato
        </CardTitle>
        <p className="text-muted-foreground">{problem.description}</p>
        <div className="flex items-center gap-2">
          <Badge variant="outline">Equação: {problem.equation}</Badge>
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
      
      <CardContent className="space-y-6">
        {/* Área de resolução passo a passo */}
        <div className="bg-gradient-subtle p-4 rounded-lg">
          <h3 className="font-semibold mb-3 text-foreground">Resolução Passo a Passo</h3>
          
          {/* Passos já adicionados */}
          {steps.map((step, index) => (
            <div key={step.id} className={`mb-2 p-3 rounded border-l-4 ${
              step.isCorrect ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'
            }`}>
              <div className="flex justify-between items-center">
                <code className="text-lg font-mono">{step.expression}</code>
                <span className={`text-sm ${step.isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                  {getStepFeedback(step, index)}
                </span>
              </div>
            </div>
          ))}

          {/* Input para próximo passo */}
          <div className="flex gap-2 mt-4">
            <Input
              value={currentStep}
              onChange={(e) => setCurrentStep(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Digite o próximo passo (ex: 2x = 8)"
              className="font-mono"
            />
            <Button onClick={addStep} size="sm">
              Adicionar Passo
            </Button>
          </div>
        </div>

        {/* Resultado final */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Resultado Final
            </label>
            <div className="flex gap-2">
              <Input
                value={result}
                onChange={(e) => setResult(e.target.value)}
                placeholder="Digite o resultado"
                className="font-mono text-lg"
              />
              <Button onClick={checkSolution} className="flex items-center gap-1">
                <CheckCircle className="w-4 h-4" />
                Verificar
              </Button>
            </div>
          </div>

          {/* Dicas */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-foreground">Dicas</label>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowHints(!showHints)}
              >
                {showHints ? 'Ocultar' : 'Mostrar'} Dicas
              </Button>
            </div>
            
            {showHints && (
              <div className="bg-muted/50 p-3 rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">
                  {problem.hints[currentHintIndex]}
                </p>
                {currentHintIndex < problem.hints.length - 1 && (
                  <Button variant="ghost" size="sm" onClick={getNextHint}>
                    Próxima dica →
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Histórico de erros */}
        {errors.length > 0 && (
          <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
            <h4 className="font-semibold text-red-800 mb-2">Erros Cometidos:</h4>
            <ul className="text-sm text-red-700 space-y-1">
              {errors.map((error, index) => (
                <li key={index}>• {error}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Controles */}
        <div className="flex gap-3 items-center">
          <Button onClick={reset} variant="outline" size="sm">
            <RotateCcw className="w-4 h-4" />
            Recomeçar
          </Button>
          
          <Badge variant={errors.length <= 1 ? "default" : "destructive"}>
            {errors.length} erro(s)
          </Badge>
          
          {steps.length > 0 && (
            <Badge variant="secondary">
              {steps.length} passo(s) realizados
            </Badge>
          )}
        </div>

        {/* Feedback */}
        {showFeedback && (
          <div className={`p-4 rounded-lg border ${
            result === problem.expectedResult.toString() && errors.length <= 1
              ? 'bg-green-50 border-green-200 text-green-800' 
              : 'bg-red-50 border-red-200 text-red-800'
          }`}>
            {result === problem.expectedResult.toString() && errors.length <= 1 ? (
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-semibold">Parabéns! Resolução correta!</p>
                  <p className="text-sm">Você dominou o método CPA completamente!</p>
                </div>
              </div>
            ) : (
              <div>
                <p className="font-semibold">A resolução precisa de correções.</p>
                <p className="text-sm">
                  {errors.length > 1 ? 
                    "Muitos erros nos passos. " : 
                    "Verifique o resultado final. "
                  }
                  <Button 
                    variant="link" 
                    className="p-0 h-auto text-red-600"
                    onClick={onReturnToPictorial}
                  >
                    Que tal revisar no modelo de barras?
                  </Button>
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};