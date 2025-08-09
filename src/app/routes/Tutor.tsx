import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import ManthaChatTutor from '@/components/ManthaChatTutor'

export default function Tutor() {
  const { t, i18n } = useTranslation()
  useEffect(() => {
    document.title = `${t('tutor.title')} | Mantha`
  }, [t, i18n.language])
  return (
    <section>
      <h1 className="sr-only">{t('tutor.title')}</h1>
      <ManthaChatTutor />
    </section>
  )
}
