import { useState } from "react";
import { AppSidebar } from "@/components/Sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import Dashboard from "@/components/Dashboard";
import CPAMethod from "@/components/CPAMethodNew";
import ChatTutor from "@/components/ChatTutor";
import MerakiChatTutor from "@/components/MerakiChatTutor";
import LearningStyleTest from "@/components/LearningStyleTest";
import ProgressView from "@/components/ProgressView";
import DailyChallenge from "@/components/DailyChallenge";

const Index = () => {
  const [currentView, setCurrentView] = useState('dashboard');

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'cpa-method':
        return <CPAMethod />;
      case 'learning-test':
        return <LearningStyleTest />;
      case 'chat-tutor':
        return <ChatTutor />;
      case 'meraki-chat':
        return <MerakiChatTutor />;
      case 'progress':
        return <ProgressView />;
      case 'activities':
        return <DailyChallenge />;
      case 'profile':
        return <Dashboard />; // Placeholder
      default:
        return <Dashboard />;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar currentView={currentView} onViewChange={setCurrentView} />
        
        <div className="flex-1 flex flex-col">
          <header className="h-12 flex items-center border-b border-border bg-card">
            <SidebarTrigger className="ml-2" />
            <div className="ml-4">
              <h2 className="text-lg font-semibold text-foreground">
                {currentView === 'dashboard' && 'Dashboard'}
                {currentView === 'cpa-method' && 'Método CPA'}
                {currentView === 'learning-test' && 'Teste de Aprendizagem'}
                {currentView === 'meraki-chat' && 'Tutor IA'}
                {currentView === 'progress' && 'Progresso'}
                {currentView === 'activities' && 'Atividades'}
              </h2>
            </div>
          </header>
          
          <main className="flex-1 overflow-auto">
            {renderView()}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;
