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
                 <div className="flex flex-col items-center justify-center">
                    {/* Logo Completo MANTHA */}
                    <svg 
                      width={state === "collapsed" ? "48" : "80"} 
                      height={state === "collapsed" ? "64" : "106"} 
                      viewBox="0 0 200 265" 
                      className={`transition-all duration-200 ${state === "collapsed" ? "hover:scale-105" : ""}`}
                    >
                      {/* Arraia-Manta */}
                      <path
                        d="M100 40 C75 35, 25 50, 15 95 C10 120, 20 140, 40 155 C60 165, 80 170, 100 195 C120 170, 140 165, 160 155 C180 140, 190 120, 185 95 C175 50, 125 35, 100 40 Z"
                        fill="#6B7A47"
                      />
                      
                      {/* Estrutura Neural/Árvore no interior */}
                      <g transform="translate(100, 120)">
                        {/* Tronco central */}
                        <path d="M0,-20 L0,30" stroke="white" strokeWidth="3" fill="none"/>
                        
                        {/* Galhos principais */}
                        <path d="M0,-10 L-20,-20" stroke="white" strokeWidth="2.5" fill="none"/>
                        <path d="M0,-10 L20,-20" stroke="white" strokeWidth="2.5" fill="none"/>
                        <path d="M0,0 L-25,-5" stroke="white" strokeWidth="2.5" fill="none"/>
                        <path d="M0,0 L25,-5" stroke="white" strokeWidth="2.5" fill="none"/>
                        <path d="M0,10 L-20,20" stroke="white" strokeWidth="2.5" fill="none"/>
                        <path d="M0,10 L20,20" stroke="white" strokeWidth="2.5" fill="none"/>
                        
                        {/* Galhos secundários */}
                        <path d="M-20,-20 L-30,-30" stroke="white" strokeWidth="2" fill="none"/>
                        <path d="M-20,-20 L-35,-15" stroke="white" strokeWidth="2" fill="none"/>
                        <path d="M20,-20 L30,-30" stroke="white" strokeWidth="2" fill="none"/>
                        <path d="M20,-20 L35,-15" stroke="white" strokeWidth="2" fill="none"/>
                        <path d="M-25,-5 L-35,0" stroke="white" strokeWidth="2" fill="none"/>
                        <path d="M25,-5 L35,0" stroke="white" strokeWidth="2" fill="none"/>
                        
                        {/* Pontos neurais */}
                        <circle cx="0" cy="-20" r="3" fill="white"/>
                        <circle cx="-30" cy="-30" r="2.5" fill="white"/>
                        <circle cx="-35" cy="-15" r="2.5" fill="white"/>
                        <circle cx="30" cy="-30" r="2.5" fill="white"/>
                        <circle cx="35" cy="-15" r="2.5" fill="white"/>
                        <circle cx="-35" cy="0" r="2.5" fill="white"/>
                        <circle cx="35" cy="0" r="2.5" fill="white"/>
                        <circle cx="-20" cy="20" r="2.5" fill="white"/>
                        <circle cx="20" cy="20" r="2.5" fill="white"/>
                        <circle cx="0" cy="30" r="3" fill="white"/>
                      </g>
                      
                      {/* Texto MANTHA */}
                      <g transform="translate(100, 240)" textAnchor="middle">
                        <text 
                          x="0" 
                          y="0" 
                          fontSize={state === "collapsed" ? "18" : "24"} 
                          fontWeight="700" 
                          fill="#6B7A47" 
                          fontFamily="system-ui, -apple-system, sans-serif"
                          letterSpacing="1px"
                        >
                          MANTHA
                        </text>
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