import { useEffect, useState } from "react";
import { AppSidebar } from "@/components/Sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useUserProfile } from "@/hooks/useUserProfile";
import { User } from "lucide-react";
import Dashboard from "@/components/Dashboard";
import CPAMethod from "@/components/CPAMethodNew";
import ManthaChatTutor from "@/components/ManthaChatTutor";
import LearningStyleTest from "@/components/LearningStyleTest";
import ProgressView from "@/components/ProgressView";
import ComprehensibleInput from "@/components/ComprehensibleInput";
import DailyChallenge from "@/components/DailyChallenge";
import EmotionalIntelligence from "@/components/EmotionalIntelligence";
import ReadingRecommendations from "@/components/ReadingRecommendations";
import { BackgroundRemover } from "@/components/BackgroundRemover";
import { FeatureFlagsDebugPanel } from "@/components/FeatureFlagsDebugPanel";
import SectionScroller from "@/components/SectionScroller";

const Index = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const { user, signOut } = useAuth();
  const { displayName } = useUserProfile();

  useEffect(() => {
    const handler = (e: Event) => {
      const anyEvent = e as CustomEvent<{ view?: string }>;
      const v = (anyEvent.detail as any)?.view;
      if (typeof v === 'string') setCurrentView(v);
    };
    window.addEventListener('app:navigate' as any, handler as any);
    return () => window.removeEventListener('app:navigate' as any, handler as any);
  }, []);

  const sections = [
    { id: 'dashboard', title: 'Painel de Controle', element: <Dashboard onViewChange={setCurrentView} /> },
    { id: 'cpa-method', title: 'Método CPA', element: <CPAMethod /> },
    { id: 'learning-test', title: 'Teste de Aprendizagem', element: <LearningStyleTest /> },
    { id: 'comprehensible-input', title: 'Aprender com Comprehensible Input', element: <ComprehensibleInput /> },
    { id: 'mantha-chat', title: 'Tutor IA', element: <ManthaChatTutor /> },
    { id: 'emotional-intelligence', title: 'Inteligência Emocional', element: <EmotionalIntelligence /> },
    { id: 'progress', title: 'Progresso', element: <ProgressView /> },
    { id: 'activities', title: 'Atividades', element: <DailyChallenge /> },
    { id: 'reading', title: 'Recomendações de Leitura', element: <ReadingRecommendations /> },
    { id: 'background-remover', title: 'Remover Fundo de Imagem', element: <BackgroundRemover /> },
  ];

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar currentView={currentView} onViewChange={setCurrentView} />
        
        <div className="flex-1 flex flex-col">
          <header className="nav-clean h-16 flex items-center justify-between px-6">
            <div className="flex items-center">
              <SidebarTrigger className="mr-4" />
              <div className="text-sm text-muted-foreground font-medium">
                {currentView === 'dashboard' && 'Painel de Controle'}
                {currentView === 'cpa-method' && 'Método CPA'}
                {currentView === 'learning-test' && 'Teste de Aprendizagem'}
                {currentView === 'comprehensible-input' && 'Aprender com Comprehensible Input'}
                {currentView === 'mantha-chat' && 'Tutor IA'}
                {currentView === 'emotional-intelligence' && 'Inteligência Emocional'}
                {currentView === 'progress' && 'Progresso'}
                {currentView === 'activities' && 'Atividades'}
                {currentView === 'reading' && 'Recomendações de Leitura'}
                {currentView === 'background-remover' && 'Remover Fundo de Imagem'}
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="hidden md:flex items-center space-x-2 text-sm text-muted-foreground">
                <User className="w-4 h-4" />
                <span className="truncate max-w-[200px]">
                  {displayName}
                </span>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={signOut}
                className="hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20"
              >
                Sair
              </Button>
            </div>
          </header>
          
          <main className="flex-1 bg-background px-0 md:px-0 py-0">
            <SectionScroller
              sections={sections}
              currentId={currentView}
              onActiveChange={setCurrentView}
            />
          </main>
        </div>
      </div>
      <FeatureFlagsDebugPanel />
    </SidebarProvider>
  );
};

export default Index;
