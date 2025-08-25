'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  HomeIcon, 
  BuildingOfficeIcon, 
  UserGroupIcon, 
  TrophyIcon,
  NewspaperIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon
} from '@heroicons/react/24/outline'

interface SidebarProps {
  isCollapsed: boolean
  onToggleCollapse: () => void
}

export default function AdminSidebar({ isCollapsed, onToggleCollapse }: SidebarProps) {
  const pathname = usePathname()

  const menuItems = [
    {
      name: 'Dashboard',
      href: '/admin',
      icon: HomeIcon,
      exact: true
    },
    {
      name: 'School Information',
      href: '/admin/school',
      icon: BuildingOfficeIcon,
      exact: false
    },
    {
      name: 'Faculty Management',
      href: '/admin/faculty',
      icon: UserGroupIcon,
      exact: false
    },
    {
      name: 'News & Articles',
      href: '/admin/news',
      icon: NewspaperIcon,
      exact: false
    },
    {
      name: 'Hero Achievements',
      href: '/admin/achievements',
      icon: TrophyIcon,
      exact: false
    }
  ]

  const isActiveRoute = (href: string, exact: boolean) => {
    if (exact) {
      return pathname === href
    }
    return pathname.startsWith(href)
  }

  return (
    <div className={`
      bg-white border-r border-soft-beige transition-all duration-300 ease-in-out
      ${isCollapsed ? 'w-16' : 'w-64'}
      h-screen sticky top-0 flex flex-col
    `}>
      {/* Header */}
      <div className="p-4 border-b border-soft-beige">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div>
              <h2 className="text-lg font-bold text-terracotta-red">OIA Admin</h2>
              <p className="text-sm text-deep-teal/60">Content Management</p>
            </div>
          )}
          <button
            onClick={onToggleCollapse}
            className="p-2 rounded-lg hover:bg-soft-beige-lightest transition-colors"
          >
            {isCollapsed ? (
              <ChevronDoubleRightIcon className="w-5 h-5 text-deep-teal" />
            ) : (
              <ChevronDoubleLeftIcon className="w-5 h-5 text-deep-teal" />
            )}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = isActiveRoute(item.href, item.exact)
            
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`
                    flex items-center gap-3 p-3 rounded-lg transition-all duration-200
                    hover:bg-soft-beige-lightest group
                    ${isActive 
                      ? 'bg-terracotta-red text-white shadow-sm' 
                      : 'text-deep-teal hover:text-terracotta-red'
                    }
                  `}
                >
                  <Icon className={`
                    w-5 h-5 flex-shrink-0
                    ${isActive ? 'text-white' : 'text-deep-teal group-hover:text-terracotta-red'}
                  `} />
                  {!isCollapsed && (
                    <span className="font-medium truncate">{item.name}</span>
                  )}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-soft-beige">
        {!isCollapsed && (
          <div className="text-xs text-deep-teal/60 text-center">
            <p>OIA Academy CMS</p>
            <p>Version 2.0</p>
          </div>
        )}
      </div>
    </div>
  )
}