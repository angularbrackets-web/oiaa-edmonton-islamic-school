'use client'

import { useState, useEffect } from 'react'
import PrayerTimes from '@/components/PrayerTimes'

interface DonationData {
  donation: {
    title: string
    subtitle: string
    methods: Array<{
      type: string
      title: string
      description: string
      widget?: string
      email?: string
      instructions?: string
      featured: boolean
    }>
    campaigns: Array<{
      id: string
      title: string
      description: string
      goal: number
      raised: number
      percentage: number
      priority: string
      color: string
    }>
    impactAreas: Array<{
      title: string
      description: string
      icon: string
      allocation: number
    }>
  }
}

export default function DonatePage() {
  const [donationData, setDonationData] = useState<DonationData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/donation')
      .then(res => res.json())
      .then(data => {
        setDonationData(data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Error loading donation data:', err)
        setLoading(false)
      })

    // Load Keela widget script
    const script = document.createElement('script')
    script.src = 'https://give-can.keela.co/embed.js'
    script.async = true
    document.head.appendChild(script)

    return () => {
      // Cleanup script on unmount
      const existingScript = document.querySelector('script[src="https://give-can.keela.co/embed.js"]')
      if (existingScript) {
        existingScript.remove()
      }
    }
  }, [])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-soft-beige-lightest">
        <div className="max-w-7xl mx-auto px-4 py-20">
          <div className="animate-pulse space-y-8">
            <div className="h-16 bg-soft-beige rounded max-w-2xl mx-auto"></div>
            <div className="h-64 bg-soft-beige rounded"></div>
            <div className="grid md:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-48 bg-soft-beige rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!donationData) {
    return (
      <div className="min-h-screen bg-soft-beige-lightest flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-terracotta-red mb-4">
            Unable to load donation information
          </h1>
          <p className="text-deep-teal">Please try again later.</p>
        </div>
      </div>
    )
  }

  const { donation } = donationData

  return (
    <div className="min-h-screen bg-soft-beige-lightest">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-terracotta-red to-sage-green text-warm-white py-20">
        <div className="absolute inset-0 islamic-pattern opacity-10"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            {donation.title}
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed">
            {donation.subtitle}
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-16">
            {/* Donation Methods */}
            <section>
              <h2 className="text-3xl md:text-4xl font-bold text-terracotta-red mb-8">
                Ways to Give
              </h2>
              
              <div className="space-y-8">
                {donation.methods.map((method, index) => (
                  <div key={index} className={`bg-warm-white rounded-lg p-8 shadow-lg border border-soft-beige ${
                    method.featured ? 'ring-2 ring-terracotta-red' : ''
                  }`}>
                    {method.featured && (
                      <div className="flex items-center mb-4">
                        <span className="bg-terracotta-red text-warm-white px-3 py-1 rounded-full text-sm font-semibold">
                          Recommended
                        </span>
                      </div>
                    )}
                    
                    <h3 className="text-2xl font-bold text-terracotta-red mb-4">
                      {method.title}
                    </h3>
                    <p className="text-deep-teal mb-6">
                      {method.description}
                    </p>

                    {method.type === 'keela_widget' && method.widget && (
                      <div 
                        className="keela-widget-container"
                        dangerouslySetInnerHTML={{ __html: method.widget }}
                      />
                    )}

                    {method.type === 'e_transfer' && (
                      <div className="bg-soft-beige-lightest rounded-lg p-6">
                        <p className="text-deep-teal mb-4">
                          {method.instructions}
                        </p>
                        <div className="bg-terracotta-red/10 border border-terracotta-red/20 rounded-lg p-4">
                          <p className="text-terracotta-red font-semibold text-center">
                            📧 {method.email}
                          </p>
                        </div>
                        <p className="text-sm text-sage-green mt-4 text-center">
                          No password required • Secure transfer
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Campaign Progress */}
            <section>
              <h2 className="text-3xl md:text-4xl font-bold text-terracotta-red mb-8">
                Current Campaigns
              </h2>
              
              <div className="grid md:grid-cols-1 gap-6">
                {donation.campaigns.map((campaign) => (
                  <div key={campaign.id} className="bg-warm-white rounded-lg p-8 shadow-lg border border-soft-beige">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-2xl font-bold text-terracotta-red">
                        {campaign.title}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        campaign.priority === 'high' 
                          ? 'bg-terracotta-red text-warm-white' 
                          : 'bg-soft-beige text-deep-teal'
                      }`}>
                        {campaign.priority} priority
                      </span>
                    </div>
                    
                    <p className="text-deep-teal mb-6">
                      {campaign.description}
                    </p>

                    <div className="space-y-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-deep-teal">Progress</span>
                        <span className="text-terracotta-red font-semibold">
                          {formatCurrency(campaign.raised)} of {formatCurrency(campaign.goal)}
                        </span>
                      </div>
                      
                      <div className="w-full bg-soft-beige rounded-full h-4">
                        <div 
                          className={`bg-${campaign.color} h-4 rounded-full transition-all duration-500`}
                          style={{width: `${Math.min(campaign.percentage, 100)}%`}}
                        ></div>
                      </div>
                      
                      <div className="flex justify-between text-sm">
                        <span className="text-sage-green font-medium">
                          {campaign.percentage.toFixed(1)}% Complete
                        </span>
                        <span className="text-wood font-medium">
                          {formatCurrency(campaign.goal - campaign.raised)} remaining
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Impact Areas */}
            <section>
              <h2 className="text-3xl md:text-4xl font-bold text-terracotta-red mb-8">
                Your Impact
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                {donation.impactAreas.map((area, index) => (
                  <div key={index} className="bg-warm-white rounded-lg p-6 shadow-lg border border-soft-beige">
                    <div className="flex items-start mb-4">
                      <div className="text-3xl mr-4">{area.icon}</div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-terracotta-red mb-2">
                          {area.title}
                        </h3>
                        <p className="text-deep-teal text-sm mb-3">
                          {area.description}
                        </p>
                        <div className="flex items-center">
                          <div className="flex-1 bg-soft-beige rounded-full h-2 mr-3">
                            <div 
                              className="bg-sage-green h-2 rounded-full"
                              style={{width: `${area.allocation}%`}}
                            ></div>
                          </div>
                          <span className="text-sage-green font-semibold text-sm">
                            {area.allocation}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-8">
            {/* Prayer Times Widget */}
            <PrayerTimes />

            {/* Quick Donate */}
            <div className="bg-warm-white rounded-lg p-6 shadow-lg border border-soft-beige">
              <h3 className="text-xl font-bold text-terracotta-red mb-4">
                Quick Donate
              </h3>
              <div className="space-y-3">
                <button className="w-full bg-terracotta-red hover:bg-terracotta-red-dark text-warm-white py-3 rounded-lg font-semibold transition-colors duration-300">
                  $25
                </button>
                <button className="w-full bg-sage-green hover:bg-sage-green-dark text-warm-white py-3 rounded-lg font-semibold transition-colors duration-300">
                  $50
                </button>
                <button className="w-full bg-wood hover:bg-wood-dark text-warm-white py-3 rounded-lg font-semibold transition-colors duration-300">
                  $100
                </button>
                <button className="w-full border-2 border-terracotta-red hover:bg-terracotta-red hover:text-warm-white text-terracotta-red py-3 rounded-lg font-semibold transition-all duration-300">
                  Custom Amount
                </button>
              </div>
            </div>

            {/* Tax Info */}
            <div className="bg-warm-white rounded-lg p-6 shadow-lg border border-soft-beige">
              <h3 className="text-xl font-bold text-terracotta-red mb-4">
                Tax Information
              </h3>
              <p className="text-deep-teal mb-4 text-sm">
                OIA Academy Edmonton is a registered charity. All donations are tax-deductible.
              </p>
              <div className="text-center">
                <p className="text-sage-green font-semibold text-sm">
                  CRA Registration #: 123456789RR0001
                </p>
              </div>
            </div>

            {/* Contact for Large Donations */}
            <div className="bg-warm-white rounded-lg p-6 shadow-lg border border-soft-beige">
              <h3 className="text-xl font-bold text-terracotta-red mb-4">
                Major Gifts
              </h3>
              <p className="text-deep-teal mb-4 text-sm">
                For donations over $1,000 or planned giving, please contact our development team.
              </p>
              <a 
                href="mailto:development@oiacedmonton.ca"
                className="block w-full bg-deep-teal hover:bg-deep-teal/90 text-warm-white py-3 text-center rounded-lg font-semibold transition-colors duration-300"
              >
                Contact Development
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}