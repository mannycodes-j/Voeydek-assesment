'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { SIDEBAR_MENU_ITEMS } from '@/lib/constants/navigation'
import Image from 'next/image'
import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Sidebar() {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <div
      className={cn(
        'bg-white rounded-xl shadow-sm border border-gray-200 h-fit transition-all duration-300 ease-in-out',
        isCollapsed ? 'w-16' : 'w-56'
      )}
    >
      {/* Mobile Toggle Button */}
      <div className="lg:hidden flex justify-end p-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="h-8 w-8 p-0"
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="p-4">
        <ul className="space-y-1">
          {SIDEBAR_MENU_ITEMS.map((item) => {
            const isActive = pathname === item.href
            return (
              <li key={item.title}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors relative group',
                    isActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900',
                    isCollapsed && 'justify-center px-2'
                  )}
                  title={isCollapsed ? item.title : undefined}
                >
                  <item.icon
                    className={cn(
                      'flex-shrink-0',
                      isCollapsed ? 'w-5 h-5' : 'w-4 h-4'
                    )}
                  />
                  {!isCollapsed && <span>{item.title}</span>}

                  {/* Tooltip for collapsed state */}
                  {isCollapsed && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                      {item.title}
                    </div>
                  )}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* User Profile */}
      <div
        className={cn(
          'mx-6 my-6 transition-all duration-300',
          isCollapsed ? 'mx-2' : 'mx-6'
        )}
      >
        {isCollapsed ? (
      
          <div className="flex justify-center">
            <div className="w-10 h-10 bg-blue-600 rounded-[3px] flex items-center justify-center group relative">
              <Image
                src="/assets/images/GO ICON WHITE 1.png"
                alt="Logo"
                width={24}
                height={24}
              />
            
              <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                Personal Account
              </div>
            </div>
          </div>
        ) : (
          
          <div className="flex flex-row items-center gap-2 bg-[#F0F2F5] py-4 px-2">
            <div className="w-10 h-10 bg-blue-600 rounded-[3px] flex items-center justify-center">
              <Image
                src="/assets/images/GO ICON WHITE 1.png"
                alt="Logo"
                width={24}
                height={24}
              />
            </div>
            <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
              PERSONAL ACCOUNT
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
