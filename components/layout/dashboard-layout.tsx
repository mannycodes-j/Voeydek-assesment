'use client'

import type React from 'react'
import { TopNavigation } from './top-navigation'
import { Sidebar } from './sidebar'
import { SidebarProvider } from '@/components/ui/sidebar'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen bg-gray-100">
        {/* Top Navigation */}
        <TopNavigation />

        {/* Main Layout */}
        <div className="flex flex-col lg:flex-row gap-4 p-4">
          {/* Sidebar */}
          <div className="lg:flex-shrink-0">
            <Sidebar />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 min-h-[calc(100vh-120px)]">
              <div className="p-4 sm:p-6">{children}</div>
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  )
}
