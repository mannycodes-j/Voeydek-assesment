import { HotelsSearch } from '@/components/layout/hotel/hotels-search'
import { AddHotelForm } from '@/components/common/add-hotel-form'
import { DashboardLayout } from '@/components/layout/dashboard-layout'

export default function HotelsPage() {
  return (
     <DashboardLayout>
 <div className="w-full">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 sm:mb-8 gap-4">
     
        <div className="flex-shrink-0">
          <AddHotelForm />
        </div>
      </div>
      <HotelsSearch />
    </div>
     </DashboardLayout>
  )
}

