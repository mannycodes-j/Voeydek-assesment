'use client'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { TripDashboard } from '@/components/ui/pages/trip-dashboard'

export default function HomePage() {
  return (
    <DashboardLayout>
      <TripDashboard />
    </DashboardLayout>
  )
}
