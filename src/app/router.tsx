import { lazy } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import AppLayout from './layouts/AppLayout'
import ProtectedRoute from '@/components/ProtectedRoute'

// Public routes
const Auth = lazy(() => import('@/pages/Auth'))
const ResetPassword = lazy(() => import('@/pages/ResetPassword'))
const NotFound = lazy(() => import('@/pages/NotFound'))

// App (lazy) routes
const Dashboard = lazy(() => import('./routes/Dashboard'))
const CPA = lazy(() => import('./routes/CPA'))
const Tutor = lazy(() => import('./routes/Tutor'))
const Challenges = lazy(() => import('./routes/Challenges'))
const EI = lazy(() => import('./routes/EI'))
const Planner = lazy(() => import('./routes/Planner'))
const Teacher = lazy(() => import('./routes/Teacher'))
const Onboarding = lazy(() => import('./routes/Onboarding'))
// Extra wrappers to preserve existing navigation IDs
const Progress = lazy(() => import('./routes/Progress'))
const LearningTest = lazy(() => import('./routes/LearningTest'))
const ComprehensibleInput = lazy(() => import('./routes/ComprehensibleInput'))
const Reading = lazy(() => import('./routes/Reading'))
const BackgroundRemover = lazy(() => import('./routes/BackgroundRemover'))

export const router = createBrowserRouter([
  { path: '/auth', element: <Auth /> },
  { path: '/reset-password', element: <ResetPassword /> },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'cpa', element: <CPA /> },
      { path: 'cpa-method', element: <CPA /> },
      { path: 'tutor', element: <Tutor /> },
      { path: 'mantha-chat', element: <Tutor /> },
      { path: 'desafios', element: <Challenges /> },
      { path: 'activities', element: <Challenges /> },
      { path: 'ei', element: <EI /> },
      { path: 'emotional-intelligence', element: <EI /> },
      { path: 'planner', element: <Planner /> },
      { path: 'teacher', element: <Teacher /> },
      { path: 'onboarding', element: <Onboarding /> },
      // Preserve existing menu links
      { path: 'progress', element: <Progress /> },
      { path: 'learning-test', element: <LearningTest /> },
      { path: 'comprehensible-input', element: <ComprehensibleInput /> },
      { path: 'reading', element: <Reading /> },
      { path: 'background-remover', element: <BackgroundRemover /> },
    ],
  },
  { path: '*', element: <NotFound /> },
])

export default router
