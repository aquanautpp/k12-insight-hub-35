import { useEffect } from 'react'
import DailyChallenge from '@/components/DailyChallenge'

export default function Challenges() {
  useEffect(() => {
    document.title = 'Desafios | Mantha'
  }, [])
  return (
    <section>
      <h1 className="sr-only">Desafios Diários</h1>
      <DailyChallenge />
    </section>
  )
}
