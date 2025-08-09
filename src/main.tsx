import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import 'katex/dist/katex.min.css'
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

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
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
  </StrictMode>,
)

