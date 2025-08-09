import { useTranslation } from 'react-i18next'
import type { ReactNode } from 'react'

export default function LangKey({ children }: { children: ReactNode }) {
  const { i18n } = useTranslation()
  return <div key={i18n.language}>{children}</div>
}
