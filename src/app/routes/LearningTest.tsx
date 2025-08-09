import { useEffect } from 'react'
import LearningStyleTest from '@/components/LearningStyleTest'

export default function LearningTest() {
  useEffect(() => {
    document.title = 'Teste de Aprendizagem | Mantha'
  }, [])
  return (
    <section>
      <h1 className="sr-only">Teste de Aprendizagem</h1>
      <LearningStyleTest />
    </section>
  )
}
