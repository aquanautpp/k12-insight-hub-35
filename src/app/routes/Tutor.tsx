import { useEffect } from 'react'
import ManthaChatTutor from '@/components/ManthaChatTutor'

export default function Tutor() {
  useEffect(() => {
    document.title = 'Tutor IA | Mantha'
  }, [])
  return (
    <section>
      <h1 className="sr-only">Tutor IA</h1>
      <ManthaChatTutor />
    </section>
  )
}
