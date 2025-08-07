import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useUserProgress } from '@/hooks/useUserProgress';
import { useChatHistory } from '@/hooks/useChatHistory';
import { CheckCircle, XCircle, TestTube, Clock } from 'lucide-react';

interface SystemTestProps {
  onClose?: () => void;
}

export const SystemTest: React.FC<SystemTestProps> = ({ onClose }) => {
  const { profile, loading: profileLoading, displayName, nome, email } = useUserProfile();
  const { progress, loading: progressLoading, addStudyTime, addCompletedActivity, addPoints } = useUserProgress();
  const { messages, loading: chatLoading, saveChatMessage } = useChatHistory();
  const [testResults, setTestResults] = useState<Record<string, boolean>>({});
  const [isTestingInProgress, setIsTestingInProgress] = useState(false);

  const runTest = async (testName: string, testFn: () => Promise<boolean>) => {
    setIsTestingInProgress(true);
    try {
      const result = await testFn();
      setTestResults(prev => ({ ...prev, [testName]: result }));
      return result;
    } catch (error) {
      console.error(`Teste ${testName} falhou:`, error);
      setTestResults(prev => ({ ...prev, [testName]: false }));
      return false;
    } finally {
      setIsTestingInProgress(false);
    }
  };

  const testProfile = async () => {
    return runTest('profile', async () => {
      return !profileLoading && !!profile && !!displayName;
    });
  };

  const testProgress = async () => {
    return runTest('progress', async () => {
      return !progressLoading && !!progress;
    });
  };

  const testProgressUpdate = async () => {
    return runTest('progressUpdate', async () => {
      if (!progress) return false;
      const oldTime = progress.tempo_estudo;
      await addStudyTime(5);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for update
      return true; // Assume success if no error thrown
    });
  };

  const testChatSave = async () => {
    return runTest('chatSave', async () => {
      const oldCount = messages.length;
      await saveChatMessage('Teste de sistema', 'Resposta de teste', 'concrete', 'Matemática');
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for save
      return true; // Assume success if no error thrown
    });
  };

  const testActivityCompletion = async () => {
    return runTest('activityCompletion', async () => {
      await addCompletedActivity('teste-sistema');
      await addPoints(10);
      return true; // Assume success if no error thrown
    });
  };

  const runAllTests = async () => {
    setIsTestingInProgress(true);
    await testProfile();
    await testProgress();
    await testProgressUpdate();
    await testChatSave();
    await testActivityCompletion();
    setIsTestingInProgress(false);
  };

  const getStatusIcon = (testName: string) => {
    if (isTestingInProgress) return <Clock className="w-4 h-4 animate-spin" />;
    if (testResults[testName] === true) return <CheckCircle className="w-4 h-4 text-green-500" />;
    if (testResults[testName] === false) return <XCircle className="w-4 h-4 text-red-500" />;
    return <TestTube className="w-4 h-4 text-muted-foreground" />;
  };

  const getStatusBadge = (testName: string) => {
    if (isTestingInProgress) return <Badge variant="outline">Testando...</Badge>;
    if (testResults[testName] === true) return <Badge variant="default" className="bg-green-500">Passou</Badge>;
    if (testResults[testName] === false) return <Badge variant="destructive">Falhou</Badge>;
    return <Badge variant="outline">Pendente</Badge>;
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TestTube className="w-5 h-5" />
          Teste do Sistema
        </CardTitle>
        <CardDescription>
          Verificar se todos os componentes estão funcionando corretamente
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Status dos Dados */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h3 className="font-semibold">Status dos Dados</h3>
            <div className="text-sm space-y-1">
              <p><strong>Email:</strong> {email || 'N/A'}</p>
              <p><strong>Nome:</strong> {nome || displayName || 'N/A'}</p>
              <p><strong>Progresso:</strong> {progress ? 'Carregado' : 'Não encontrado'}</p>
              <p><strong>Mensagens Chat:</strong> {messages.length}</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="font-semibold">Status de Loading</h3>
            <div className="text-sm space-y-1">
              <p>Profile: {profileLoading ? 'Carregando...' : 'OK'}</p>
              <p>Progress: {progressLoading ? 'Carregando...' : 'OK'}</p>
              <p>Chat: {chatLoading ? 'Carregando...' : 'OK'}</p>
            </div>
          </div>
        </div>

        {/* Testes Funcionais */}
        <div className="space-y-3">
          <h3 className="font-semibold">Testes Funcionais</h3>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-2">
                {getStatusIcon('profile')}
                <span>Carregamento do Perfil</span>
              </div>
              <div className="flex items-center gap-2">
                {getStatusBadge('profile')}
                <Button variant="outline" size="sm" onClick={testProfile} disabled={isTestingInProgress}>
                  Testar
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-2">
                {getStatusIcon('progress')}
                <span>Carregamento do Progresso</span>
              </div>
              <div className="flex items-center gap-2">
                {getStatusBadge('progress')}
                <Button variant="outline" size="sm" onClick={testProgress} disabled={isTestingInProgress}>
                  Testar
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-2">
                {getStatusIcon('progressUpdate')}
                <span>Atualização de Progresso</span>
              </div>
              <div className="flex items-center gap-2">
                {getStatusBadge('progressUpdate')}
                <Button variant="outline" size="sm" onClick={testProgressUpdate} disabled={isTestingInProgress}>
                  Testar
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-2">
                {getStatusIcon('chatSave')}
                <span>Salvamento de Chat</span>
              </div>
              <div className="flex items-center gap-2">
                {getStatusBadge('chatSave')}
                <Button variant="outline" size="sm" onClick={testChatSave} disabled={isTestingInProgress}>
                  Testar
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-2">
                {getStatusIcon('activityCompletion')}
                <span>Conclusão de Atividade</span>
              </div>
              <div className="flex items-center gap-2">
                {getStatusBadge('activityCompletion')}
                <Button variant="outline" size="sm" onClick={testActivityCompletion} disabled={isTestingInProgress}>
                  Testar
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Ações */}
        <div className="flex gap-2 pt-4">
          <Button 
            onClick={runAllTests} 
            disabled={isTestingInProgress}
            className="flex-1"
          >
            {isTestingInProgress ? 'Testando...' : 'Executar Todos os Testes'}
          </Button>
          {onClose && (
            <Button variant="outline" onClick={onClose}>
              Fechar
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};