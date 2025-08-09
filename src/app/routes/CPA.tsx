import { useEffect } from 'react'
import CPAMethod from '@/components/CPAMethodNew'

export default function CPA() {
  useEffect(() => {
    document.title = 'Método CPA | Mantha'
  }, [])
  return (
    <section>
      <h1 className="sr-only">Método CPA</h1>
      <CPAMethod />
    </section>
  )
}
