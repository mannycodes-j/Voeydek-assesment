'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { SIDEBAR_MENU_ITEMS } from '@/lib/constants/navigation'
import Image from 'next/image'

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="w-56 bg-white rounded-xl shadow-sm border border-gray-200 h-fit">
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
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  )}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.title}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* User Profile */}
      <div className=" items-center flex flex-row gap-2 bg-[#F0F2F5] mx-6 my-6 py-4 max-w-[400px] px-2">
        <div className="w-10 h-10 bg-blue-600 rounded-[3px] flex items-center justify-center">
          <Image
            src="/assets/images/GO ICON WHITE 1.png"
            alt="Logo"
            width={24}
            height={24}
          />
        </div>
        <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-2">
          PERSONAL ACCOUNT
        </div>
      </div>
    </div>
  )
}
