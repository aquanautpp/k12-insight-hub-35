import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/Sidebar'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'
import { useUserProfile } from '@/hooks/useUserProfile'
import { FeatureFlagsDebugPanel } from '@/components/FeatureFlagsDebugPanel'
import { User } from 'lucide-react'
import { Suspense, useMemo } from 'react'

const titleMap: Record<string, string> = {
  '/': 'Painel de Controle',
  '/cpa': 'Método CPA',
  '/cpa-method': 'Método CPA',
  '/tutor': 'Tutor IA',
  '/mantha-chat': 'Tutor IA',
  '/desafios': 'Atividades',
  '/activities': 'Atividades',
  '/ei': 'Inteligência Emocional',
  '/emotional-intelligence': 'Inteligência Emocional',
  '/planner': 'Planejador',
  '/progress': 'Progresso',
  '/reading': 'Recomendações de Leitura',
  '/learning-test': 'Teste de Aprendizagem',
  '/comprehensible-input': 'Línguas Estrangeiras',
  '/background-remover': 'Remover Fundo de Imagem',
  '/teacher': 'Área do Professor',
  '/onboarding': 'Onboarding',
}

const idToPath: Record<string, string> = {
  'dashboard': '/',
  'cpa-method': '/cpa',
  'mantha-chat': '/tutor',
  'activities': '/desafios',
  'emotional-intelligence': '/ei',
  'progress': '/progress',
  'reading': '/reading',
  'learning-test': '/learning-test',
  'comprehensible-input': '/comprehensible-input',
  'background-remover': '/background-remover',
}

export default function AppLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const { signOut } = useAuth()
  const { displayName } = useUserProfile()

  const currentView = useMemo(() => {
    const pathname = location.pathname
    if (pathname === '/') return 'dashboard'
    // reverse map
    const entry = Object.entries(idToPath).find(([, path]) => path === pathname)
    return entry ? entry[0] : 'dashboard'
  }, [location.pathname])

  const onViewChange = (view: string) => {
    const path = idToPath[view]
    if (path) navigate(path)
  }

  const title = titleMap[location.pathname] ?? 'Mantha'

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar currentView={currentView} onViewChange={onViewChange} />

        <div className="flex-1 flex flex-col">
          <header className="nav-clean h-16 flex items-center justify-between px-6">
            <div className="flex items-center">
              <SidebarTrigger className="mr-4" />
              <div className="text-sm text-muted-foreground font-medium">
                {title}
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="hidden md:flex items-center space-x-2 text-sm text-muted-foreground">
                <User className="w-4 h-4" />
                <span className="truncate max-w-[200px]">{displayName}</span>
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

          <main className="flex-1 overflow-auto bg-background px-4 md:px-6 py-4">
            <Suspense fallback={<div className="text-center text-muted-foreground py-10">Carregando...</div>}>
              <Outlet />
            </Suspense>
          </main>
        </div>
      </div>
      <FeatureFlagsDebugPanel />
    </SidebarProvider>
  )
}
