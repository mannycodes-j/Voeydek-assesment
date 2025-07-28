'use client'

import {
  Search,
  Home,
  Wallet,
  Bell,
  ShoppingCart,
  HandCoins,
  ListChecks,
  PieChartIcon as ChartPie,
  Plus,
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { SidebarTrigger } from '@/components/ui/sidebar'
import Image from 'next/image'

export function TopNavigation() {
  return (
    <header className="bg-white border-b border-gray-200 w-full sticky top-0 z-50">
      <div className="px-3 sm:px-6 py-3">
        <div className="flex items-center justify-between lg:justify-evenly gap-4">
          {/* Mobile sidebar trigger and Logo */}
          <div className="flex items-center gap-3 lg:gap-6">
            <SidebarTrigger className="lg:hidden" />
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 rounded-[3px] flex items-center justify-center">
                <Image
                  src="/assets/images/GO ICON WHITE 1.png"
                  alt="Logo"
                  width={20}
                  height={20}
                  className="sm:w-6 sm:h-6"
                />
              </div>
            </div>

            {/* Search - Hidden on mobile */}
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search"
                className="pl-10 w-48 lg:w-72 bg-gray-50 border-gray-200 focus:bg-white h-9"
              />
            </div>
          </div>

          {/* Navigation Links - Hidden on mobile and tablet */}
          <nav className="hidden xl:flex items-center gap-1">
            <div className="flex flex-col items-center">
              <Home className="w-4 h-4" />
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-600 hover:text-gray-900 h-9 px-3"
              >
                Home
              </Button>
            </div>
            <div className="flex flex-col items-center">
              <ChartPie className="w-4 h-4" />
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-600 hover:text-gray-900 h-9 px-3"
              >
                Dashboard
                  
              </Button>
            </div>
            <div className="flex flex-col items-center">
              <Wallet className="w-4 h-4" />
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-600 hover:text-gray-900 h-9 px-3"
              >
                Wallet
              </Button>
            </div>
            <div className="flex flex-col items-center">
              <ListChecks className="w-4 h-4" />
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-600 hover:text-gray-900 h-9 px-3"
              >
                Plan a trip
              </Button>
            </div>
            <div className="flex flex-col items-center">
              <HandCoins className="w-4 h-4" />
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-600 hover:text-gray-900 h-9 px-3"
              >
                Commission for life
              </Button>
            </div>
          </nav>

          {/* Separator - Hidden on mobile */}
          <div className="w-0.5 h-14 bg-gray-300 mx-2 hidden xl:block" />

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-4 lg:gap-8">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-2 rounded-lg font-medium h-9 text-sm">
              Subscribe
            </Button>

            <div className="flex items-center gap-2 sm:gap-4 lg:gap-7">
              {/* Notification */}
              <div className="flex flex-col items-center">
                <Bell className="w-4 h-4" />
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative text-gray-600 hover:text-gray-900 h-9 w-9 hidden sm:flex"
                >
                  <span className="sr-only sm:not-sr-only text-xs">
                    Notification
                  </span>
                </Button>
              </div>

              {/* Cart */}
              <div className="flex flex-col items-center">
                <ShoppingCart className="w-4 h-4" />
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative text-gray-600 hover:text-gray-900 h-9 w-9 hidden sm:flex"
                >
                  <span className="sr-only sm:not-sr-only text-xs">Carts</span>
                </Button>
              </div>

              {/* Create */}
              <div className="flex flex-col items-center">
                <Plus className="w-4 h-4" />
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative text-gray-600 hover:text-gray-900 h-9 w-9 hidden sm:flex"
                >
                  <span className="sr-only sm:not-sr-only text-xs">Create</span>
                </Button>
              </div>

              {/* Profile */}
              <div className="flex items-center ml-2">
                <img
                  src="/assets/images/profile-icon.png"
                  alt="Profile"
                  className="w-6 h-6 sm:w-8 sm:h-8 rounded-full object-cover"
                />
                <svg
                  className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500 ml-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
