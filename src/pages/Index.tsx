import { useState } from "react";
import Navigation from "@/components/Navigation";
import Dashboard from "@/components/Dashboard";
import CPAMethod from "@/components/CPAMethod";
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
      case 'singapore-method':
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
    <div className="min-h-screen bg-background">
      <Navigation currentView={currentView} onViewChange={setCurrentView} />
      {renderView()}
    </div>
  );
};

export default Index;
