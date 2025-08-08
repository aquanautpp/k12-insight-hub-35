import { useEffect, useState, useRef } from "react";
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
import TopReadingProgress from "@/components/TopReadingProgress";

const Index = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const { user, signOut } = useAuth();
  const { displayName } = useUserProfile();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      const anyEvent = e as CustomEvent<{ view?: string }>;
      const v = (anyEvent.detail as any)?.view;
      if (typeof v === 'string') setCurrentView(v);
    };
    window.addEventListener('app:navigate' as any, handler as any);
    return () => window.removeEventListener('app:navigate' as any, handler as any);
  }, []);

  // SEO básico por rota autenticada
  useEffect(() => {
    const titles: Record<string, string> = {
      'dashboard': 'Plataforma Educacional Personalizada | Método CPA',
      'cpa-method': 'Método CPA | Concreto • Pictórico • Abstrato',
      'learning-test': 'Teste de Estilo de Aprendizagem | Descubra seu superpoder',
      'mantha-chat': 'Tutor IA | Dúvidas respondidas em tempo real',
      'progress': 'Seu Progresso | Metas e Insights',
      'activities': 'Desafios Diários | Prática Ativa',
      'reading': 'Recomendações de Leitura Personalizadas'
    };
    document.title = titles[currentView] ?? 'Mantha - Aprendizagem Personalizada';

    const description = 'Aprenda mais rápido com trilhas personalizadas, Método CPA e IA.';
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'description');
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', description);

    let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    const canonicalUrl = window.location.origin + '/';
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
    }
    link.setAttribute('href', canonicalUrl);
  }, [currentView]);

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard onViewChange={setCurrentView} />;
      case 'cpa-method':
        return <CPAMethod />;
      case 'learning-test':
        return <LearningStyleTest />;
      case 'comprehensible-input':
        return <ComprehensibleInput />;
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
      case 'background-remover':
        return <BackgroundRemover />;
      default:
        return <Dashboard onViewChange={setCurrentView} />;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar currentView={currentView} onViewChange={setCurrentView} />
        
        <div className="flex-1 flex flex-col">
          <TopReadingProgress targetRef={scrollContainerRef} />
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
          
          <main ref={scrollContainerRef} className="flex-1 overflow-auto bg-background px-4 md:px-6 py-4">
            {renderView()}
          </main>
        </div>
      </div>
      <FeatureFlagsDebugPanel />
    </SidebarProvider>
  );
};

export default Index;
