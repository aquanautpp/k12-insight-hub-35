import { useEffect } from 'react'
import ComprehensibleInput from '@/components/ComprehensibleInput'

export default function CI() {
  useEffect(() => {
    document.title = 'Línguas Estrangeiras | Mantha'
  }, [])
  return (
    <section>
      <h1 className="sr-only">Como Aprender Línguas Estrangeiras</h1>
      <ComprehensibleInput />
    </section>
  )
}
