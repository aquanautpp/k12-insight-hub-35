import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import ProgressView from '@/components/ProgressView'

export default function Planner() {
  const { t, i18n } = useTranslation()
  useEffect(() => {
    document.title = `${t('planner.title')} | Mantha`
  }, [t, i18n.language])
  return (
    <section>
      <h1 className="sr-only">{t('planner.title')}</h1>
      <ProgressView />
    </section>
  )
}
