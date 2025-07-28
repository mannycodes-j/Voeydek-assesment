import { FlightsSearch } from '@/components/layout/flight/flights-search'
import { AddFlightForm } from '@/components/common/add-flight-form'
import { DashboardLayout } from '@/components/layout/dashboard-layout'

export default function FlightsPage() {
  return (
    <DashboardLayout>
    <div className="w-full">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 sm:mb-8 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Flights</h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Search for flights or add your own flight details
          </p>
        </div>
        <div className="flex-shrink-0">
          <AddFlightForm />
        </div>
      </div>
      <FlightsSearch />
    </div>
    </DashboardLayout>
  )
}
