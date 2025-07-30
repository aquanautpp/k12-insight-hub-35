import { useState } from "react";
import { AppSidebar } from "@/components/Sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import Dashboard from "@/components/Dashboard";
import CPAMethod from "@/components/CPAMethodNew";
import ManthaChatTutor from "@/components/ManthaChatTutor";
import LearningStyleTest from "@/components/LearningStyleTest";
import ProgressView from "@/components/ProgressView";
import DailyChallenge from "@/components/DailyChallenge";
import EmotionalIntelligence from "@/components/EmotionalIntelligence";
import ReadingRecommendations from "@/components/ReadingRecommendations";
import { FeatureFlagsDebugPanel } from "@/components/FeatureFlagsDebugPanel";

const Index = () => {
  const [currentView, setCurrentView] = useState('dashboard');

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard onViewChange={setCurrentView} />;
      case 'cpa-method':
        return <CPAMethod />;
      case 'learning-test':
        return <LearningStyleTest />;
    case 'mantha-chat':
      return <ManthaChatTutor />;
      case 'emotional-intelligence':
        return <EmotionalIntelligence />;
      case 'progress':
        return <ProgressView />;
      case 'activities':
        return <DailyChallenge />;
      case 'reading':
        return <ReadingRecommendations />;
      default:
        return <Dashboard onViewChange={setCurrentView} />;
    }
  };

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
                {currentView === 'mantha-chat' && 'Tutor IA'}
                {currentView === 'emotional-intelligence' && 'Inteligência Emocional'}
                {currentView === 'progress' && 'Progresso'}
                {currentView === 'activities' && 'Atividades'}
                {currentView === 'reading' && 'Recomendações de Leitura'}
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="text-muted-foreground">
                Conta
              </Button>
              <Button variant="pill" size="sm">
                Sair
              </Button>
            </div>
          </header>
          
          <main className="flex-1 overflow-auto">
            {renderView()}
          </main>
        </div>
      </div>
      <FeatureFlagsDebugPanel />
    </SidebarProvider>
  );
};

export default Index;
