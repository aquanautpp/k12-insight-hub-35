import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import DashboardView from '@/components/Dashboard'

export default function Dashboard() {
  const { t, i18n } = useTranslation()
  useEffect(() => {
    document.title = `${t('dashboard.title')} | Mantha`
  }, [t, i18n.language])
  return (
    <section>
      <h1 className="sr-only">{t('dashboard.title')}</h1>
      <DashboardView />
    </section>
  )
}
