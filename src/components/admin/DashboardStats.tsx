'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  BuildingOfficeIcon, 
  UserGroupIcon, 
  TrophyIcon,
  PlusIcon,
  ArrowTrendingUpIcon,
  EyeIcon
} from '@heroicons/react/24/outline'

interface Stats {
  schoolInfo: any
  faculty: any
  achievements: any
}

export default function DashboardStats() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [schoolResponse, facultyResponse, achievementsResponse] = await Promise.all([
          fetch('/api/school-info'),
          fetch('/api/faculty'),
          fetch('/api/achievements')
        ])

        const [schoolData, facultyData, achievementsData] = await Promise.all([
          schoolResponse.json(),
          facultyResponse.json(),
          achievementsResponse.json()
        ])

        setStats({
          schoolInfo: schoolData,
          faculty: facultyData,
          achievements: achievementsData
        })
      } catch (error) {
        console.error('Error loading stats:', error)
      } finally {
        setLoading(false)
      }
    }

    loadStats()
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg p-6 shadow-sm border border-soft-beige">
            <div className="animate-pulse">
              <div className="flex items-center justify-between mb-4">
                <div className="w-8 h-8 bg-soft-beige rounded"></div>
                <div className="w-16 h-4 bg-soft-beige rounded"></div>
              </div>
              <div className="w-24 h-8 bg-soft-beige rounded mb-2"></div>
              <div className="w-32 h-4 bg-soft-beige rounded"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  const statCards = [
    {
      title: 'School Information',
      value: stats?.schoolInfo?.school?.name ? '✓ Complete' : 'Needs Setup',
      count: '1',
      icon: BuildingOfficeIcon,
      color: 'terracotta-red',
      href: '/admin/school',
      description: 'Basic school details and contact info'
    },
    {
      title: 'Faculty Members',
      value: stats?.faculty?.faculty?.length || 0,
      count: `${stats?.faculty?.faculty?.length || 0} total`,
      icon: UserGroupIcon,
      color: 'sage-green',
      href: '/admin/faculty',
      description: 'Teaching staff and profiles'
    },
    {
      title: 'Hero Achievements',
      value: stats?.achievements?.achievements?.length || 0,
      count: `${stats?.achievements?.achievements?.length || 0} active`,
      icon: TrophyIcon,
      color: 'deep-teal',
      href: '/admin/achievements',
      description: 'Achievement cards in hero section'
    }
  ]

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((card) => {
          const Icon = card.icon
          return (
            <Link 
              key={card.title}
              href={card.href}
              className="bg-white rounded-lg p-6 shadow-sm border border-soft-beige hover:shadow-md transition-all duration-200 group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg bg-${card.color}-lighter`}>
                  <Icon className={`w-6 h-6 text-${card.color}`} />
                </div>
                <div className="text-right">
                  <ArrowTrendingUpIcon className="w-4 h-4 text-sage-green ml-auto" />
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-deep-teal group-hover:text-terracotta-red transition-colors">
                  {card.title}
                </h3>
                <div className="flex items-baseline gap-2">
                  <span className={`text-2xl font-bold text-${card.color}`}>
                    {card.value}
                  </span>
                  <span className="text-sm text-deep-teal/60">{card.count}</span>
                </div>
                <p className="text-sm text-deep-teal/60">{card.description}</p>
              </div>
            </Link>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-soft-beige">
        <h2 className="text-xl font-bold text-terracotta-red mb-6">Quick Actions</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link
            href="/admin/faculty"
            className="flex items-center gap-3 p-4 bg-sage-green-lighter hover:bg-sage-green-light rounded-lg transition-colors group"
          >
            <div className="p-2 bg-sage-green rounded-lg">
              <PlusIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-sage-green-dark group-hover:text-sage-green-darker">
                Add Faculty Member
              </h3>
              <p className="text-sm text-sage-green-dark/70">Create new teacher profile</p>
            </div>
          </Link>

          <Link
            href="/admin/achievements"
            className="flex items-center gap-3 p-4 bg-deep-teal-lighter hover:bg-deep-teal-light rounded-lg transition-colors group"
          >
            <div className="p-2 bg-deep-teal rounded-lg">
              <PlusIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-deep-teal-dark group-hover:text-deep-teal-darker">
                Add Achievement
              </h3>
              <p className="text-sm text-deep-teal-dark/70">Create hero achievement card</p>
            </div>
          </Link>

          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 p-4 bg-terracotta-red-lighter hover:bg-terracotta-red-light rounded-lg transition-colors group"
          >
            <div className="p-2 bg-terracotta-red rounded-lg">
              <EyeIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-terracotta-red-dark group-hover:text-terracotta-red-darker">
                Preview Website
              </h3>
              <p className="text-sm text-terracotta-red-dark/70">View live site in new tab</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-soft-beige">
        <h2 className="text-xl font-bold text-terracotta-red mb-6">Recent Activity</h2>
        
        <div className="space-y-4">
          <div className="flex items-start gap-4 p-4 bg-soft-beige-lightest rounded-lg">
            <div className="w-2 h-2 bg-sage-green rounded-full mt-2"></div>
            <div className="flex-1">
              <p className="font-medium text-deep-teal">Faculty data migrated to Supabase</p>
              <p className="text-sm text-deep-teal/60">All teacher profiles now stored in database</p>
              <p className="text-xs text-deep-teal/40 mt-1">Today</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 bg-soft-beige-lightest rounded-lg">
            <div className="w-2 h-2 bg-deep-teal rounded-full mt-2"></div>
            <div className="flex-1">
              <p className="font-medium text-deep-teal">Achievement management enabled</p>
              <p className="text-sm text-deep-teal/60">Hero section achievements can now be edited</p>
              <p className="text-xs text-deep-teal/40 mt-1">Today</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 bg-soft-beige-lightest rounded-lg">
            <div className="w-2 h-2 bg-terracotta-red rounded-full mt-2"></div>
            <div className="flex-1">
              <p className="font-medium text-deep-teal">Admin panel redesigned</p>
              <p className="text-sm text-deep-teal/60">Modern interface with improved navigation</p>
              <p className="text-xs text-deep-teal/40 mt-1">Today</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}