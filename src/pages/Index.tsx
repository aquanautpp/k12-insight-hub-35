import { useState } from "react";
import Navigation from "@/components/Navigation";
import Dashboard from "@/components/Dashboard";
import SingaporeMethod from "@/components/SingaporeMethod";
import ChatTutor from "@/components/ChatTutor";
import ProgressView from "@/components/ProgressView";
import DailyChallenge from "@/components/DailyChallenge";

const Index = () => {
  const [currentView, setCurrentView] = useState('dashboard');

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'singapore-method':
        return <SingaporeMethod />;
      case 'chat-tutor':
        return <ChatTutor />;
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
