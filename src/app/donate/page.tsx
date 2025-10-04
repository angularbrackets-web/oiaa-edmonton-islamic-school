'use client'

import { Heart, GraduationCap, Book, Users, Building, Utensils, Award, CreditCard } from 'lucide-react'

export default function DonatePage() {
  const donationCategories = [
    {
      title: 'General Donation',
      icon: Heart,
      description: 'Support overall school operations and educational excellence',
      color: 'from-terracotta-red to-terracotta-red-dark',
      suggested: ['$50', '$100', '$250', '$500']
    },
    {
      title: 'Student Scholarships',
      icon: GraduationCap,
      description: 'Help deserving students access quality Islamic education',
      color: 'from-sage-green to-deep-teal',
      suggested: ['$100', '$500', '$1,000', '$2,500']
    },
    {
      title: 'Library & Books',
      icon: Book,
      description: 'Build our Islamic and academic library collection',
      color: 'from-wood to-wood-dark',
      suggested: ['$25', '$50', '$100', '$250']
    },
    {
      title: 'Teacher Support',
      icon: Users,
      description: 'Professional development and teaching resources',
      color: 'from-deep-teal to-sage-green',
      suggested: ['$50', '$100', '$250', '$500']
    },
    {
      title: 'New Centre Fund',
      icon: Building,
      description: 'Contribute to our new Islamic education centre',
      color: 'from-terracotta-red to-wood',
      suggested: ['$250', '$500', '$1,000', '$5,000']
    },
    {
      title: 'Lunch Program',
      icon: Utensils,
      description: 'Provide nutritious meals for students in need',
      color: 'from-sage-green to-wood',
      suggested: ['$25', '$50', '$100', '$250']
    }
  ]

  const impactStats = [
    { number: '250+', label: 'Students Supported', icon: GraduationCap },
    { number: '$50K', label: 'Scholarships Given', icon: Award },
    { number: '15', label: 'Years of Excellence', icon: Building },
    { number: '100%', label: 'Transparent Usage', icon: Heart }
  ]

  const paymentMethods = [
    {
      name: 'E-Transfer',
      description: 'Send e-transfer to academy@oiacedmonton.ca',
      icon: CreditCard
    },
    {
      name: 'Cash/Cheque',
      description: 'Visit our office or mail cheque to our address',
      icon: Building
    },
    {
      name: 'Online Payment',
      description: 'Coming soon - Secure online donation portal',
      icon: Heart
    }
  ]

  return (
    <main className="min-h-screen pt-32">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-terracotta-red to-terracotta-red-dark py-20">
        <div className="absolute inset-0 bg-[url('/images/pattern-geometric.svg')] opacity-10"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-warm-white mb-6">Support OIA Academy</h1>
          <p className="text-xl md:text-2xl text-warm-white/90 max-w-3xl mx-auto mb-8">
            Your donation helps us provide exceptional Islamic education to the next generation
          </p>
          <p className="text-lg text-warm-white/80 max-w-2xl mx-auto">
            Every contribution, big or small, makes a lasting impact on our students and community
          </p>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-16 bg-warm-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            {impactStats.map((stat, index) => {
              const IconComponent = stat.icon
              return (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-terracotta-red to-terracotta-red-dark rounded-full mb-4">
                    <IconComponent className="w-8 h-8 text-warm-white" />
                  </div>
                  <div className="text-4xl font-bold text-deep-teal mb-2">{stat.number}</div>
                  <div className="text-deep-teal/70">{stat.label}</div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Donation Categories */}
      <section className="py-20 bg-soft-beige-lightest">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-deep-teal mb-4">Choose Your Impact</h2>
            <p className="text-xl text-deep-teal/70 max-w-2xl mx-auto">
              Select a category that resonates with your values
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {donationCategories.map((category, index) => {
              const IconComponent = category.icon
              return (
                <div key={index} className="bg-white rounded-2xl shadow-lg border border-soft-beige overflow-hidden hover:shadow-xl transition-all duration-300">
                  {/* Category Header */}
                  <div className={`bg-gradient-to-br ${category.color} p-6`}>
                    <IconComponent className="w-12 h-12 text-warm-white mb-3" />
                    <h3 className="text-2xl font-bold text-warm-white mb-2">{category.title}</h3>
                    <p className="text-warm-white/90 text-sm">{category.description}</p>
                  </div>

                  {/* Suggested Amounts */}
                  <div className="p-6">
                    <p className="text-sm text-deep-teal/70 mb-4 font-semibold">Suggested Amounts:</p>
                    <div className="grid grid-cols-2 gap-3">
                      {category.suggested.map((amount, idx) => (
                        <button
                          key={idx}
                          className="py-3 px-4 bg-soft-beige hover:bg-terracotta-red hover:text-warm-white rounded-lg font-semibold text-deep-teal transition-all duration-200 border border-soft-beige hover:border-terracotta-red"
                        >
                          {amount}
                        </button>
                      ))}
                    </div>
                    <button className="w-full mt-4 py-3 bg-gradient-to-br from-deep-teal to-sage-green text-warm-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300">
                      Donate Now
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Payment Methods */}
      <section className="py-20 bg-warm-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-deep-teal mb-4">How to Donate</h2>
            <p className="text-xl text-deep-teal/70">Multiple ways to contribute to our mission</p>
          </div>

          <div className="space-y-6">
            {paymentMethods.map((method, index) => {
              const IconComponent = method.icon
              return (
                <div key={index} className="bg-white rounded-xl p-6 shadow-md border border-soft-beige flex items-start space-x-4 hover:shadow-lg transition-all duration-300">
                  <div className="w-12 h-12 bg-gradient-to-br from-terracotta-red to-terracotta-red-dark rounded-lg flex items-center justify-center flex-shrink-0">
                    <IconComponent className="w-6 h-6 text-warm-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-deep-teal mb-2">{method.name}</h3>
                    <p className="text-deep-teal/70">{method.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Tax Receipt Info */}
      <section className="py-20 bg-soft-beige-lightest">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-deep-teal mb-6">Tax Receipts & Transparency</h2>
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-soft-beige">
            <p className="text-lg text-deep-teal/80 mb-6">
              OIA Academy is a registered charitable organization. All donations over $20 will receive a tax receipt for Canadian income tax purposes.
            </p>
            <div className="grid md:grid-cols-2 gap-6 text-left">
              <div className="bg-soft-beige/30 rounded-lg p-6">
                <h3 className="font-bold text-deep-teal mb-3 flex items-center space-x-2">
                  <Award className="w-5 h-5 text-terracotta-red" />
                  <span>Registered Charity</span>
                </h3>
                <p className="text-deep-teal/70 text-sm">
                  Charitable Registration #: 123456789RR0001
                </p>
              </div>
              <div className="bg-soft-beige/30 rounded-lg p-6">
                <h3 className="font-bold text-deep-teal mb-3 flex items-center space-x-2">
                  <Heart className="w-5 h-5 text-terracotta-red" />
                  <span>100% Transparent</span>
                </h3>
                <p className="text-deep-teal/70 text-sm">
                  Annual reports available upon request showing how donations are utilized
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20 bg-gradient-to-br from-deep-teal to-sage-green">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-warm-white mb-6">Questions About Donating?</h2>
          <p className="text-xl text-warm-white/90 mb-12 max-w-2xl mx-auto">
            Our team is here to help you make the most meaningful impact
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:+17801234567"
              className="bg-warm-white text-deep-teal px-8 py-4 rounded-lg font-semibold text-lg hover:bg-soft-beige transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Call (780) 123-4567
            </a>
            <a
              href="mailto:academy@oiacedmonton.ca"
              className="bg-transparent border-2 border-warm-white text-warm-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-warm-white/10 transition-all duration-300"
            >
              Email Us
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}