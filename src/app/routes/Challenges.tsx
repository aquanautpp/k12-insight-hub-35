import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import DailyChallenge from '@/components/DailyChallenge'

export default function Challenges() {
  const { t, i18n } = useTranslation()
  useEffect(() => {
    document.title = `${t('challenges.title')} | Mantha`
  }, [t, i18n.language])
  return (
    <section>
      <h1 className="sr-only">{t('challenges.title')}</h1>
      <DailyChallenge />
    </section>
  )
}
