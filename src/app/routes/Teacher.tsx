import { useEffect } from 'react'

export default function Teacher() {
  useEffect(() => {
    document.title = 'Área do Professor | Mantha'
  }, [])
  return (
    <section className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold mb-2">Área do Professor</h1>
      <p className="text-muted-foreground">Em breve: ferramentas para professores.</p>
    </section>
  )
}
