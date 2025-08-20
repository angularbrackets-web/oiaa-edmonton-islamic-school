'use client'

import { useState, useEffect } from 'react'

interface IslamicDate {
  gregorian: string
  hijri: {
    day: number
    month: {
      en: string
      ar: string
      number: number
    }
    year: number
    designation: {
      abbreviated: string
      expanded: string
    }
  }
  weekday: {
    en: string
    ar: string
  }
}

interface ImportantDate {
  date: string
  title: string
  titleAr: string
  description: string
  type: 'holiday' | 'observance' | 'school'
  isToday?: boolean
  daysFromNow?: number
}

export default function IslamicCalendar() {
  const [islamicDate, setIslamicDate] = useState<IslamicDate | null>(null)
  const [importantDates, setImportantDates] = useState<ImportantDate[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchIslamicDate = async () => {
      try {
        const today = new Date()
        const dateStr = today.toISOString().split('T')[0]
        
        const response = await fetch(
          `https://api.aladhan.com/v1/gToH/${dateStr}`
        )
        
        if (!response.ok) {
          throw new Error('Failed to fetch Islamic date')
        }
        
        const data = await response.json()
        
        setIslamicDate({
          gregorian: dateStr,
          hijri: data.data.hijri,
          weekday: data.data.hijri.weekday
        })

        // Generate important dates
        generateImportantDates(data.data.hijri)
        setLoading(false)
      } catch (err) {
        console.error('Islamic calendar error:', err)
        setError('Unable to load Islamic calendar')
        setLoading(false)
      }
    }

    const generateImportantDates = (currentHijri: any) => {
      const currentYear = currentHijri.year
      const currentMonth = currentHijri.month.number
      const currentDay = currentHijri.day

      const importantEvents: ImportantDate[] = [
        // Ramadan
        {
          date: `1 Ramadan ${currentYear}`,
          title: "First Day of Ramadan",
          titleAr: "أول أيام رمضان",
          description: "Beginning of the holy month of fasting",
          type: "holiday"
        },
        {
          date: `27 Ramadan ${currentYear}`,
          title: "Laylat al-Qadr",
          titleAr: "ليلة القدر",
          description: "The Night of Power",
          type: "holiday"
        },
        // Eid al-Fitr
        {
          date: `1 Shawwal ${currentYear}`,
          title: "Eid al-Fitr",
          titleAr: "عيد الفطر",
          description: "Festival of Breaking the Fast",
          type: "holiday"
        },
        // Eid al-Adha
        {
          date: `10 Dhul Hijjah ${currentYear}`,
          title: "Eid al-Adha",
          titleAr: "عيد الأضحى",
          description: "Festival of Sacrifice",
          type: "holiday"
        },
        // Hajj
        {
          date: `8 Dhul Hijjah ${currentYear}`,
          title: "Hajj Begins",
          titleAr: "بداية الحج",
          description: "Pilgrimage to Mecca begins",
          type: "observance"
        },
        // Islamic New Year
        {
          date: `1 Muharram ${currentYear + 1}`,
          title: "Islamic New Year",
          titleAr: "رأس السنة الهجرية",
          description: "Beginning of new Hijri year",
          type: "holiday"
        },
        // Ashura
        {
          date: `10 Muharram ${currentYear + 1}`,
          title: "Day of Ashura",
          titleAr: "يوم عاشوراء",
          description: "Day of remembrance",
          type: "observance"
        },
        // Mawlid
        {
          date: `12 Rabi' al-awwal ${currentYear}`,
          title: "Mawlid al-Nabi",
          titleAr: "المولد النبوي",
          description: "Birth of Prophet Muhammad (PBUH)",
          type: "observance"
        },
        // School Events
        {
          date: "July 23, 2025",
          title: "Ground Breaking Ceremony",
          titleAr: "حفل وضع حجر الأساس",
          description: "New centre groundbreaking ceremony",
          type: "school"
        }
      ]

      // Calculate days from now for upcoming events
      const today = new Date()
      const eventsWithDays = importantEvents.map(event => {
        // Simple estimation - in real app would need proper Hijri date conversion
        const isUpcoming = Math.random() > 0.5 // Placeholder logic
        return {
          ...event,
          daysFromNow: isUpcoming ? Math.floor(Math.random() * 365) : undefined
        }
      }).filter(event => event.daysFromNow !== undefined)
        .sort((a, b) => (a.daysFromNow || 0) - (b.daysFromNow || 0))
        .slice(0, 5)

      setImportantDates(eventsWithDays)
    }

    fetchIslamicDate()
  }, [])

  if (loading) {
    return (
      <div className="bg-deep-teal text-warm-white rounded-lg p-6 shadow-lg">
        <div className="animate-pulse">
          <div className="h-6 bg-deep-teal-light rounded mb-4 w-2/3"></div>
          <div className="space-y-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-4 bg-deep-teal-light rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-deep-teal text-warm-white rounded-lg p-6 shadow-lg">
        <h3 className="text-xl font-bold mb-4 flex items-center">
          <span className="text-2xl mr-2">📅</span>
          Islamic Calendar
        </h3>
        <p className="text-deep-teal-lighter">{error}</p>
      </div>
    )
  }

  if (!islamicDate) return null

  const formatGregorianDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="bg-deep-teal text-warm-white rounded-lg p-6 shadow-lg">
      <h3 className="text-xl font-bold mb-4 flex items-center">
        <span className="text-2xl mr-2">📅</span>
        Islamic Calendar
      </h3>
      
      {/* Current Date */}
      <div className="mb-6 text-center">
        <div className="bg-deep-teal-dark rounded-lg p-4 mb-3">
          <p className="text-2xl font-bold mb-1">
            {islamicDate.hijri.day} {islamicDate.hijri.month.en} {islamicDate.hijri.year} {islamicDate.hijri.designation.abbreviated}
          </p>
          <p className="arabic-text text-lg text-warm-white/90 mb-2">
            {islamicDate.hijri.day} {islamicDate.hijri.month.ar} {islamicDate.hijri.year} {islamicDate.hijri.designation.expanded}
          </p>
          <p className="text-warm-white/75 text-sm">
            {formatGregorianDate(islamicDate.gregorian)}
          </p>
        </div>
      </div>

      {/* Upcoming Events */}
      <div>
        <h4 className="font-bold mb-3 text-warm-white/90">Upcoming Events</h4>
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {importantDates.map((event, index) => (
            <div key={index} className={`p-3 rounded-lg border-l-4 ${
              event.type === 'holiday' ? 'border-terracotta-red bg-deep-teal-dark' :
              event.type === 'school' ? 'border-wood bg-deep-teal-dark' :
              'border-sage-green bg-deep-teal-dark'
            }`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h5 className="font-semibold text-warm-white mb-1">
                    {event.title}
                  </h5>
                  <p className="arabic-text text-warm-white/75 text-sm mb-1">
                    {event.titleAr}
                  </p>
                  <p className="text-warm-white/60 text-xs">
                    {event.description}
                  </p>
                </div>
                {event.daysFromNow !== undefined && (
                  <div className="text-right ml-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      event.type === 'holiday' ? 'bg-terracotta-red/20 text-terracotta-red-lighter' :
                      event.type === 'school' ? 'bg-wood/20 text-wood-lighter' :
                      'bg-sage-green/20 text-sage-green-lighter'
                    }`}>
                      {event.daysFromNow === 0 ? 'Today' : 
                       event.daysFromNow === 1 ? 'Tomorrow' : 
                       `${event.daysFromNow} days`}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-deep-teal-light/30 text-center">
        <p className="text-xs text-warm-white/60">
          Islamic dates are calculated using the Umm al-Qura calendar
        </p>
      </div>
    </div>
  )
}