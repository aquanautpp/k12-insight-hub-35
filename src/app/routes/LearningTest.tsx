import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import LearningStyleTest from '@/components/LearningStyleTest'

export default function LearningTest() {
  const { t, i18n } = useTranslation()
  useEffect(() => {
    document.title = `${t('learningTest.title')} | Mantha`
  }, [t, i18n.language])
  return (
    <section>
      <h1 className="sr-only">{t('learningTest.title')}</h1>
      <LearningStyleTest />
    </section>
  )
}
