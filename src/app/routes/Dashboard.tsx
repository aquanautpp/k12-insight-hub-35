import { useEffect } from 'react'
import DashboardView from '@/components/Dashboard'

export default function Dashboard() {
  useEffect(() => {
    document.title = 'Dashboard | Mantha'
  }, [])
  return (
    <section>
      <h1 className="sr-only">Dashboard - Mantha</h1>
      <DashboardView />
    </section>
  )
}
