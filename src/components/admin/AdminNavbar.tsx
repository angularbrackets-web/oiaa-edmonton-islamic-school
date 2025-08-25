'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  BellIcon, 
  Cog6ToothIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  EyeIcon
} from '@heroicons/react/24/outline'

interface NavbarProps {
  title?: string
}

export default function AdminNavbar({ title = 'Dashboard' }: NavbarProps) {
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)

  return (
    <header className="bg-white border-b border-soft-beige sticky top-0 z-40">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Page Title */}
          <div>
            <h1 className="text-2xl font-bold text-terracotta-red">{title}</h1>
            <p className="text-sm text-deep-teal/60">
              Manage your school's content and information
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            {/* View Site Button */}
            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-2 px-4 py-2 bg-sage-green hover:bg-sage-green-dark text-white rounded-lg transition-colors"
            >
              <EyeIcon className="w-4 h-4" />
              <span className="hidden sm:inline">View Site</span>
            </Link>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-lg hover:bg-soft-beige-lightest transition-colors relative"
              >
                <BellIcon className="w-5 h-5 text-deep-teal" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-terracotta-red rounded-full"></span>
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-soft-beige z-50">
                  <div className="p-4 border-b border-soft-beige">
                    <h3 className="font-semibold text-deep-teal">Notifications</h3>
                  </div>
                  <div className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-start gap-3 p-3 bg-sage-green-lighter rounded-lg">
                        <div className="w-2 h-2 bg-sage-green rounded-full mt-2"></div>
                        <div>
                          <p className="text-sm font-medium text-deep-teal">Faculty Updated</p>
                          <p className="text-xs text-deep-teal/60">New teacher profile added successfully</p>
                          <p className="text-xs text-deep-teal/40 mt-1">2 minutes ago</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-terracotta-red-lighter rounded-lg">
                        <div className="w-2 h-2 bg-terracotta-red rounded-full mt-2"></div>
                        <div>
                          <p className="text-sm font-medium text-deep-teal">Achievement Added</p>
                          <p className="text-xs text-deep-teal/60">New hero achievement card created</p>
                          <p className="text-xs text-deep-teal/40 mt-1">1 hour ago</p>
                        </div>
                      </div>
                    </div>
                    <button className="w-full mt-4 text-sm text-terracotta-red hover:text-terracotta-red-dark transition-colors">
                      View all notifications
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Settings */}
            <button className="p-2 rounded-lg hover:bg-soft-beige-lightest transition-colors">
              <Cog6ToothIcon className="w-5 h-5 text-deep-teal" />
            </button>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-soft-beige-lightest transition-colors"
              >
                <UserCircleIcon className="w-8 h-8 text-deep-teal" />
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium text-deep-teal">Admin User</p>
                  <p className="text-xs text-deep-teal/60">admin@oiaaedmonton.ca</p>
                </div>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-soft-beige z-50">
                  <div className="p-2">
                    <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-deep-teal hover:bg-soft-beige-lightest rounded-lg transition-colors">
                      <UserCircleIcon className="w-4 h-4" />
                      Profile Settings
                    </button>
                    <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-deep-teal hover:bg-soft-beige-lightest rounded-lg transition-colors">
                      <Cog6ToothIcon className="w-4 h-4" />
                      Preferences
                    </button>
                    <hr className="my-2 border-soft-beige" />
                    <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-terracotta-red hover:bg-terracotta-red-lighter rounded-lg transition-colors">
                      <ArrowRightOnRectangleIcon className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}