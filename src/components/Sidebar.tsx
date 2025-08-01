import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Brain, MessageSquare, BarChart3, Target, BookOpen, Heart, Book, User, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';
import logoImage from '@/assets/mantha-logo.png';
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar';
interface AppSidebarProps {
  currentView: string;
  onViewChange: (view: string) => void;
}
const navigationItems = [{
  id: 'dashboard',
  title: 'Painel de Controle',
  icon: LayoutDashboard
}, {
  id: 'cpa-method',
  title: 'Método CPA',
  icon: Brain
}, {
  id: 'learning-test',
  title: 'Teste de Aprendizagem',
  icon: Target
}, {
  id: 'comprehensible-input',
  title: 'Línguas Estrangeiras',
  icon: Globe
}, {
  id: 'mantha-chat',
  title: 'Tutor IA',
  icon: MessageSquare
}, {
  id: 'emotional-intelligence',
  title: 'Inteligência Emocional',
  icon: Heart
}, {
  id: 'progress',
  title: 'Progresso',
  icon: BarChart3
}, {
  id: 'activities',
  title: 'Atividades',
  icon: BookOpen
}, {
  id: 'reading',
  title: 'Leitura',
  icon: Book
}];
export function AppSidebar({
  currentView,
  onViewChange
}: AppSidebarProps) {
  const {
    state
  } = useSidebar();
  return <Sidebar collapsible="icon" className={`transition-all duration-300 bg-white border-r border-border/50 ${state === "collapsed" ? "w-40" : "w-64"}`}>
      <SidebarHeader className="border-b border-border/30 p-6 px-[10px]">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" className="data-[state=open]:bg-transparent hover:bg-transparent p-0">
              <div className="flex items-center space-x-3">
                 <div className="flex aspect-square size-12 items-center justify-center rounded-xl bg-primary/10 border shadow-md">
                     <img src="/lovable-uploads/fa8005ca-2496-41d7-9974-7c2234c4b1e8.png" alt="MANTHA Logo" className="size-12 object-cover rounded-xl" onLoad={() => console.log('Logo carregado com sucesso')} onError={e => {
                  console.error('Erro ao carregar logo:', e);
                  // Fallback para texto se a imagem falhar
                  e.currentTarget.style.display = 'none';
                  if (e.currentTarget.parentElement) {
                    e.currentTarget.parentElement.innerHTML = '<span class="text-primary font-bold text-lg">M</span>';
                  }
                }} />
                 </div>
                {state !== "collapsed" && <div className="grid flex-1 text-left leading-tight">
                    <span className="text-lg font-semibold text-foreground">Mantha</span>
                    <span className="text-xs text-muted-foreground font-medium">Educação Personalizada</span>
                  </div>}
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="py-6 px-0">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {navigationItems.map(item => <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton onClick={() => onViewChange(item.id)} className={`w-full justify-start h-11 rounded-xl transition-all duration-200 font-medium ${currentView === item.id ? "bg-primary text-primary-foreground shadow-md" : "hover:bg-muted text-muted-foreground hover:text-foreground"} ${state === "collapsed" ? "justify-center px-0" : ""}`}>
                    <item.icon className={`${state === "collapsed" ? "h-6 w-6" : "h-5 w-5"}`} />
                    {state !== "collapsed" && <span className="ml-3">{item.title}</span>}
                  </SidebarMenuButton>
                </SidebarMenuItem>)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border/30 p-4 px-0">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="w-full p-3 hover:bg-muted rounded-xl transition-colors duration-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gradient-achievement flex items-center justify-center shadow-md">
                  <span className="text-white text-sm font-semibold py-px my-0">V</span>
                </div>
                {state !== "collapsed" && <div className="flex flex-col text-left">
                    <span className="text-sm font-semibold text-foreground">Victor</span>
                    <span className="text-xs text-muted-foreground">Estudante</span>
                  </div>}
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>;
}