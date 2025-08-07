import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Brain, MessageSquare, BarChart3, Target, BookOpen, Heart, Book, User, Globe, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import logoImage from '@/assets/mantha-logo.png';
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar';
import { useAuth } from '@/contexts/AuthContext';
import { useUserProfile } from '@/hooks/useUserProfile';
import { Button } from '@/components/ui/button';
interface AppSidebarProps {
  currentView: string;
  onViewChange: (view: string) => void;
}
const navigationItems = [{
  id: 'dashboard',
  title: 'Painel de Controle',
  icon: LayoutDashboard
}, {
  id: 'learning-test',
  title: 'Teste de Aprendizagem',
  icon: Target
}, {
  id: 'cpa-method',
  title: 'Método CPA',
  icon: Brain
}, {
  id: 'mantha-chat',
  title: 'Tutor IA',
  icon: MessageSquare
}, {
  id: 'activities',
  title: 'Atividades',
  icon: BookOpen
}, {
  id: 'emotional-intelligence',
  title: 'Inteligência Emocional',
  icon: Heart
}, {
  id: 'reading',
  title: 'Leitura',
  icon: Book
}, {
  id: 'comprehensible-input',
  title: 'Línguas Estrangeiras',
  icon: Globe
}, {
  id: 'progress',
  title: 'Progresso',
  icon: BarChart3
}];
export function AppSidebar({
  currentView,
  onViewChange
}: AppSidebarProps) {
  const { state } = useSidebar();
  const { user, signOut } = useAuth();
  const { displayName } = useUserProfile();
  return <Sidebar collapsible="icon" className={`transition-all duration-300 bg-white border-r border-border/50 ${state === "collapsed" ? "w-16" : "w-64"}`}>
      <SidebarHeader className={`border-b border-border/30 transition-all duration-300 ${state === "collapsed" ? "p-2" : "p-4 md:p-6"}`}>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" className="data-[state=open]:bg-transparent hover:bg-transparent p-0">
              <div className={`flex items-center ${state === "collapsed" ? "justify-center" : "space-x-3"}`}>
                 <div className="flex aspect-square size-8 md:size-10 items-center justify-center rounded-xl bg-primary/10 border shadow-md">
                      <img src="/lovable-uploads/9aafef87-db99-4bf0-ae3b-c5d5ad94af1a.png" alt="MANTHA Logo" className="size-6 md:size-8 object-contain rounded" onLoad={() => console.log('Logo carregado com sucesso')} onError={e => {
                  console.error('Erro ao carregar logo:', e);
                  // Fallback para texto se a imagem falhar
                  e.currentTarget.style.display = 'none';
                  if (e.currentTarget.parentElement) {
                    e.currentTarget.parentElement.innerHTML = '<span class="text-primary font-bold text-lg">M</span>';
                  }
                }} />
                 </div>
                {state !== "collapsed" && <div className="grid flex-1 text-left leading-tight">
                    <span className="text-base md:text-lg font-semibold text-foreground">Mantha</span>
                    <span className="text-xs text-muted-foreground font-medium">Educação Personalizada</span>
                  </div>}
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="py-4 md:py-6 px-0">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1 md:space-y-2">
              {navigationItems.map(item => <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton onClick={() => onViewChange(item.id)} className={`w-full justify-start h-12 md:h-11 rounded-xl transition-all duration-200 font-medium text-sm md:text-base ${currentView === item.id ? "bg-primary text-primary-foreground shadow-md" : "hover:bg-muted text-muted-foreground hover:text-foreground"} ${state === "collapsed" ? "justify-center px-2" : "px-3"}`}>
                    <item.icon className={`${state === "collapsed" ? "h-6 w-6" : "h-5 w-5"} ${currentView === item.id ? "text-white" : "text-black"} flex-shrink-0`} />
                    {state !== "collapsed" && <span className="ml-3 truncate">{item.title}</span>}
                  </SidebarMenuButton>
                </SidebarMenuItem>)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className={`border-t border-border/30 transition-all duration-300 flex-shrink-0 space-y-2 ${state === "collapsed" ? "p-2" : "p-3 md:p-4"}`}>
        {/* User Info */}
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className={`w-full hover:bg-muted rounded-xl transition-colors duration-200 ${state === "collapsed" ? "p-2 justify-center min-h-[40px]" : "p-2 md:p-3 min-h-[48px] md:min-h-[60px]"}`}>
              <div className={`flex items-center w-full ${state === "collapsed" ? "justify-center" : "space-x-3"}`}>
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-md flex-shrink-0">
                  <span className="text-white text-xs md:text-sm font-semibold">
                    {displayName?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
                {state !== "collapsed" && (
                  <div className="flex flex-col text-left flex-1 min-w-0">
                    <span className="text-xs md:text-sm font-semibold text-foreground truncate">
                      Usuário
                    </span>
                    <span className="text-xs text-muted-foreground truncate">
                      {displayName}
                    </span>
                  </div>
                )}
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        {/* Logout Button */}
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={signOut}
              className={`w-full hover:bg-destructive/10 hover:text-destructive rounded-xl transition-colors duration-200 ${state === "collapsed" ? "p-2 justify-center min-h-[40px]" : "p-2 md:p-3 min-h-[40px] md:min-h-[44px]"}`}
            >
              <div className={`flex items-center w-full ${state === "collapsed" ? "justify-center" : "space-x-3"}`}>
                <LogOut className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" />
                {state !== "collapsed" && (
                  <span className="text-xs md:text-sm font-medium truncate">
                    Sair
                  </span>
                )}
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>;
}