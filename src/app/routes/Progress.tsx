import { useEffect } from 'react'
import ProgressView from '@/components/ProgressView'

export default function Progress() {
  useEffect(() => {
    document.title = 'Progresso | Mantha'
  }, [])
  return (
    <section>
      <h1 className="sr-only">Progresso</h1>
      <ProgressView />
    </section>
  )
}
