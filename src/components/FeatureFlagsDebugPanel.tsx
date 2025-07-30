import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Settings, Eye, EyeOff } from 'lucide-react';
import { useFeatureFlags } from '@/contexts/FeatureFlagsContext';

export const FeatureFlagsDebugPanel: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { flags, toggleFlag } = useFeatureFlags();

  if (process.env.NODE_ENV === 'production') return null;

  const featureDescriptions = {
    cpaExplanationTooltip: 'Tooltip explicativo do Método CPA',
    learningTestOnboarding: 'Onboarding lúdico no Teste de Aprendizagem',
    personalizedInsights: 'Insights personalizados baseados no perfil',
    gamificationRewards: 'Sistema de gamificação e recompensas',
    aiTutorIntegration: 'Integração clara do Tutor IA',
    accessibilityPanel: 'Painel de preferências de acessibilidade',
    feedbackSystem: 'Sistema de feedback simples',
    contentAsData: 'Conteúdo tratado como dados',
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isVisible ? (
        <Button
          onClick={() => setIsVisible(true)}
          size="sm"
          variant="outline"
          className="shadow-lg"
        >
          <Settings className="h-4 w-4" />
        </Button>
      ) : (
        <Card className="w-80 shadow-lg border-2">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">Feature Flags</CardTitle>
              <Button
                onClick={() => setIsVisible(false)}
                size="sm"
                variant="ghost"
              >
                <EyeOff className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {Object.entries(flags).map(([key, enabled]) => (
              <div key={key} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium">{key}</span>
                    <Badge variant={enabled ? "default" : "secondary"} className="text-xs">
                      {enabled ? "ON" : "OFF"}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {featureDescriptions[key as keyof typeof featureDescriptions]}
                  </p>
                </div>
                <Switch
                  checked={enabled}
                  onCheckedChange={() => toggleFlag(key as keyof typeof flags)}
                />
              </div>
            ))}
            <div className="pt-2 border-t">
              <p className="text-xs text-muted-foreground">
                Telemetria: console + localStorage
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};