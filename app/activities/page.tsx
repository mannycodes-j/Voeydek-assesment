import { ActivitiesSearch } from '@/components/layout/activity/activities-search'
import { AddActivityForm } from '@/components/common/add-activity-form'
import { DashboardLayout } from '@/components/layout/dashboard-layout'

export default function ActivitiesPage() {
  return (
    <DashboardLayout>
    <div className="w-full">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 sm:mb-8 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Activities</h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Search for activities or add your own experience details
          </p>
        </div>
        <div className="flex-shrink-0">
          <AddActivityForm />
        </div>
      </div>
      <ActivitiesSearch />
    </div>
    </DashboardLayout>
  )
}
