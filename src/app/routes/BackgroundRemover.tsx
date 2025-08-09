import { useEffect } from 'react'
import { BackgroundRemover } from '@/components/BackgroundRemover'

export default function BgRemover() {
  useEffect(() => {
    document.title = 'Remover Fundo | Mantha'
  }, [])
  return (
    <section>
      <h1 className="sr-only">Remover Fundo</h1>
      <BackgroundRemover />
    </section>
  )
}
