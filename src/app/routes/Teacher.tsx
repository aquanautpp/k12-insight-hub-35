import { useEffect } from 'react'

export default function Teacher() {
  useEffect(() => {
    document.title = 'Área do Professor | Mantha'
  }, [])
  return (
    <div className="p-6">Dashboard do Professor (heatmap por habilidade)</div>
  )
}
