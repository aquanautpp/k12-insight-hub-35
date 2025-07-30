import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Key, CheckCircle, Info } from "lucide-react";

interface ApiKeyConfigurationProps {
  onApiKeySet: (key: string) => void;
}

export default function ApiKeyConfiguration({ onApiKeySet }: ApiKeyConfigurationProps) {
  const [apiKey, setApiKey] = useState('');
  const [isSet, setIsSet] = useState(false);

  const handleSetApiKey = () => {
    if (apiKey.startsWith('sk-')) {
      localStorage.setItem('openai_api_key', apiKey);
      onApiKeySet(apiKey);
      setIsSet(true);
    }
  };

  const handleClear = () => {
    localStorage.removeItem('openai_api_key');
    setApiKey('');
    setIsSet(false);
    onApiKeySet('');
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key className="w-5 h-5" />
          Configuração da OpenAI API
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            Para usar a IA real, você precisa inserir sua chave da OpenAI API. 
            A chave será armazenada localmente no seu navegador.
          </AlertDescription>
        </Alert>

        {!isSet ? (
          <div className="space-y-3">
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
              Configurar API Key
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm">API Key configurada com sucesso!</span>
            </div>
            <Button 
              variant="outline" 
              onClick={handleClear}
              className="w-full"
            >
              Remover API Key
            </Button>
          </div>
        )}

        <Alert>
          <AlertDescription className="text-xs">
            <strong>Recomendação:</strong> Para maior segurança, configure a chave diretamente 
            no Supabase Edge Functions em vez de usar o localStorage.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}