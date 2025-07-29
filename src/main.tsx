import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ProgressProvider } from './contexts/ProgressContext'
import { XPProvider } from './contexts/XPContext'
import { ChallengeProvider } from './contexts/ChallengeContext'
import { AchievementProvider } from './contexts/AchievementContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ProgressProvider>
      <XPProvider>
        <ChallengeProvider>
          <AchievementProvider>
            <App />
          </AchievementProvider>
        </ChallengeProvider>
      </XPProvider>
    </ProgressProvider>
  </StrictMode>,
)
