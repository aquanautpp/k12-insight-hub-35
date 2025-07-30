import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Home,
  Brain,
  TrendingUp,
  Settings,
  User,
  Menu,
  X,
  BookOpen,
  Target,
  MessageSquare
} from "lucide-react";

interface NavigationProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

const Navigation = ({ currentView, onViewChange }: NavigationProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, badge: null },
    { id: 'singapore-method', label: 'Método CPA', icon: Brain, badge: 'Novo' },
    { id: 'learning-test', label: 'Descubra Seu Superpoder de Aprender!', icon: Target, badge: 'Superpoder' },
    { id: 'comprehensible-input', label: 'Comprehensible Input', icon: BookOpen, badge: 'Novo' },
    { id: 'mantha-chat', label: 'Mantha Chat', icon: MessageSquare, badge: 'IA' },
    { id: 'progress', label: 'Progresso', icon: TrendingUp, badge: null },
    { id: 'activities', label: 'Atividades', icon: BookOpen, badge: '3' },
    { id: 'profile', label: 'Perfil', icon: User, badge: null },
  ];

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center justify-between bg-white/80 backdrop-blur-md border-b border-border/50 px-6 py-4 sticky top-0 z-50">
        <div className="flex items-center space-x-8">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-learning flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Mantha</h1>
              <p className="text-xs text-muted-foreground">Plataforma Educacional Adaptativa</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-1">
            {navItems.slice(0, 5).map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              
              return (
                <Button
                  key={item.id}
                  variant={isActive ? "learning" : "ghost"}
                  size="sm"
                  onClick={() => onViewChange(item.id)}
                  className="relative"
                >
                  <Icon className={`w-4 h-4 mr-2 ${item.id === 'singapore-method' ? 'text-green-700' : ''}`} />
                  {item.label}
                  {item.badge && (
                    <Badge variant="secondary" className="ml-2 text-xs">
                      {item.badge}
                    </Badge>
                  )}
                </Button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-gradient-achievement flex items-center justify-center">
              <span className="text-white text-sm font-bold">M</span>
            </div>
            <div className="text-sm">
              <p className="font-medium text-foreground">Maria Silva</p>
              <p className="text-muted-foreground">Estudante - 8º ano</p>
            </div>
          </div>
          <Button variant="ghost" size="sm">
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="md:hidden bg-white/90 backdrop-blur-md border-b border-border/50 px-4 py-3 sticky top-0 z-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-learning flex items-center justify-center">
              <Target className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-lg font-bold text-foreground">Mantha</h1>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-white/95 backdrop-blur-md border-b border-border/50 p-4 shadow-lg">
            <div className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                
                return (
                  <Button
                    key={item.id}
                    variant={isActive ? "learning" : "ghost"}
                    size="sm"
                    onClick={() => {
                      onViewChange(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full justify-start relative"
                  >
                    <Icon className={`w-4 h-4 mr-3 ${item.id === 'singapore-method' ? 'text-green-700' : ''}`} />
                    {item.label}
                    {item.badge && (
                      <Badge variant="secondary" className="ml-auto text-xs">
                        {item.badge}
                      </Badge>
                    )}
                  </Button>
                );
              })}
            </div>
            
            <div className="mt-4 pt-4 border-t border-border/50">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gradient-achievement flex items-center justify-center">
                  <span className="text-white font-bold">M</span>
                </div>
                <div>
                  <p className="font-medium text-foreground">Maria Silva</p>
                  <p className="text-sm text-muted-foreground">Estudante - 8º ano</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navigation;