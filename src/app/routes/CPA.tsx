import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import CPAMethod from '@/components/CPAMethodNew'

export default function CPA() {
  const { t, i18n } = useTranslation()
  useEffect(() => {
    document.title = `${t('cpa.title')} | Mantha`
  }, [t, i18n.language])
  return (
    <section>
      <h1 className="sr-only">{t('cpa.title')}</h1>
      <CPAMethod />
    </section>
  )
}
