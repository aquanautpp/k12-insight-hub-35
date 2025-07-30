import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Key, CheckCircle, Info, Zap, AlertTriangle } from "lucide-react";
import { openaiService } from "@/services/openaiService";

export default function APIKeyManager() {
  const [apiKey, setApiKey] = useState('');
  const [isConfigured, setIsConfigured] = useState(false);
  const [status, setStatus] = useState<'none' | 'stored' | 'active' | 'error'>('none');
  const [testResult, setTestResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    checkCurrentStatus();
  }, []);

  const checkCurrentStatus = () => {
    const storedKey = localStorage.getItem('openai_api_key');
    setIsConfigured(!!storedKey && storedKey.startsWith('sk-'));
    setStatus(openaiService.getApiKeyStatus());
  };

  const handleSetApiKey = () => {
    if (apiKey.startsWith('sk-')) {
      localStorage.setItem('openai_api_key', apiKey);
      setIsConfigured(true);
      setApiKey('');
      checkCurrentStatus();
    }
  };

  const handleClear = () => {
    localStorage.removeItem('openai_api_key');
    setIsConfigured(false);
    setApiKey('');
    setTestResult(null);
    checkCurrentStatus();
  };

  const testApiConnection = async () => {
    setIsLoading(true);
    setTestResult(null);

    try {
      const response = await openaiService.generateResponse("Teste rápido", {
        cpaStage: 'concrete',
        learningStyle: 'visual'
      });
      
      if (response.isRealAI) {
        setTestResult("✅ Conexão com OpenAI funcionando perfeitamente!");
      } else {
        setTestResult("❌ API não funcionou, usando respostas simuladas");
      }
    } catch (error) {
      setTestResult("❌ Erro ao testar conexão com a API");
    } finally {
      setIsLoading(false);
    }
  };

  const statusConfig = {
    none: { color: 'bg-red-100 text-red-800', text: 'Não configurada' },
    stored: { color: 'bg-yellow-100 text-yellow-800', text: 'Configurada' },
    active: { color: 'bg-green-100 text-green-800', text: 'Ativa e funcionando' },
    error: { color: 'bg-red-100 text-red-800', text: 'Erro na conexão' }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="w-5 h-5" />
            Gerenciamento da OpenAI API
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Status atual:</span>
            <Badge className={statusConfig[status].color}>
              {statusConfig[status].text}
            </Badge>
          </div>

          {!isConfigured ? (
            <div className="space-y-3">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Para usar a IA real da Mantha, insira sua chave da OpenAI API. 
                  A chave será armazenada apenas no seu navegador.
                </AlertDescription>
              </Alert>

              <Input
                type="password"
                placeholder="sk-proj-..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="font-mono text-sm"
              />
              <Button 
                onClick={handleSetApiKey}
                disabled={!apiKey.startsWith('sk-')}
                className="w-full"
              >
                <Zap className="w-4 h-4 mr-2" />
                Configurar API Key
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm">API Key configurada com sucesso!</span>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={testApiConnection}
                  disabled={isLoading}
                  className="flex-1"
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
                  ) : (
                    <Zap className="w-4 h-4 mr-2" />
                  )}
                  Testar Conexão
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleClear}
                  className="flex-1"
                >
                  Remover API Key
                </Button>
              </div>

              {testResult && (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{testResult}</AlertDescription>
                </Alert>
              )}
            </div>
          )}

          <Alert>
            <AlertDescription className="text-xs">
              <strong>Como obter sua API Key:</strong>
              <br />1. Acesse platform.openai.com
              <br />2. Vá em "API Keys" no menu
              <br />3. Clique em "Create new secret key"
              <br />4. Cole a chave aqui
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}