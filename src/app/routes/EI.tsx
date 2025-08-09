import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import EmotionalIntelligence from '@/components/EmotionalIntelligence'

export default function EI() {
  const { t, i18n } = useTranslation()
  useEffect(() => {
    document.title = `${t('ei.title')} | Mantha`
  }, [t, i18n.language])
  return (
    <section>
      <h1 className="sr-only">{t('ei.title')}</h1>
      <EmotionalIntelligence />
    </section>
  )
}
