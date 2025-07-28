import { ActivitiesSearch } from '@/components/layout/activity/activities-search'
import { AddActivityForm } from '@/components/common/add-activity-form'
import { DashboardLayout } from '@/components/layout/dashboard-layout'

export default function ActivitiesPage() {
  return (
    <DashboardLayout>
    <div className="w-full">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 sm:mb-8 gap-4">
      
        <div className="flex-shrink-0">
          <AddActivityForm />
        </div>
      </div>
      <ActivitiesSearch />
    </div>
    </DashboardLayout>
  )
}
