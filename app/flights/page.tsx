import { FlightsSearch } from '@/components/layout/flight/flights-search'
import { AddFlightForm } from '@/components/common/add-flight-form'
import { DashboardLayout } from '@/components/layout/dashboard-layout'

export default function FlightsPage() {
  return (
    <DashboardLayout>
    <div className="w-full">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 sm:mb-8 gap-4">
      
        <div className="flex-shrink-0">
          <AddFlightForm />
        </div>
      </div>
      <FlightsSearch />
    </div>
    </DashboardLayout>
  )
}
