import { useEffect } from 'react'
import ProgressView from '@/components/ProgressView'

export default function Planner() {
  useEffect(() => {
    document.title = 'Planejador | Mantha'
  }, [])
  return (
    <section>
      <h1 className="sr-only">Planejador de Estudos</h1>
      <ProgressView />
    </section>
  )
}
