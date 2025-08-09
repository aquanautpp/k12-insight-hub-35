import { useEffect } from 'react'
import LearningStyleTest from '@/components/LearningStyleTest'

export default function Onboarding() {
  useEffect(() => {
    document.title = 'Onboarding | Mantha'
  }, [])
  return (
    <section>
      <h1 className="sr-only">Onboarding</h1>
      <LearningStyleTest />
    </section>
  )
}
