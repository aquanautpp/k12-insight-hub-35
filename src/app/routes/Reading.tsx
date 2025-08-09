import { useEffect } from 'react'
import ReadingRecommendations from '@/components/ReadingRecommendations'

export default function Reading() {
  useEffect(() => {
    document.title = 'Leitura | Mantha'
  }, [])
  return (
    <section>
      <h1 className="sr-only">Recomendações de Leitura</h1>
      <ReadingRecommendations />
    </section>
  )
}
