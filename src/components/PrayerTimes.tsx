'use client'

import { useState, useEffect } from 'react'

interface PrayerTime {
  name: string
  time: string
  arabicName: string
}

interface PrayerData {
  date: string
  hijriDate: string
  times: PrayerTime[]
  nextPrayer: string
  timeUntilNext: string
}

export default function PrayerTimes() {
  const [prayerData, setPrayerData] = useState<PrayerData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPrayerTimes = async () => {
      try {
        // Edmonton coordinates
        const latitude = 53.5461
        const longitude = -113.4938
        
        const today = new Date()
        const dateStr = today.toISOString().split('T')[0]
        
        const response = await fetch(
          `https://api.aladhan.com/v1/timings/${dateStr}?latitude=${latitude}&longitude=${longitude}&method=2`
        )
        
        if (!response.ok) {
          throw new Error('Failed to fetch prayer times')
        }
        
        const data = await response.json()
        const timings = data.data.timings
        const date = data.data.date
        
        const prayers: PrayerTime[] = [
          { name: 'Fajr', time: timings.Fajr, arabicName: 'الفجر' },
          { name: 'Sunrise', time: timings.Sunrise, arabicName: 'الشروق' },
          { name: 'Dhuhr', time: timings.Dhuhr, arabicName: 'الظهر' },
          { name: 'Asr', time: timings.Asr, arabicName: 'العصر' },
          { name: 'Maghrib', time: timings.Maghrib, arabicName: 'المغرب' },
          { name: 'Isha', time: timings.Isha, arabicName: 'العشاء' }
        ]
        
        // Calculate next prayer
        const now = new Date()
        const currentTime = now.getHours() * 60 + now.getMinutes()
        
        let nextPrayer = 'Fajr'
        let timeUntilNext = ''
        
        for (let i = 0; i < prayers.length; i++) {
          const prayer = prayers[i]
          if (prayer.name === 'Sunrise') continue // Skip sunrise for next prayer calculation
          
          const [hours, minutes] = prayer.time.split(':').map(Number)
          const prayerTime = hours * 60 + minutes
          
          if (currentTime < prayerTime) {
            nextPrayer = prayer.name
            const diff = prayerTime - currentTime
            const hoursLeft = Math.floor(diff / 60)
            const minutesLeft = diff % 60
            timeUntilNext = `${hoursLeft}h ${minutesLeft}m`
            break
          }
        }
        
        setPrayerData({
          date: date.gregorian.date,
          hijriDate: `${date.hijri.day} ${date.hijri.month.en} ${date.hijri.year}`,
          times: prayers,
          nextPrayer,
          timeUntilNext
        })
        setLoading(false)
      } catch (err) {
        console.error('Prayer times error:', err)
        setError('Unable to load prayer times')
        setLoading(false)
      }
    }

    fetchPrayerTimes()
    
    // Update every minute
    const interval = setInterval(fetchPrayerTimes, 60000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="bg-sage-green text-warm-white rounded-lg p-6 shadow-lg">
        <div className="animate-pulse">
          <div className="h-6 bg-sage-green-light rounded mb-4 w-1/2"></div>
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="flex justify-between">
                <div className="h-4 bg-sage-green-light rounded w-1/3"></div>
                <div className="h-4 bg-sage-green-light rounded w-1/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-sage-green text-warm-white rounded-lg p-6 shadow-lg">
        <h3 className="text-xl font-bold mb-4 flex items-center">
          <span className="text-2xl mr-2">🕌</span>
          Prayer Times
        </h3>
        <p className="text-sage-green-lighter">{error}</p>
        <p className="text-sm mt-2 text-sage-green-lighter">
          Please check back later or visit our mosque for accurate times.
        </p>
      </div>
    )
  }

  if (!prayerData) return null

  return (
    <div className="bg-sage-green text-warm-white rounded-lg p-6 shadow-lg">
      <h3 className="text-xl font-bold mb-4 flex items-center">
        <span className="text-2xl mr-2">🕌</span>
        Prayer Times
      </h3>
      
      <div className="mb-4 text-center">
        <p className="text-sage-green-lighter text-sm">
          {prayerData.date}
        </p>
        <p className="arabic-text text-sage-green-lighter text-sm">
          {prayerData.hijriDate}
        </p>
      </div>

      {prayerData.nextPrayer && prayerData.timeUntilNext && (
        <div className="bg-sage-green-dark rounded-lg p-3 mb-4 text-center">
          <p className="text-sm text-sage-green-lighter">Next Prayer</p>
          <p className="font-bold">{prayerData.nextPrayer}</p>
          <p className="text-sm text-sage-green-lighter">in {prayerData.timeUntilNext}</p>
        </div>
      )}

      <div className="space-y-2">
        {prayerData.times.map((prayer) => (
          <div 
            key={prayer.name} 
            className={`flex justify-between items-center p-2 rounded ${
              prayer.name === prayerData.nextPrayer 
                ? 'bg-sage-green-dark' 
                : ''
            }`}
          >
            <div className="flex items-center">
              <span className="font-medium mr-3">{prayer.name}</span>
              <span className="arabic-text text-sage-green-lighter text-sm">
                {prayer.arabicName}
              </span>
            </div>
            <span className="font-mono font-medium">
              {prayer.time}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-4 text-center">
        <p className="text-xs text-sage-green-lighter">
          Edmonton, AB • Updated automatically
        </p>
      </div>
    </div>
  )
}