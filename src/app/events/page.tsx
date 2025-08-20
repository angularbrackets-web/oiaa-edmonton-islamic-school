'use client'

import { useState, useEffect } from 'react'
import PrayerTimes from '@/components/PrayerTimes'

interface EventMedia {
  type: 'youtube' | 'streamable'
  url: string
  embedId: string
}

interface Event {
  id: string
  title: string
  subtitle: string
  date: string
  description: string
  type: string
  category: string
  media?: EventMedia
  location?: string
  ticketPrice?: number
  significance?: string
  featured: boolean
}

interface EventsData {
  pastEvents: Event[]
  upcomingEvents: Event[]
  eventCategories: Array<{
    id: string
    name: string
    description: string
    color: string
    icon: string
  }>
}

export default function EventsPage() {
  const [eventsData, setEventsData] = useState<EventsData | null>(null)
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/events')
      .then(res => res.json())
      .then(data => {
        setEventsData(data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Error loading events data:', err)
        setLoading(false)
      })
  }, [])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getEmbedUrl = (media: EventMedia) => {
    if (media.type === 'youtube') {
      return `https://www.youtube-nocookie.com/embed/${media.embedId}`
    } else if (media.type === 'streamable') {
      return `https://streamable.com/e/${media.embedId}`
    }
    return media.url
  }

  const filteredEvents = (events: Event[]) => {
    if (selectedCategory === 'all') return events
    return events.filter(event => event.category === selectedCategory)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-soft-beige-lightest">
        <div className="max-w-7xl mx-auto px-4 py-20">
          <div className="animate-pulse space-y-8">
            <div className="h-16 bg-soft-beige rounded max-w-2xl mx-auto"></div>
            <div className="h-12 bg-soft-beige rounded max-w-md mx-auto"></div>
            <div className="grid md:grid-cols-2 gap-8">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-64 bg-soft-beige rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!eventsData) {
    return (
      <div className="min-h-screen bg-soft-beige-lightest flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-terracotta-red mb-4">
            Unable to load events
          </h1>
          <p className="text-deep-teal">Please try again later.</p>
        </div>
      </div>
    )
  }

  const currentEvents = activeTab === 'upcoming' ? eventsData.upcomingEvents : eventsData.pastEvents

  return (
    <div className="min-h-screen bg-soft-beige-lightest">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-wood to-deep-teal text-warm-white py-20">
        <div className="absolute inset-0 islamic-pattern opacity-10"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Events & Updates
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed">
            Stay connected with our community through events, milestones, and important updates
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Tabs and Filters */}
            <div className="space-y-6">
              {/* Tab Navigation */}
              <div className="flex rounded-lg bg-warm-white p-1 shadow-md border border-soft-beige">
                <button
                  onClick={() => setActiveTab('upcoming')}
                  className={`flex-1 py-3 px-6 rounded-md font-semibold transition-all duration-200 ${
                    activeTab === 'upcoming'
                      ? 'bg-terracotta-red text-warm-white shadow-md'
                      : 'text-deep-teal hover:bg-soft-beige-lightest'
                  }`}
                >
                  Upcoming Events
                </button>
                <button
                  onClick={() => setActiveTab('past')}
                  className={`flex-1 py-3 px-6 rounded-md font-semibold transition-all duration-200 ${
                    activeTab === 'past'
                      ? 'bg-terracotta-red text-warm-white shadow-md'
                      : 'text-deep-teal hover:bg-soft-beige-lightest'
                  }`}
                >
                  Past Events
                </button>
              </div>

              {/* Category Filter */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                    selectedCategory === 'all'
                      ? 'bg-sage-green text-warm-white'
                      : 'bg-warm-white text-deep-teal hover:bg-soft-beige border border-soft-beige'
                  }`}
                >
                  All Categories
                </button>
                {eventsData.eventCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 flex items-center ${
                      selectedCategory === category.id
                        ? 'bg-sage-green text-warm-white'
                        : 'bg-warm-white text-deep-teal hover:bg-soft-beige border border-soft-beige'
                    }`}
                  >
                    <span className="mr-1">{category.icon}</span>
                    {category.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Events List */}
            <div className="space-y-8">
              {filteredEvents(currentEvents).length === 0 ? (
                <div className="text-center py-16">
                  <div className="text-6xl mb-4">📅</div>
                  <h3 className="text-2xl font-bold text-terracotta-red mb-2">
                    No events found
                  </h3>
                  <p className="text-deep-teal">
                    {activeTab === 'upcoming' 
                      ? 'Check back soon for upcoming events!' 
                      : 'No past events match your filter.'
                    }
                  </p>
                </div>
              ) : (
                filteredEvents(currentEvents).map((event) => (
                  <article key={event.id} className="bg-warm-white rounded-lg overflow-hidden shadow-lg border border-soft-beige">
                    <div className="md:flex">
                      {/* Media Section */}
                      {event.media && (
                        <div className="md:w-1/2">
                          <div className="aspect-video">
                            <iframe
                              src={getEmbedUrl(event.media)}
                              title={event.title}
                              frameBorder="0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                              className="w-full h-full"
                            ></iframe>
                          </div>
                        </div>
                      )}

                      {/* Content Section */}
                      <div className={`${event.media ? 'md:w-1/2' : 'w-full'} p-8`}>
                        <div className="flex items-center mb-4">
                          {event.featured && (
                            <span className="bg-terracotta-red text-warm-white px-3 py-1 rounded-full text-sm font-semibold mr-3">
                              Featured
                            </span>
                          )}
                          <span className="text-wood text-sm font-medium">
                            {formatDate(event.date)}
                          </span>
                        </div>

                        <h2 className="text-2xl md:text-3xl font-bold text-terracotta-red mb-2">
                          {event.title}
                        </h2>
                        
                        {event.subtitle && (
                          <p className="text-lg text-sage-green font-medium mb-4">
                            {event.subtitle}
                          </p>
                        )}

                        <p className="text-deep-teal mb-4 leading-relaxed">
                          {event.description}
                        </p>

                        {event.significance && (
                          <div className="bg-soft-beige-lightest rounded-lg p-4 mb-4">
                            <p className="text-deep-teal text-sm italic">
                              {event.significance}
                            </p>
                          </div>
                        )}

                        {/* Event Details */}
                        <div className="space-y-2 text-sm">
                          {event.location && (
                            <div className="flex items-center text-sage-green">
                              <span className="mr-2">📍</span>
                              <span>{event.location}</span>
                            </div>
                          )}
                          
                          {event.ticketPrice !== undefined && (
                            <div className="flex items-center text-wood">
                              <span className="mr-2">🎫</span>
                              <span>
                                {event.ticketPrice === 0 ? 'Free Event' : `$${event.ticketPrice}`}
                              </span>
                            </div>
                          )}

                          <div className="flex items-center text-deep-teal">
                            <span className="mr-2">🏷️</span>
                            <span className="capitalize">{event.category.replace('-', ' ')}</span>
                          </div>
                        </div>

                        {/* Action Button */}
                        {activeTab === 'upcoming' && (
                          <div className="mt-6">
                            <button className="bg-terracotta-red hover:bg-terracotta-red-dark text-warm-white px-6 py-3 rounded-lg font-semibold transition-colors duration-300">
                              Learn More
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </article>
                ))
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-8">
            {/* Prayer Times Widget */}
            <PrayerTimes />

            {/* Event Categories */}
            <div className="bg-warm-white rounded-lg p-6 shadow-lg border border-soft-beige">
              <h3 className="text-xl font-bold text-terracotta-red mb-4">
                Event Categories
              </h3>
              <div className="space-y-3">
                {eventsData.eventCategories.map((category) => (
                  <div key={category.id} className="flex items-start">
                    <div className="text-2xl mr-3">{category.icon}</div>
                    <div>
                      <h4 className="font-semibold text-deep-teal">
                        {category.name}
                      </h4>
                      <p className="text-sm text-sage-green">
                        {category.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Newsletter Signup */}
            <div className="bg-warm-white rounded-lg p-6 shadow-lg border border-soft-beige">
              <h3 className="text-xl font-bold text-terracotta-red mb-4">
                Stay Updated
              </h3>
              <p className="text-deep-teal mb-4 text-sm">
                Get notified about upcoming events and important announcements.
              </p>
              <div className="space-y-3">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="w-full px-4 py-3 border border-soft-beige rounded-lg focus:ring-2 focus:ring-terracotta-red focus:border-transparent"
                />
                <button className="w-full bg-sage-green hover:bg-sage-green-dark text-warm-white py-3 rounded-lg font-semibold transition-colors duration-300">
                  Subscribe
                </button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-warm-white rounded-lg p-6 shadow-lg border border-soft-beige">
              <h3 className="text-xl font-bold text-terracotta-red mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <a
                  href="/donate"
                  className="block w-full bg-terracotta-red hover:bg-terracotta-red-dark text-warm-white py-3 text-center rounded-lg font-semibold transition-colors duration-300"
                >
                  Support Our Projects
                </a>
                <a
                  href="#contact"
                  className="block w-full border-2 border-sage-green hover:bg-sage-green hover:text-warm-white text-sage-green py-3 text-center rounded-lg font-semibold transition-all duration-300"
                >
                  Contact Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}