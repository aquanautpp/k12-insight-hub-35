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
import logoImage from '@/assets/mantha-logo.png';
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
                 <div className="flex aspect-square size-10 items-center justify-center">
                    {/* SVG da Arraia-Manta */}
                    <svg 
                      width={state === "collapsed" ? "24" : "40"} 
                      height={state === "collapsed" ? "24" : "40"} 
                      viewBox="0 0 200 200" 
                      className={`transition-all duration-200 ${state === "collapsed" ? "hover:scale-110" : ""}`}
                    >
                      {/* Forma da Arraia-Manta */}
                      <path
                        d="M100 20 C80 20, 30 40, 20 80 C20 100, 30 120, 50 130 C70 135, 90 140, 100 160 C110 140, 130 135, 150 130 C170 120, 180 100, 180 80 C170 40, 120 20, 100 20 Z"
                        fill="hsl(var(--primary))"
                      />
                      {/* Estrutura Neural/Árvore no interior */}
                      <g transform="translate(100, 80)">
                        {/* Tronco central */}
                        <line x1="0" y1="0" x2="0" y2="40" stroke="white" strokeWidth="3"/>
                        {/* Galhos principais */}
                        <line x1="0" y1="10" x2="-15" y2="5" stroke="white" strokeWidth="2"/>
                        <line x1="0" y1="10" x2="15" y2="5" stroke="white" strokeWidth="2"/>
                        <line x1="0" y1="20" x2="-20" y2="15" stroke="white" strokeWidth="2"/>
                        <line x1="0" y1="20" x2="20" y2="15" stroke="white" strokeWidth="2"/>
                        <line x1="0" y1="30" x2="-10" y2="35" stroke="white" strokeWidth="2"/>
                        <line x1="0" y1="30" x2="10" y2="35" stroke="white" strokeWidth="2"/>
                        {/* Galhos secundários */}
                        <line x1="-15" y1="5" x2="-25" y2="0" stroke="white" strokeWidth="1.5"/>
                        <line x1="-15" y1="5" x2="-20" y2="-5" stroke="white" strokeWidth="1.5"/>
                        <line x1="15" y1="5" x2="25" y2="0" stroke="white" strokeWidth="1.5"/>
                        <line x1="15" y1="5" x2="20" y2="-5" stroke="white" strokeWidth="1.5"/>
                        {/* Pontos neurais (extremidades) */}
                        <circle cx="0" cy="0" r="3" fill="white"/>
                        <circle cx="-25" cy="0" r="2.5" fill="white"/>
                        <circle cx="-20" cy="-5" r="2.5" fill="white"/>
                        <circle cx="25" cy="0" r="2.5" fill="white"/>
                        <circle cx="20" cy="-5" r="2.5" fill="white"/>
                        <circle cx="-20" cy="15" r="2" fill="white"/>
                        <circle cx="20" cy="15" r="2" fill="white"/>
                        <circle cx="-10" cy="35" r="2" fill="white"/>
                        <circle cx="10" cy="35" r="2" fill="white"/>
                        <circle cx="0" cy="40" r="2.5" fill="white"/>
                      </g>
                    </svg>
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