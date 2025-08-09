import { useEffect } from 'react'
import EmotionalIntelligence from '@/components/EmotionalIntelligence'

export default function EI() {
  useEffect(() => {
    document.title = 'Inteligência Emocional | Mantha'
  }, [])
  return (
    <section>
      <h1 className="sr-only">Inteligência Emocional</h1>
      <EmotionalIntelligence />
    </section>
  )
}
