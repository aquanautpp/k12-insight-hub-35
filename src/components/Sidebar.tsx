import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Brain, 
  MessageSquare, 
  BarChart3, 
  Target, 
  BookOpen,
  Heart,
  Book,
  User,
  Globe
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';

interface AppSidebarProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

const navigationItems = [
  {
    id: 'dashboard',
    title: 'Painel de Controle',
    icon: LayoutDashboard,
  },
  {
    id: 'cpa-method',
    title: 'Método CPA',
    icon: Brain,
  },
  {
    id: 'learning-test',
    title: 'Teste de Aprendizagem',
    icon: Target,
  },
  {
    id: 'comprehensible-input',
    title: 'Línguas Estrangeiras',
    icon: Globe,
  },
  {
    id: 'mantha-chat',
    title: 'Tutor IA',
    icon: MessageSquare,
  },
  {
    id: 'emotional-intelligence',
    title: 'Inteligência Emocional',
    icon: Heart,
  },
  {
    id: 'progress',
    title: 'Progresso',
    icon: BarChart3,
  },
  {
    id: 'activities',
    title: 'Atividades',
    icon: BookOpen,
  },
  {
    id: 'reading',
    title: 'Leitura',
    icon: Book,
  },
];

export function AppSidebar({ currentView, onViewChange }: AppSidebarProps) {
  const { state } = useSidebar()

  return (
    <Sidebar 
      collapsible="icon" 
      className={`transition-all duration-300 bg-white border-r border-border/50 ${state === "collapsed" ? "w-14" : "w-64"}`}
    >
      <SidebarHeader className="border-b border-border/30 p-6">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              size="lg" 
              className="data-[state=open]:bg-transparent hover:bg-transparent p-0"
            >
              <div className="flex items-center space-x-3">
                <div className="flex aspect-square size-10 items-center justify-center rounded-xl bg-white border shadow-md">
                  <img 
                    src="/lovable-uploads/2639b08c-e703-4d6d-a73b-7b0cb9566448.png" 
                    alt="MANTHA Logo" 
                    className="size-6 object-contain"
                  />
                </div>
                {state !== "collapsed" && (
                  <div className="grid flex-1 text-left leading-tight">
                    <span className="text-lg font-semibold text-foreground">Mantha</span>
                    <span className="text-xs text-muted-foreground font-medium">Educação Personalizada</span>
                  </div>
                )}
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="px-3 py-6">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton 
                    onClick={() => onViewChange(item.id)}
                    className={`w-full justify-start h-11 rounded-xl transition-all duration-200 font-medium ${
                      currentView === item.id 
                        ? "bg-primary text-primary-foreground shadow-md" 
                        : "hover:bg-muted text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    {state !== "collapsed" && <span className="ml-3">{item.title}</span>}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border/30 p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="w-full p-3 hover:bg-muted rounded-xl transition-colors duration-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gradient-achievement flex items-center justify-center shadow-md">
                  <span className="text-white text-sm font-semibold">V</span>
                </div>
                {state !== "collapsed" && (
                  <div className="flex flex-col text-left">
                    <span className="text-sm font-semibold text-foreground">Victor</span>
                    <span className="text-xs text-muted-foreground">Estudante</span>
                  </div>
                )}
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}