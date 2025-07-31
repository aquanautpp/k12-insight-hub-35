import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { HelpCircle, BookOpen, Eye, Brain, ExternalLink } from 'lucide-react';
import { useTelemetry } from '@/contexts/TelemetryContext';

interface CPAExplanationTooltipProps {
  trigger?: React.ReactNode;
  onDismiss?: () => void;
}

export const CPAExplanationTooltip: React.FC<CPAExplanationTooltipProps> = ({ 
  trigger,
  onDismiss 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasBeenShown, setHasBeenShown] = useState(false);
  const { trackEvent, trackUserAction } = useTelemetry();

  useEffect(() => {
    // Verificar se já foi mostrado nos últimos 30 dias
    const lastShown = localStorage.getItem('cpaExplanationLastShown');
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    
    if (lastShown && new Date(lastShown) > thirtyDaysAgo) {
      setHasBeenShown(true);
    }
  }, []);

  const handleOpen = () => {
    setIsOpen(true);
    trackEvent('cpa_explanation_viewed', { source: 'manual_trigger' });
  };

  const handleClose = () => {
    setIsOpen(false);
    onDismiss?.();
  };

  const handleUnderstood = () => {
    localStorage.setItem('cpaExplanationLastShown', new Date().toISOString());
    setHasBeenShown(true);
    trackUserAction('cpa_explanation_understood');
    handleClose();
  };

  const handleLearnMore = () => {
    trackUserAction('cpa_explanation_learn_more_clicked');
    // Em uma implementação real, abriria uma página de ajuda
    console.log('Navegando para página de ajuda do Método CPA');
  };

  const defaultTrigger = (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleOpen}
      className="h-6 w-6 p-0 rounded-full hover:bg-primary/10"
      aria-label="Explicação do Método CPA"
    >
      <HelpCircle className="h-4 w-4 text-primary" />
    </Button>
  );

  return (
    <>
      {trigger ? (
        <div onClick={handleOpen} className="cursor-pointer">
          {trigger}
        </div>
      ) : (
        defaultTrigger
      )}

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md mx-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-center">
              O que é o Método CPA?
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <p className="text-sm text-muted-foreground text-center">
              Uma forma especial de aprender matemática que funciona como construir uma casa: 
              primeiro a base, depois as paredes, e por último o acabamento!
            </p>

            <div className="space-y-3">
              <Card className="border-l-4 border-l-green-500">
                <CardContent className="p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                      <BookOpen className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="font-semibold text-sm">Concreto</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Usar objetos reais como blocos e peças para tocar e manipular
                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-blue-500">
                <CardContent className="p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <Eye className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="font-semibold text-sm">Pictórico</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Desenhar e visualizar com diagramas e imagens
                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-purple-500">
                <CardContent className="p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                      <Brain className="w-4 h-4 text-purple-600" />
                    </div>
                    <span className="font-semibold text-sm">Abstrato</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Usar números e símbolos matemáticos
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-center pt-2">
              <Button
                onClick={handleUnderstood}
                size="sm"
                className="text-xs px-6"
              >
                Entendi!
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};