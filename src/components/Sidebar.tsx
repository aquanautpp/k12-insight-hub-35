import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Brain, 
  MessageSquare, 
  BarChart3, 
  Target, 
  BookOpen,
  User
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
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
    title: 'Dashboard',
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
    id: 'meraki-chat',
    title: 'Tutor IA',
    icon: MessageSquare,
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
];

export function AppSidebar({ currentView, onViewChange }: AppSidebarProps) {
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';

  return (
    <Sidebar className={cn(collapsed ? "w-14" : "w-64")}>
      <SidebarContent>
        {/* Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-primary-foreground" />
            </div>
            {!collapsed && (
              <div>
                <h1 className="text-lg font-bold text-foreground">Meraki</h1>
                <p className="text-xs text-muted-foreground">Plataforma de Aprendizagem</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>Menu Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton 
                    asChild
                    isActive={currentView === item.id}
                  >
                    <button
                      onClick={() => onViewChange(item.id)}
                      className={cn(
                        "flex items-center gap-3 w-full p-2 rounded-lg transition-colors",
                        currentView === item.id
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted"
                      )}
                    >
                      <item.icon className="w-5 h-5" />
                      {!collapsed && <span>{item.title}</span>}
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* User Profile */}
        <div className="mt-auto p-4 border-t border-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-secondary-foreground" />
            </div>
            {!collapsed && (
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">Victor</p>
                <p className="text-xs text-muted-foreground">Estudante</p>
              </div>
            )}
          </div>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}