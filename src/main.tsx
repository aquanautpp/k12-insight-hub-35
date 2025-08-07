import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './contexts/AuthContext'
import { ProgressProvider } from './contexts/ProgressContext'
import { XPProvider } from './contexts/XPContext'
import { ChallengeProvider } from './contexts/ChallengeContext'
import { AchievementProvider } from './contexts/AchievementContext'
import { FeatureFlagsProvider } from './contexts/FeatureFlagsContext'
import { TelemetryProvider } from './contexts/TelemetryContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <TelemetryProvider>
        <FeatureFlagsProvider>
          <ProgressProvider>
            <XPProvider>
              <ChallengeProvider>
                <AchievementProvider>
                  <App />
                </AchievementProvider>
              </ChallengeProvider>
            </XPProvider>
          </ProgressProvider>
        </FeatureFlagsProvider>
      </TelemetryProvider>
    </AuthProvider>
  </StrictMode>,
)
