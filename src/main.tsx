import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import 'katex/dist/katex.min.css'
import './i18n'
import i18n from './i18n'
import { I18nextProvider } from 'react-i18next'
import { RouterProvider } from 'react-router-dom'
import router from './app/router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { AuthProvider } from './contexts/AuthContext'
import { ProgressProvider } from './contexts/ProgressContext'
import { XPProvider } from './contexts/XPContext'
import { ChallengeProvider } from './contexts/ChallengeContext'
import { AchievementProvider } from './contexts/AchievementContext'
import { FeatureFlagsProvider } from './contexts/FeatureFlagsContext'
import { TelemetryProvider } from './contexts/TelemetryContext'

i18n.on('languageChanged', (lng) => {
  document.documentElement.setAttribute('lang', lng === 'pt-BR' ? 'pt-BR' : 'en')
})
// set initial lang attribute
document.documentElement.setAttribute('lang', i18n.language === 'pt-BR' ? 'pt-BR' : 'en')

const queryClient = new QueryClient()


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <I18nextProvider i18n={i18n}>
      <AuthProvider>
        <TelemetryProvider>
          <FeatureFlagsProvider>
            <ProgressProvider>
              <XPProvider>
                <ChallengeProvider>
                  <AchievementProvider>
                    <QueryClientProvider client={queryClient}>
                      <TooltipProvider>
                        <Toaster />
                        <Sonner />
                        <RouterProvider router={router} />
                      </TooltipProvider>
                    </QueryClientProvider>
                  </AchievementProvider>
                </ChallengeProvider>
              </XPProvider>
            </ProgressProvider>
          </FeatureFlagsProvider>
        </TelemetryProvider>
      </AuthProvider>
    </I18nextProvider>
  </StrictMode>,
)

